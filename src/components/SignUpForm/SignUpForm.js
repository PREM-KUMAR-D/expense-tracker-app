import React, { Fragment, useState, useEffect } from "react";
import classes from "./SignUpForm.module.css";
import { useLocation } from "react-router";

const SignUpForm = (props) => {
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const location = useLocation();

  console.log(JSON.stringify(location.pathname));
  const [isLogin,setIsLogin] = useState(location.pathname==="/login"?true:false);


  const handleClick = (props)=>{
    setIsLogin((prev)=>!prev);
  }

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, 
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    let url;
    if (isLogin) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIRE_BASE_API_KEY}`;
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIRE_BASE_API_KEY}`;
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error.message || "Authentication failed!");
      }

     
      localStorage.setItem("token", data.idToken);
      localStorage.setItem("email", formData.email);
      alert(isLogin?"Login Completed":"Signup complete");
      setIsLogin(true);

     
    } catch (err) {
     
      console.error("Authentication error:", err.message);
    } 
  };

  return (
    <Fragment>
      <div className={classes.wrapper}>

        <div className={classes.container}>
          <h2>{isLogin? "Login": "Sign Up"}</h2>
          <form onSubmit={handleSubmit}>
            <div className={classes.input}>
              <label htmlFor="email">Email: </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={classes.input}>
              <label htmlFor="password">Password: </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={classes.input}>
              <label htmlFor="confirmPassword">Confirm Password: </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className={classes.formBtn}>
              {!isLogin?"Sign Up" : "Login"}
            </button>

            <button type="button" className={classes.formBtn} onClick={handleClick}>
              {!isLogin?"Have an account? Login":"Create an Account"}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default SignUpForm;
