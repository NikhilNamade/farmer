import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom"
const demo = require("../demo.jpg");
const BuyerProfile = () => {
    const navigate = useNavigate();
    const [preorders, setpreorders] = useState([]);
    const [Data, setData] = useState(null);
    const cancel = () => {
        navigate("/")
    }

    // fetch preorders for buyer
    useEffect(() => {
        if (localStorage.getItem("token")) {
            const fetchuser = async () => {
                const response = await fetch("http://localhost:5000/api/product/fetchpreodersbyconsumer", {
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
                const response = await fetch("http://localhost:5000/api/auth/fetchbyid", {
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
    return (
        <div style={{ display: "flex" }}>
            {Data ?
                (<div className="Profile">
                    <div style={{ color: "black", position: "absolute", top: "1vmin", left: "63vmin", cursor: "pointer" }} onClick={cancel}>
                        <i className="fa-solid fa-x"></i>
                    </div>
                    <div className="picture">
                        <img src={Data.profile ? Data.profile : demo} id="pic1" />
                    </div>
                    <h2 id="person">{Data.name ? Data.name : "User Name"}</h2>
                    <div className="details">
                        <h3>Email:{Data.email ? Data.email : "useremail@gmail.com"}</h3>
                        <h3>Phone:{Data.phoneNo ? Data.phoneNo : "9876543210"}</h3>
                        <h3 style={{ width: "30vmin" }}>Address:{Data.address ? Data.address : "User Address"}</h3>
                    </div>
                </div >)
                :
                (
                    <div className="Profile">
                        <div style={{ color: "black", position: "absolute", top: "1vmin", left: "60vmin", cursor: "pointer" }} onClick={cancel}>
                            <i className="fa-solid fa-x"></i>
                        </div>
                        <div className="picture">
                            <img src={demo} id="pic1" />
                        </div>
                        <h2 id="person">User Name</h2>
                        <div className="details">
                            <h3>Email:</h3>
                            <h3>Phone:</h3>
                            <h3>Address:</h3>
                        </div>
                    </div >
                )
            }
            {preorders && (
                <div className="products">
                    <h1 style={{ marginTop: "2vmin", borderBottom: "1px solid black" }}>Your PreOrders</h1>
                    {
                        preorders && preorders.length > 0 ?
                            (preorders.map((product) => {
                                return (
                                    <div className="product">
                                        <div className="productpic">
                                            <img src={product.productImage ? product.productImage : "https://cdn.pixabay.com/photo/2022/09/05/09/50/tomatoes-7433786_1280.jpg"} id="veggie" />
                                        </div>
                                        <div className="info">
                                            <div className="productbox">
                                                <p>Product Name : {product.productName ? product.productName : "Product Name"}</p>
                                                <p>Product Type : {product.productType ? product.productType : "ProductType"}</p>
                                                <p>Quantity : {product.quantity ? product.quantity : "Quantity"}/{product.unitType ? product.unitType : ""}</p>
                                            </div>
                                            <div className="productbox">
                                                <p>Price : {product.price ? product.price * product.quantity : "Price"}.Rs</p>
                                                <p>Status :{product.Status === "Pending" ?
                                                    <><i className="fa-solid fa-clock" style={{ color: "orange" }}></i><span style={{ color: "orange" }}>Pending</span></>
                                                    :(product.Status === "Successful"?
                                                    <><i className="fa-solid fa-check" style={{ color: "green" }}></i><span style={{ color: "green" }}>Successful</span></>
                                                    :<><i className="fa-solid fa-x" style={{ color: "red" }}></i><span style={{ color: "red" }}>Cancel</span></>
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
}

export default BuyerProfile