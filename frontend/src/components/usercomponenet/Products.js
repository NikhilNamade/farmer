import React, { useEffect, useState } from 'react'
import { useAppContext } from "../context/createContext";
import { useNavigate } from "react-router-dom"
const Products = () => {
  const navigate = useNavigate();
  const { productType, productName, click } = useAppContext();
  const [products, setProducts] = useState([])
  const [quantity, setQuantity] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [location, setLocation] = useState({ lat: "", lng: "" })
  const handleviewmap = (id) => {
    console.log(id)
    navigate(`/map/${id}`);
  }
  // fetch current position
  const currentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
      })
    }
  }
  // Function to calculate distance using Haversine formula
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };
  // handle all product quantity
  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value > 0 ? value : 1, // Ensure quantity is always at least 1
    }));
  };
  //habdle preorder
  const handlepreoderSubmit = async (id) => {
    const response = await fetch("https://farmer-backend-8ww4.onrender.com/api/product/preorder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ productId: id, quantity }),
    })
    const data = await response.json();
    if (data.success) {
      alert("Preorder");
    } else {
      alert("not order")
    }
  }
  const fetchallproduct = async () => {
    const response = await fetch("https://farmer-backend-8ww4.onrender.com/api/product/fetch", {
      method: "GET",
    });
    const data = await response.json();
    if (data.success && data.data) {
      // Sort shops based on distance from the user's location
      const sortedProducts = data.data.sort((a, b) => {
        const distanceA = calculateDistance(
          location.lat,
          location.lng,
          a.location.lat,
          a.location.lng
        );
        const distanceB = calculateDistance(
          location.lat,
          location.lng,
          b.location.lat,
          b.location.lng
        );
        return distanceA - distanceB; // Sort by ascending distance
      });

      setProducts(sortedProducts);
    }
  }
  const fetchbyproducttype = async () => {
    if (productType) {
      const response = await fetch(`https://farmer-backend-8ww4.onrender.com/api/product/fetchbytype/${productType}`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.success && data.data) {
        // Sort shops based on distance from the user's location
        const sortedProducts = data.data.sort((a, b) => {
          const distanceA = calculateDistance(
            location.lat,
            location.lng,
            a.location.lat,
            a.location.lng
          );
          const distanceB = calculateDistance(
            location.lat,
            location.lng,
            b.location.lat,
            b.location.lng
          );
          return distanceA - distanceB; // Sort by ascending distance
        });

        setTimeout(() => {
          setProducts(sortedProducts);
        }, 1000);
      }
    }
  }

  const fetchbyproductname = async () => {
    if (productName && click) {
      const response = await fetch(`https://farmer-backend-8ww4.onrender.com/api/product/fetchbyname/${productName}`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.success && data.data) {
        // Sort shops based on distance from the user's location
        const sortedProducts = data.data.sort((a, b) => {
          const distanceA = calculateDistance(
            location.lat,
            location.lng,
            a.location.lat,
            a.location.lng
          );
          const distanceB = calculateDistance(
            location.lat,
            location.lng,
            b.location.lat,
            b.location.lng
          );
          return distanceA - distanceB; // Sort by ascending distance
        });

        setTimeout(() => {
          setProducts(sortedProducts);
        }, 1000);
      }
    }
  }

  useEffect(() => {
    fetchallproduct();
  }, [])
  useEffect(() => {
    fetchbyproducttype();
  }, [fetchbyproducttype()])
  useEffect(() => {
    currentLocation()
  }, [currentLocation()])
  useEffect(() => {
    fetchbyproductname();
  }, [fetchbyproductname()])
  return (
    <div style={{
      position: "absolute",
      top: "20vmin",
      width: "100%",
    }}>
      <div className="products" style={{ width: "100%", height: "80vh", padding: "5vmin", display: "flex", alignItems: "center", justifyContent: "space-around", flexWrap: "wrap", flexDirection: "row" }}>
        {products && products.length > 0 ? (
          products.map((product) => (
            <div class="product" style={{ width: "45%", justifyContent: "space-between" }}>
              <div class="productpic">
                <img src={product.productImg ? product.productImg : "https://cdn.pixabay.com/photo/2022/09/05/09/50/tomatoes-7433786_1280.jpg"} id="veggie" />
              </div>
              <div class="info">
                <div className="productbox">
                  <p>Owner Name : {product.ownerName ? product.ownerName : "Owner Name"} </p>
                  <p>Product Name : {product.productName ? product.productName : "Product Name"} </p>
                  <p>Owner Type : {product.ownerType ? product.ownerType : "ownerType"} </p>
                </div>
                <div className="productbox">
                  <p>Product Type : {product.productType ? product.productType : "ProductType"} </p>
                  <p>Quantity : {product.quantity ? product.quantity : "Quantity"}/{product.unitType ? product.unitType : ""} </p>
                  <p>
                    Price : {" "}
                    {product.price
                      ? product.price *
                      (quantities[product._id] || 1)
                      : "Price"}
                    Rs/{product.unitType ? product.unitType : ""}
                  </p>
                </div>
                <div className="productbox">
                  <div>
                    <div>Preoder :
                      <input type="Number" onChange={(e) => { setQuantity(e.target.value); handleQuantityChange(product._id, parseInt(e.target.value)) }} id="quantity" name="quantity" style={{ padding: "0.5vmin", fontSize: "1.5vmin", width: "25vmin", borderRadius: "0.5vmin" }} placeholder="Enter the quantity You required" required />
                      <button onClick={() => handlepreoderSubmit(product._id)} style={{ fontSize: "1.5vmin", boder: "1px solid black", borderRadius: "0.5vmin", marginLeft: "0.5vmin" }}>Preorder</button>
                    </div>
                    <p style={{ color: "red", fontSize: "1.5vmin" }}>You can only preorder upto half quantity of available stock</p>
                  </div>
                  <div>
                    <button onClick={() => handleviewmap(product._id)} style={{ fontSize: "1.5vmin", boder: "1px solid black", borderRadius: "0.5vmin" }}>View Location</button>
                  </div>

                </div>
              </div>
            </div >
          ))
        ) : (<p>Products Not Available</p>)}
      </div>
    </div>
  )
}

export default Products