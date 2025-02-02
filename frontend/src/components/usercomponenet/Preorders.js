import React, { useEffect, useState } from 'react'
import AddProduct from './AddProduct';

const Preorders = () => {
  const [preorders, setpreorders] = useState([]);
  const handleStatus = async (status, id) => {
    const formdata = new FormData();
    formdata.append("Status", status)
    const response = await fetch(`https://farmer-backend-8ww4.onrender.com/api/product/updatestatus/${id}`, {
      method: "PUT",
      body: formdata
    })
    const data = await response.json();
    if (data.success) {
      alert("Status Updated");
    } else {
      alert("Status Not Updated");
    }
    console.log(id);
  }
  const fetchpreorders = async () => {
    const response = await fetch("https://farmer-backend-8ww4.onrender.com/api/product/fetchpreodersbyowner", {
      method: "GET",
      headers: {
        "token": localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    if (data.success) {
      setpreorders(data.preorders);
    } else {
      console.error("Data not found");
    }
  }
  useEffect(() => {
    fetchpreorders()
  }, [])

  return (
    <div style={{ position: "absolute", top: "20vmin", width: "100%", height: "80vh" }}>
      <div className="products" style={{ height: "100%", overflowY: "scroll", width: "100%", paddingBottom: "3vmin" }}>
        <h1 style={{ marginTop: "2vmin", borderBottom: "1px solid black" }}>Your Preorders</h1>
        {preorders && preorders.length > 0 ?
          (
            preorders.map((preorder) => (
              <div class="product">
                <div class="productpic">
                  <img src={preorder.productImage ? preorder.productImage : "https://cdn.pixabay.com/photo/2022/09/05/09/50/tomatoes-7433786_1280.jpg"} />
                </div>
                <div class="info">
                  <div className="productbox">
                    <p>Customer Name : {preorder.customerName ? preorder.customerName : "customerName"}</p>
                    <p>Customer PhoneNo : {preorder.customerphNo ? preorder.customerphNo : "9876543210"}</p>
                    <p>Product Name : {preorder.productName ? preorder.productName : "ProductName"}</p>
                  </div>
                  <div className="productbox">
                    <p>Product Type : {preorder.productType ? preorder.productType : "ProductType"}</p>
                    <p>Quantity : {preorder.quantity ? preorder.quantity : "ProductQuantity"}/{preorder.unitType ? preorder.unitType : "ProductunitType"}</p>
                    <p>Price : {preorder.price ? preorder.price * preorder.quantity : "ProductPrice"} </p>
                  </div>
                  <div className="productbox">
                    {
                      preorder.Status === "Pending" ?
                        (<>
                          <button style={{ padding: "0.5vmin", fontSize: "2vmin", borderRadius: "0.5vmin", border: "1px solid black" }} onClick={() => handleStatus("Successful", preorder._id)}>Approve</button>
                          <button style={{ padding: "0.5vmin", fontSize: "2vmin", borderRadius: "0.5vmin", border: "1px solid black" }} onClick={() => handleStatus("Reject", preorder._id)}>Reject</button>
                        </>)
                        :
                        (
                          (preorder.Status === "Successful" ?
                            <><i className="fa-solid fa-check" style={{ color: "green" }}></i><span style={{ color: "green" }}>Successful</span></>
                            : <><i className="fa-solid fa-x" style={{ color: "red" }}></i><span style={{ color: "red" }}>Cancel</span></>
                          )
                        )
                    }</div>
                </div>
              </div >
            ))
          )
          :
          (<div class="product">
            <div class="productpic">
              <img src="https://cdn.pixabay.com/photo/2022/09/05/09/50/tomatoes-7433786_1280.jpg" />
            </div>
            <div class="info">
              <div className="productbox">
                <p>Product Name :</p>
                <p>Product Type :</p>
                <p>Quantity :</p>
              </div>
              <div className="productbox">
                <p>Price: </p>
              </div>
            </div>
          </div >)
        }
      </div>
    </div>
  )
}

export default Preorders