import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom"
const demo = require("../demo.jpg");
const Profile = () => {
  const navigate = useNavigate();
  const [Data, setData] = useState(null);
  const [products, setProduct] = useState([]);
  const [preorders, setpreorders] = useState([]);
  const [productup, setProductup] = useState([]);
  const [credentials, setCredentials] = useState({ productName: "", price: "", quantity: "", unitType: "", productType: "", productImg: "" });
  const cancel = () => {
    navigate("/")
  }

  // handle onchange for update
  const handleOnchange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  }
  // fetch product by id
  const open = async (id) => {
    const productupdateform = document.querySelector(".productupdateform");
    productupdateform.style.display = "block"
    const response = await fetch(`https://farmer-backend-8ww4.onrender.com/api/product/fetch/${id}`, {
      method: "GET",
    })
    const data = await response.json();
    setProductup(data.data);
    setCredentials(data.data);
  }
  const close = () => {
    const productupdateform = document.querySelector(".productupdateform");
    productupdateform.style.display = "none"
  }
  // delete product
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`https://farmer-backend-8ww4.onrender.com/api/product/deleteproduct/${id}`, {
        method: "DELETE",
      })
      alert("Product Deleted")
    } catch (error) {
      console.error(error);
    }

  }
  //update product
  const handleformupdate = async (e, id) => {
    e.preventDefault();
    console.log(id)
    try {
      const formdata = new FormData();
      formdata.append("productName", credentials.productName)
      formdata.append("price", credentials.price)
      formdata.append("quantity", credentials.quantity)
      formdata.append("unitType", credentials.unitType)
      formdata.append("productType", credentials.productType)
      const response = await fetch(`https://farmer-backend-8ww4.onrender.com/api/product/update/${id}`, {
        method: "PUT",
        body: formdata,
      })
      const data = await response.json();
      alert("Data updated");
    } catch (error) {
      console.error(error);
    }
  }

  // fetch preorders for buyer
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const fetchuser = async () => {
        const response = await fetch("https://farmer-backend-8ww4.onrender.com/api/product/fetchpreodersbyconsumer", {
          method: "GET",
          headers: {
            "token": localStorage.getItem("token"),
          },
        });
        const data = await response.json();
        console.log(data);
        if (data.success) {
          setpreorders(data.preorders);
        } else {
          console.log("No preoder available")
        }
      }
      fetchuser();
    }
  }, [])

  // fetch user by local storage
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const fetchuser = async () => {
        const response = await fetch("https://farmer-backend-8ww4.onrender.com/api/auth/fetchbyid", {
          method: "GET",
          headers: {
            "token": localStorage.getItem("token"),
          },
        });
        const data = await response.json();
        setData(data.user);
      }
      fetchuser();
    }
  }, [])
  // fethc product by there localStorage user id
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const fetchproduct = async () => {
        const response = await fetch("https://farmer-backend-8ww4.onrender.com/api/product/fetchuserid", {
          method: "GET",
          headers: {
            "token": localStorage.getItem("token"),
          },
        });
        const data = await response.json();
        setProduct(data.data);
      }

      fetchproduct();
    }
  }, [])
  return (
    <>
      <div className="profilebody">
        {Data ?
          (<div class="Profile">
            <div style={{ color: "black", position: "absolute", top: "1vmin", left: "63vmin", cursor: "pointer" }} onClick={cancel}>
              <i className="fa-solid fa-x"></i>
            </div>
            <div class="picture">
              <img src={Data.profile ? Data.profile : demo} id="pic1" />
            </div>
            <h2 id="person">{Data.name ? Data.name : "User Name"}</h2>
            <div class="details">
              <h3>Email:{Data.email ? Data.email : "useremail@gmail.com"}</h3>
              <h3>Phone:{Data.phoneNo ? Data.phoneNo : "9876543210"}</h3>
              <h3 style={{ width: "30vmin" }}>Address:{Data.address ? Data.address : "User Address"}</h3>
              <h3>Type:{Data.userType ? Data.userType : ""}</h3>
              <div>
                <h3>Rating:</h3>{[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      color: star <= Data.totalRating ? "gold" : "gray",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div >)
          :
          (
            <div class="Profile">
              <div style={{ color: "black", position: "absolute", top: "1vmin", left: "60vmin", cursor: "pointer" }} onClick={cancel}>
                <i className="fa-solid fa-x"></i>
              </div>
              <div class="picture">
                <img src={demo} id="pic1" />
              </div>
              <h2 id="person">User Name</h2>
              <div class="details">
                <h3>Email:</h3>
                <h3>Phone:</h3>
                <h3>Address:</h3>
              </div>
            </div >
          )
        }

        {Data && Data.userType === "Vendor" ?
          (
            <div style={{ width: "65%" }}>
              {products && (
                <div className="products">
                  <h1 style={{ marginTop: "2vmin", borderBottom: "1px solid black" }}>Your Products</h1>
                  {
                    products.length > 0 ?
                      (products.map((product) => {
                        return (
                          <div class="product">
                            <div class="productpic">
                              <img src={product.productImg ? product.productImg : "https://cdn.pixabay.com/photo/2022/09/05/09/50/tomatoes-7433786_1280.jpg"} id="veggie" />
                            </div>
                            <div class="info">
                              <div className="box">
                                <p>Product Name : {product.productName ? product.productName : "Product Name"}</p>
                                <p>Product Type : {product.productType ? product.productType : "ProductType"}</p>
                                <p>Quantity : {product.quantity ? product.quantity : "Quantity"}/{product.unitType ? product.unitType : ""}</p>
                              </div>
                              <div className="box">
                                <p>Price : {product.price ? product.price : "Price"}.Rs/{product.unitType ? product.unitType : ""}</p>
                                <div className="curd">
                                  <label for="edit" id="modify" onClick={() => open(product._id)}><i class="fa-regular fa-pen-to-square"></i></label>
                                  <label for="delete" id="del" onClick={() => deleteProduct(product._id)}><i class="fa-solid fa-trash"></i></label>
                                </div>
                              </div>
                            </div>
                          </div >
                        )
                      })
                      )
                      :
                      (
                        <p>Not available</p>
                      )
                  }
                </div>
              )}
              {preorders && (
                <div className="products">
                  <h1 style={{ marginTop: "2vmin", borderBottom: "1px solid black" }}>Your PreOrders</h1>
                  {
                    preorders && preorders.length > 0 ?
                      (preorders.map((product) => {
                        return (
                          <div class="product">
                            <div class="productpic">
                              <img src={product.productImage ? product.productImage : "https://cdn.pixabay.com/photo/2022/09/05/09/50/tomatoes-7433786_1280.jpg"} id="veggie" />
                            </div>
                            <div class="info">
                              <div className="productbox">
                                <p>Product Name : {product.productName ? product.productName : "Product Name"}</p>
                                <p>Product Type : {product.productType ? product.productType : "ProductType"}</p>
                                <p>Quantity : {product.quantity ? product.quantity : "Quantity"}/{product.unitType ? product.unitType : ""}</p>
                              </div>
                              <div className="productbox">
                                <p>Price : {product.price ? product.price * product.quantity : "Price"}.Rs</p>
                                <p>Status : {product.Status === "Pending" ?
                                  <><i className="fa-solid fa-clock" style={{ color: "orange" }}></i><span style={{ color: "orange" }}>Pending</span></>
                                  : (product.Status === "Successful" ?
                                    <><i className="fa-solid fa-check" style={{ color: "green" }}></i><span style={{ color: "green" }}>Successful</span></>
                                    : <><i className="fa-solid fa-x" style={{ color: "red" }}></i><span style={{ color: "red" }}>Cancel</span></>
                                  )
                                }
                                </p>
                              </div>
                            </div>
                          </div >
                        )
                      })
                      )
                      :
                      (
                        <p>Not available</p>
                      )
                  }
                </div>
              )}
            </div>
          )
          :
          (
            (products && (
              <div className="products" style={{ width: "65%" }}>
                <h1 style={{ marginTop: "2vmin", borderBottom: "1px solid black" }}>Your Products</h1>
                {
                  products.length > 0 ?
                    (products.map((product) => {
                      return (
                        <div class="product">
                          <div class="productpic">
                            <img src={product.productImg ? product.productImg : "https://cdn.pixabay.com/photo/2022/09/05/09/50/tomatoes-7433786_1280.jpg"} id="veggie" />
                          </div>
                          <div class="info">
                            <div className="productbox">
                              <p>Product Name : {product.productName ? product.productName : "Product Name"}</p>
                              <p>Product Type : {product.productType ? product.productType : "ProductType"}</p>
                              <p>Quantity : {product.quantity ? product.quantity : "Quantity"}/{product.unitType ? product.unitType : ""}</p>
                            </div>
                            <div className="productbox">
                              <p>Price : {product.price ? product.price : "Price"}.Rs/{product.unitType ? product.unitType : ""}</p>
                              <div className="curd">
                                <label for="edit" id="modify" onClick={() => open(product._id)}><i class="fa-regular fa-pen-to-square"></i></label>
                                <label for="delete" id="del" onClick={() => deleteProduct(product._id)}><i class="fa-solid fa-trash"></i></label>
                              </div>
                            </div>
                          </div>
                        </div >
                      )
                    })
                    )
                    :
                    (
                      <p>Not available</p>
                    )
                }
              </div>
            ))
          )
        }


      </div>
      <div className="productupdateform">
        {
          productup ? (
            <div className="form-container">
              <div style={{ color: "black", position: "absolute", top: "1vmin", right: "5vmin", cursor: "pointer" }} onClick={close}>
                <i className="fa-solid fa-x"></i>
              </div>
              <h2 style={{ color: "black" }}>Update Product</h2>
              <form onSubmit={(e) => handleformupdate(e, productup._id)}>
                <div className="productbox">
                  <div className="form-group">
                    <label htmlFor="product-name">Product Name</label>
                    <input type="text" value={credentials.productName} onChange={handleOnchange} id="productName" name="productName" placeholder="Enter product name" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input type="number" value={credentials.price} onChange={handleOnchange} id="price" name="price" placeholder="Enter price" />
                  </div>
                </div>
                <div className="productbox">
                  <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input type="number" value={credentials.quantity} onChange={handleOnchange} id="quantity" name="quantity" placeholder="Enter quantity" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="unit type">Unit Type</label>
                    <select
                      id="unitType"
                      name="unitType"
                      value={credentials.unitType}
                      onChange={handleOnchange}
                    >
                      <option value="">Unit Type</option>
                      <option value="Kg">Kg</option>
                      <option value="Dozen">Dozen</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="product type">Product Type</label>
                    <select
                      id="productType"
                      name="productType"
                      value={credentials.productType}
                      onChange={handleOnchange}
                    >
                      <option value="">Product Type</option>
                      <option value="foods">Foods</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="grains">Grains</option>
                    </select>
                  </div>
                </div>
                {/* <div className="box">
                <div className="form-group" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2vmin" }}>
                  <button type="button"  style={{ width: "auto" }}>Add Location</button>
                </div>
              </div> */}
                <div className="form-group">
                  <button type="submit" style={{ width: "100%" }}>Submit</button>
                </div>
              </form>
            </div>
          )
            :
            (
              ""
            )
        }
      </div>
    </>)
}

export default Profile