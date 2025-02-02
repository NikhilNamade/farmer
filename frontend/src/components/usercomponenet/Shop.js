import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
const market = require("./market.jpg")
const Shop = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState({ lat: "", lng: "" })
  const [shops, setShops] = useState(null)
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
  // fethc all shops
  const fetchshops = async () => {
    try {
      const response = await fetch("https://farmer-backend-8ww4.onrender.com/api/auth/fetchshop", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.user) {
        // Sort shops based on distance from the user's location
        const sortedShops = data.user.sort((a, b) => {
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

        setShops(sortedShops);
      } else {
        console.log("Not found")
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchshops()
  }, [])
  useEffect(() => {
    currentLocation()
  }, [currentLocation()])
  const handleclick = (id) => {
    navigate(`/shopprofile/${id}`)
  }

  return (
    <div className='shop' style={{ position: "absolute", top: "20vmin", width: "100%" }}>
      <h1 style={{textAlign:"center"}}>Shops Nearets To You</h1>
      <div className="cards">
        {shops ?
          (shops.map((shop) => (
            <div className="card" onClick={() => handleclick(shop._id)}>
              <img src={market} />
              <div className="details">
                <div>Name:{shop.name ? shop.name : "SHOP NAME"}</div>
                <div>Email:{shop.email ? shop.email : "SHOP EMAIL"}</div>
                <div>Phone:{shop.phoneNo ? shop.phoneNo : "9876543210"}</div>
                <div>userType:{shop.userType ? shop.userType : "User Type"}</div>
                <div>Rating:{[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      color: star <= shop.totalRating ? "gold" : "gray",
                    }}
                  >
                    ★
                  </span>
                ))}
                </div>
              </div>
            </div>
          ))) : (<p>Loading shops or no shops available...</p>)
        }
      </div>
    </div>
  )
}

export default Shop