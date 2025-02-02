import React, { useEffect, useState } from 'react'
import { useAppContext } from "./context/createContext";
import { useNavigate } from "react-router-dom"
const demo = require("./demo.jpg");

const Navbar = (props) => {
  const { setProductType, setProductName, setClick } = useAppContext();
  const [show, setshow] = useState(false);
  const [Data, setData] = useState(null);
  const fetchuser = async () => {
    if (localStorage.getItem("token")) {
      const response = await fetch("http://localhost:5000/api/auth/fetchbyid", {
        method: "GET",
        headers: {
          "token": localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      setData(data.user);
    } else {
      console.log("User not found");
    }
  }
  useEffect(() => {
    fetchuser();
  }, [])
  const navigate = useNavigate();
  const handlelogout = () => {
    console.log("click");
    localStorage.getItem("token") && localStorage.removeItem("token");
    navigate("/login");
  }
  const profile = () => {
    navigate("/profile")
  }
  const buyerprofile = () => {
    navigate("/buyerprofile")
  }
  const handletype = (e) => {
    setProductType(e.target.value);
  }
  const handelinputchange = (e) => {
    setProductName(e.target.value);
  }
  const handleSearch = () => {
    setClick(true);
  }
  return (
    <>
      <div className="nav">
        <div>
          <h1>Veggies_Mart</h1>
        </div>
        {Data && Data.userType !== "Seller" && (
          <div className="find">
            <input
              type="text"
              id="search"
              name="search"
              onChange={handelinputchange}
              placeholder="Search fresh and Quality Vegetables"
            /><i class="fa-solid fa-magnifying-glass" onClick={handleSearch}></i>
          </div>
        )}
        {!Data ? (
          <div className="find">
            <input
              type="text"
              id="search"
              name="search"
              placeholder="Search fresh and Quality Vegetables"
            /><span><i class="fa-solid fa-magnifying-glass"></i></span>
          </div>
        ) : ""}
        {
          localStorage.getItem("token") ?
            (
              Data && (
                <div className="userdata">
                  <p>{Data.name ? Data.name : "User Name"}</p>
                  <img src={`${Data.profile ? Data.profile : demo}`} onClick={Data.userType === "Buyer" ? buyerprofile : profile}></img>
                  <button onClick={handlelogout}>Logout</button>
                </div>
              )
            )
            :
            (
              <div className="relo">
                <button className="register" onClick={() => setshow(!show)} >Register</button>
                <button className="Login" onClick={() => navigate("/login")} >Login</button>
                {show && <div className="role">
                  <div className="Buyer" onClick={() => navigate("/registerbuyer")}>Buyer</div>
                  <div className="Buyer" onClick={() => navigate("/registerseller")}>Seller</div>
                  <div className="Buyer" onClick={() => navigate("/registervendor")}>Vendor</div>
                </div>
                }
              </div>
            )
        }
      </div>
      {Data && Data.userType === "Seller" && (
        <div className="Navbar">
          <ul>
            <li><a href='/addproduct' style={{ color: "black" }}>AddProduct</a></li>
            <li><a href='/preorders' style={{ color: "black" }}>PreOrders</a></li>
            <li>About Us</li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
      )
      }
      {
        Data && Data.userType === "Buyer" && (
          <div className="Navbar">
            <ul>
              <li><a href="/products">Products</a></li>
              <li><a href="/shop">Shop</a></li>
              <li>
                <select
                  onChange={handletype}
                >
                  <option value="" selected>Categories</option>
                  <option value="foods">Food</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="grains">Grains</option>
                </select>
              </li>
              <li>About Us</li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        )
      }
      {
        Data && Data.userType === "Vendor" && (
          <div className="Navbar">
            <ul>
              <li><a href="/products">Products</a></li>
              <li><a href="/shop">Shop</a></li>
              <li>
                <select
                  onChange={handletype}
                >
                  <option value="" selected>Categories</option>
                  <option value="foods">Food</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="grains">Grains</option>
                </select>
              </li>
              <li><a href='/addproduct' style={{ color: "black" }}>AddProduct</a></li>
              <li><a href='/preorders' style={{ color: "black" }}>PreOrders</a></li>
              <li>About Us</li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        )
      }
      {
        !Data && (
          <div className="Navbar">
            <ul>
              <li><a href="/products">Products</a></li>
              <li><a href="/shop">Shop</a></li>
              <li>
                <select
                  onChange={handletype}
                >
                  <option value="" selected>Categories</option>
                  <option value="foods">Food</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="grains">Grains</option>
                </select>
              </li>
              <li><a href='/addproduct' style={{ color: "black" }}>AddProduct</a></li>
              <li><a href='/preorders' style={{ color: "black" }}>PreOrders</a></li>
              <li>About Us</li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        )
      }
    </>
  )
}

export default Navbar;
