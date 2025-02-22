import './App.css';
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom"
import Home from './components/Home';
import RegisterBuyer from './components/RegisterBuyer';
import RegisterSeller from './components/RegisterSeller';
import Login from './components/Login';
import Profile from './components/usercomponenet/Profile';
import AddProduct from './components/usercomponenet/AddProduct';
import Navbar from './components/Navbar';
import React from 'react';
import Preorders from './components/usercomponenet/Preorders';
import RegisterVendor from './components/RegisterVendor';
import Shop from './components/usercomponenet/Shop';
import ShopProfile from './components/usercomponenet/ShopProfile';
import Products from './components/usercomponenet/Products';
import Contact from './components/usercomponenet/Contact';
import { AppProvider } from "../src/components/context/createContext"
import BuyerProfile from './components/usercomponenet/BuyerProfile';
import Map from './components/usercomponenet/Map';
function App() {
  return (
    <>
      <AppProvider>
        <BrowserRouter>
          <Navbarswichter />
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/registerbuyer' element={<RegisterBuyer />}></Route>
            <Route path='/registerseller' element={<RegisterSeller />}></Route>
            <Route path='/registervendor' element={<RegisterVendor />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/profile' element={<Profile />}></Route>
            <Route path='/addproduct' element={<AddProduct />}></Route>
            <Route path='/preorders' element={<Preorders />}></Route>
            <Route path='/shop' element={<Shop />}></Route>
            <Route path='/products' element={<Products />}></Route>
            <Route path='/contact' element={<Contact />}></Route>
            <Route path='/buyerprofile' element={<BuyerProfile />}></Route>
            <Route path='/shopprofile/:id' element={<ShopProfile />}></Route>
            <Route path='/map/:id' element={<Map />}></Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </>
  );
}

function Navbarswichter({ Data }) {
  const location = useLocation();
  if (
    location.pathname === "/login" ||
    location.pathname === "/registerbuyer" ||
    location.pathname === "/registerseller" ||
    location.pathname === "/profile" ||
    location.pathname === "/registervendor" ||
    location.pathname === "/buyerprofile" ||
    location.pathname.startsWith("/shopprofile/") ||
    location.pathname.startsWith("/map/")
  ) {
    return null;
  }

  return <Navbar />;
}

export default App;
