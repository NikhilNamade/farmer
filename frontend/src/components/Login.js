import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
const Login = () => {
  const navigate = useNavigate();
  const [forgotcre, setForgotcre] = useState({ emailrp: "", passwordrp: "", compass: "" });
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const handlechangerp = (e) => {
    setForgotcre({ ...forgotcre, [e.target.name]: e.target.value });
  }
  const cancelforgot = () => {
    const forgotpassowrd = document.querySelector(".forgotpassowrd");
    forgotpassowrd.style.display = "none";
  }
  const handleforgot = () => {
    const forgotpassowrd = document.querySelector(".forgotpassowrd");
    forgotpassowrd.style.display = "block";
    forgotpassowrd.style.top = "25vmin";
  }
  const handlechange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData();
      formdata.append("email", credentials.email);
      formdata.append("password", credentials.password);
      const response = await fetch("https://farmer-backend-8ww4.onrender.com/api/auth/login", {
        method: "POST",
        body: formdata
      })
      const data = await response.json();
      console.log(data);
      if (data.success && data.jwttoken) {
        navigate("/")
        localStorage.setItem("token", data.jwttoken);
      } else {
        alert("User not login");
      }
    } catch (error) {
      console.error(error);
    }
  }
  const handleSubmitPass = async (e) => {
    e.preventDefault();
    try {
      if (forgotcre.passwordrp === forgotcre.compass) {
        const formdata = new FormData();
        formdata.append("email", forgotcre.emailrp);
        formdata.append("password", forgotcre.passwordrp);
        const response = await fetch("https://farmer-backend-8ww4.onrender.com/api/auth/changepassword", {
          method: "PUT",
          body: formdata
        })
        const data = await response.json();
        console.log(data);
        if (data.success) {
          alert("Updated");
        } else {
          alert("not Updated");
        }
      } else {
        alert("Comfirmpassword is not equal to password");
      }
    } catch (error) {
      console.error(error);
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
      <div className="Login-box">

        <h2>Welcome Back! login here</h2>
        <form onSubmit={handleSubmit}>
          <div className="user">
            <div className="form-group">
              <label htmlFor="email"><i>Email:</i></label>
              <input type="email" value={credentials.email} onChange={handlechange} id="email" name="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password"><i>Password:</i></label>
              <input type="password" value={credentials.password} onChange={handlechange} id="password" name="password" placeholder="Enter your password" required />
            </div>

            <div className="form-group">
              <div className="bottom">
                <button type="submit">Login</button><br /><br />
                <a href='#' id="forget" onClick={handleforgot}>Forget password?</a><br /><br />
              </div>
            </div>
          </div>
        </form>

      </div>
      <div className="forgotpassowrd">
        <div className="icon" onClick={cancelforgot}>
          <i className="fa-solid fa-x"></i>
        </div>
        <h2>Recover Your Account</h2>
        <form onSubmit={handleSubmitPass}>
          <div className="user">
            <div className="form-group">
              <label htmlFor="email"><i>Email:</i></label>
              <input type="email" value={forgotcre.emailrp} onChange={handlechangerp} id="emailrp" name="emailrp" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password"><i>Password:</i></label>
              <input type="password" value={forgotcre.passwordrp} onChange={handlechangerp} id="passwordrp" name="passwordrp" placeholder="Enter your password" required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmpassword"><i>Confirm-Password:</i></label>
              <input type="password" value={forgotcre.compass} onChange={handlechangerp} id="compass" name="compass" placeholder="Enter your password" required />
            </div>
            <div className="form-group">
              <div className="bottom">
                <button type="submit">Update Password</button><br /><br />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
