import "./CSS/Navbar.css"
import React, { useEffect, useState } from 'react'
import { useAppContext } from "./context/createContext";
import { useNavigate } from "react-router-dom"
const demo = require("./demo.jpg");

const Navbar = (props) => {
  const { setProductType, setProductName, setClick } = useAppContext();
  const [show, setshow] = useState(false);
  const [nav, setnav] = useState(false);
  const [Data, setData] = useState(null);
  const fetchuser = async () => {
    if (localStorage.getItem("token")) {
      const response = await fetch("https://farmer-backend-8ww4.onrender.com/api/auth/fetchbyid", {
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
  const handlenavbar = ()=>{
    console.log("clcik");
    if(nav)
    {
      setnav(false);
    }else{
      setnav(true)
    }
  }
  return (
    <>
        <div className="nav">
          <div className="logo">
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
          {
            localStorage.getItem("token") ?
              (
                Data && (
                  <>
                  <div className="userdata">
                    <p>{Data.name ? Data.name : "User Name"}</p>
                    <img src={`${Data.profile ? Data.profile : demo}`} onClick={Data.userType === "Buyer" ? buyerprofile : profile}></img>
                    <button onClick={handlelogout}>Logout</button>
                  </div>
                  <i className="fa-solid fa-bars" id="showbar" onClick={handlenavbar}></i>
                  </>
                )
              )
              :
              (
                <>
                <div className="role">
                  <button className="register" onClick={() => setshow(!show)} >Register</button>
                  <button className="Login" onClick={() => navigate("/login")} >Login</button>
                  {show && <div className="roleuser">
                    <div className="userType" onClick={() => navigate("/registerbuyer")}>Buyer</div>
                    <div className="userType" onClick={() => navigate("/registerseller")}>Seller</div>
                    <div className="userType" onClick={() => navigate("/registervendor")}>Vendor</div>
                  </div>
                  }
                </div>
                <i className="fa-solid fa-bars" id="showbar" onClick={handlenavbar}></i>
                </>
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
      
      <div className="responsive" style={{display:`${nav ? "block" : "none"}`}} >
        <div className="navrs">
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
                <div className="role">
                  <button className="register" onClick={() => setshow(!show)} >Register</button>
                  <button className="Login" onClick={() => navigate("/login")} >Login</button>
                  {show && <div className="roleuser">
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
          <div className="Navbarrs">
            <ul>
              <li><a href='/addproduct' style={{ color: "black" }}>AddProduct</a></li>
              <li><a href='/preorders' style={{ color: "black" }}>PreOrders</a></li>
              <li><a href="">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        )
        }
        {
          Data && Data.userType === "Buyer" && (
            <div className="Navbarrs">
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
                <li><a href="">About Us</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
          )
        }
        {
          Data && Data.userType === "Vendor" && (
            <div className="Navbarrs">
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
                <li><a href="">About Us</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
          )
        }
      </div>
    </>
  )
}

export default Navbar;
