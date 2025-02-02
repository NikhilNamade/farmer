import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useRef } from 'react';
const demo = require("./demo.jpg");
const RegisterBuyer = () => {
    const navigate = useNavigate();
    const inputref = useRef(null);
    const [image, setimage] = useState("");
    const [credentials, setCredentials] = useState({ name: "", email: "", phoneNo: "", address: "", password: "", confirmPassword: "" });
    
    const changepic = () => {
        inputref.current.click();
    }

    const changeimg = (event) => {
        setimage(event.target.files[0]);
        console.log(image);
    }
    const handleOnchange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (credentials.password === credentials.confirmPassword) {
            try {
                const formdata = new FormData();
                formdata.append("name", credentials.name);
                formdata.append("email", credentials.email);
                formdata.append("phoneNo", credentials.phoneNo);
                formdata.append("address", credentials.address);
                formdata.append("password", credentials.password);
                formdata.append("profile", image);
                for (let [key, value] of formdata.entries()) {
                    console.log(`${key}: ${value}`);
                }

                const response = await fetch("http://localhost:5000/api/auth/buyer", {
                    method: "POST",
                    body: formdata,
                })
                const data = await response.json();
                console.log(data);
                if (data.success && data.jwttoken) {
                    navigate("/")
                    localStorage.setItem("token", data.jwttoken);
                } else {
                    alert("Unable to Creat user");
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            alert("Password Not Match To ConfirmPassword");
        }
    }
    const cancel = () => {
        navigate("/")
    }
    return (
        <div className="body">
            <div style={{ color: "white", position: "absolute", top: "1vmin", right: "5vmin", cursor: "pointer" }} onClick={cancel}>
                <i className="fa-solid fa-x"></i>
            </div>
            <div className="form-container">
                <h2>Register Here!</h2>
                <form onSubmit={handleSubmit}>
                    <div className='user-details'>
                        <div className="box" style={{ justifyContent: "center" }}>
                            <div className="pic" onClick={changepic}>
                                {image ? <img src={URL.createObjectURL(image)} id="photo" /> : <img src={demo} id="photo" />}
                                <input type="file" id="file" ref={inputref} onChange={changeimg} />
                                <label for="file" id="uploadbtn" ><i class="fa-solid fa-camera"></i></label>
                            </div>
                        </div>
                        <div className="box">
                            <div className="form-group">
                                <label htmlFor="Name">Username:</label>
                                <input type="text" value={credentials.name} id="name" name="name" placeholder="Enter your username" required onChange={handleOnchange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input type="email" value={credentials.email} id="email" name="email" placeholder="Enter your email" required onChange={handleOnchange} />
                            </div>
                        </div>
                        <div className="box">
                            <div className="form-group">
                                <label htmlFor="phone-number">Phone number:</label>
                                <input type="number" value={credentials.phoneNo} id="phoneNo" name="phoneNo" placeholder="Enter your mobile number" required onChange={handleOnchange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Address:</label>
                                <textarea id="address" value={credentials.address} name="address" placeholder="Enter your address" rows="3" style={{ resize: "none" }} required onChange={handleOnchange} />
                            </div>
                        </div>
                        <div className="box">
                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <input type="password" value={credentials.password} id="password" name="password" placeholder="Enter your password" required onChange={handleOnchange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm-password">Confirm Password:</label>
                                <input type="password" value={credentials.confirmPassword} id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required onChange={handleOnchange} />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className='base'>
                            <button type="submit" >SignUp</button><br /><br />
                            <p style={{ color: "white" }}>Already have an account?</p><a href='/login'>Login</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterBuyer