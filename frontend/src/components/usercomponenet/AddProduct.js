import React, { useRef, useState } from 'react'
const AddProduct = () => {
    const inputref = useRef(null);
    const [image, setimage] = useState("");
    const [credentials, setCredentials] = useState({ productName: "", price: "", quantity: "", unittype: "",producttype:"" });
    const handleOnchange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    // const addcurrentlocation = () => {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition((position) => {
    //             const { latitude, longitude } = position.coords;
    //             console.log("Latitude:" + latitude + " Longitude:" + longitude);
    //             setLocation({ lat: latitude, lng: longitude });
    //             alert("Location Added");
    //         })
    //     } else {
    //         console.error("Unable to add location");
    //     }
    // }
    const changeimg = (event) => {
        setimage(event.target.files[0]);
        console.log(image);
    }
    const changepic = () => {
        inputref.current.click();
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formdata = new FormData();
            formdata.append("productName", credentials.productName)
            formdata.append("price", credentials.price)
            formdata.append("quantity", credentials.quantity)
            formdata.append("unitType", credentials.unittype)
            formdata.append("productType", credentials.producttype)
            formdata.append("productImg", image)

            const response = await fetch("https://farmer-backend-8ww4.onrender.com/api/product/addproduct", {
                method: "POST",
                headers: {
                    "token": localStorage.getItem("token"),
                },
                body: formdata
            })
            const data = await response.json();
            console.log(data)
            if (data.success) {
                alert("Data added");
            } else {
                console.log("Data not add");
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className='addproductbody'>
            <div className="form-container">
                <h2>Add Product</h2>
                <form onSubmit={handleSubmit}>
                    <div className="box" style={{ justifyContent: "center", marginBottom: "1vmin" }}>
                        <div className="pic" onClick={changepic}>
                            {image ? <img src={URL.createObjectURL(image)} id="photo" style={{ borderRadius: "1vmin" }} /> : <img src="https://media.istockphoto.com/id/589415708/photo/fresh-fruits-and-vegetables.jpg?s=612x612&w=0&k=20&c=aBFGUU-98pnoht73co8r2TZIKF3MDtBBu9KSxtxK_C0=" id="photo" style={{ borderRadius: "1vmin", objectFit: "cover" }} />}
                            <input type="file" id="file" ref={inputref} onChange={changeimg} />
                            <label for="file" id="uploadbtn" ><i className="fa-solid fa-camera"></i></label>
                        </div>
                    </div>
                    <div className="box">
                        <div className="form-group">
                            <label htmlFor="product-name">Product Name</label>
                            <input type="text" onChange={handleOnchange} value={credentials.productName} id="productName" name="productName" placeholder="Enter product name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Price</label>
                            <input type="number" onChange={handleOnchange} value={credentials.price} id="price" name="price" placeholder="Enter price" />
                        </div>
                    </div>
                    <div className="box">
                        <div className="form-group">
                            <label htmlFor="quantity">Quantity</label>
                            <input type="number" onChange={handleOnchange} value={credentials.quantity} id="quantity" name="quantity" placeholder="Enter quantity" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="unit type">Unit Type</label>
                            <select
                                id="unittype"
                                name="unittype"
                                onChange={handleOnchange}
                                value={credentials.unittype}
                            >
                                <option value="">Unit Type</option>
                                <option value="Kg">Kg</option>
                                <option value="Dozen">Dozen</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="product type">Product Type</label>
                            <select
                                id="producttype"
                                name="producttype"
                                onChange={handleOnchange}
                                value={credentials.producttype}
                            >
                                <option value="">Product Type</option>
                                <option value="foods">Foods</option>
                                <option value="vegetables">Vegetables</option>
                                <option value="grains">Grains</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default AddProduct