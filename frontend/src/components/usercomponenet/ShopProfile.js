import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
const demo = require("../demo.jpg");
const ShopProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [quantity, setQuantity] = useState(0);
    const [rating, setRating] = useState(0);
    const [Data, setData] = useState(null);
    const [products, setProducts] = useState(null)
    const fetchuserbyid = async () => {
        try {
            const response = await fetch(`https://farmer-backend-8ww4.onrender.com/api/auth/fetchbyid/${id}`, {
                method: "GET",
            })
            const data = await response.json();
            if (data.success) {
                setData(data.user);
            } else {
                console.log("Not found");
            }
        } catch (error) {
            console.error(error)
        }
    }
    const fetchproductbyuserid = async () => {
        try {
            const response = await fetch(`https://farmer-backend-8ww4.onrender.com/api/product/fetchuserid/${id}`, {
                method: "GET",
            })
            const data = await response.json();
            if (data.success) {
                setProducts(data.data);
            } else {
                console.log("Not found");
            }
        } catch (error) {
            console.error(error)
        }
    }
    const handleRatingSubmit = (star) => {
        console.log(star);
        setRating(star)
    }
    const handleRating = async (id) => {
        try {
            const formdata = new FormData();
            formdata.append("rating", rating)
            const response = await fetch(`https://farmer-backend-8ww4.onrender.com/api/auth/rate/${id}`, {
                method: "POST",
                body: formdata
            })
            const data = await response.json()
            if (data.success) {
                alert("Rating Added")
            } else {
                alert("Rating Not Added")
            }
        } catch (error) {
            console.error(error)
        }
    }
    const handlepreoderSubmit = async(id)=>{
        const response = await fetch("https://farmer-backend-8ww4.onrender.com/api/product/preorder",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "token":localStorage.getItem("token"),
            },
            body:JSON.stringify({productId:id,quantity}),
        })
        const data = await response.json();
        if(data.success)
        {
            alert("Preorder");
        }else{
            alert("not order")
        }
    }
    useEffect(() => {
        fetchproductbyuserid();
    }, [])
    useEffect(() => {
        fetchuserbyid();
    }, [])
    const cancel = () => {
        navigate("/shop")
    }
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
                            <div><h3>Rating:</h3>{[1, 2, 3, 4, 5].map((star) => (
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
                            <div>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        onClick={() => handleRatingSubmit(star)} // Handle star click
                                        style={{
                                            cursor: "pointer",
                                            color: `${rating >= star ? "gold" : "gray"}`, // Highlight stars up to the clicked one
                                            fontSize: "2rem",
                                        }}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <h3 onClick={() => handleRating(Data._id)} style={{ cursor: "pointer" }}>Add Rating</h3>
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

                <div className="products">
                    <h1 style={{ marginTop: "2vmin", borderBottom: "1px solid black" }}>Your Products</h1>
                    {
                        products && products.length > 0 ?
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
                                                <div>
                                                    <div>Preoder :
                                                        <input type="Number" onChange={(e) => setQuantity(e.target.value)} id="quantity" name="quantity" style={{ padding: "0.5vmin", fontSize: "1.5vmin", width: "30vmin", borderRadius: "0.5vmin" }} placeholder="Enter the quantity You required" required />
                                                        <button onClick={()=>handlepreoderSubmit(product._id)} style={{ fontSize: "1.5vmin", boder: "1px solid black", borderRadius: "0.5vmin", marginLeft: "0.5vmin" }}>Preorder</button>
                                                    </div>
                                                    <p style={{ color: "red", fontSize: "1.5vmin" }}>You can only preorder upto half quantity of available stock</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div >
                                )
                            })
                            )
                            :
                            (
                                <div class="product">
                                    <div class="productpic">
                                        <img src="https://cdn.pixabay.com/photo/2022/09/05/09/50/tomatoes-7433786_1280.jpg" id="veggie" />
                                    </div>
                                    <div class="info">
                                        <div className="productbox">
                                            <p>Product Name:Product Name</p>
                                            <p>Quantity:Quantity</p>
                                        </div>
                                        <div className="productbox">
                                            <p>Price:Price</p>
                                        </div>
                                    </div>
                                </div >
                            )
                    }
                </div>
            </div>
        </>)
}

export default ShopProfile