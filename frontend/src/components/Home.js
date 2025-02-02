import React, { useEffect, useState } from 'react'
import AddProduct from './usercomponenet/AddProduct';
import Products from './usercomponenet/Products';
const Home = (props) => {
  const [Data, setData] = useState(null);
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
  return (
    <>
      {Data && Data.userType === "Seller" ?
        (<AddProduct />) : ("")
      }
      {Data && Data.userType === "Vendor" ?
        (<Products />) : ("")
      }
      {Data && Data.userType === "Buyer" ?
        (<Products />) : ("")
      }
    </>
  )
}

export default Home