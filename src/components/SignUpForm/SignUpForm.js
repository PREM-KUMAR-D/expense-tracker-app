import React, { useState } from "react";
import classes from "./SignUpForm.module.css";
import { useLocation } from "react-router";
import { authActions } from "../../store/auth-slice";
import { useDispatch} from "react-redux";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [isLogin, setIsLogin] = useState(useLocation().pathname === "/login");

  const dispatchFunc = useDispatch();
  

  const handleClick = () => setIsLogin((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleVerifyEmail = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to verify your email.");
      return;
    }

    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.REACT_APP_FIRE_BASE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "VERIFY_EMAIL",
            idToken: token,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error.message || "Failed to send verification email.");

      setIsVerificationSent(true);
      alert("Verification email sent! Please check your inbox.");
    } catch (error) {
      console.error("Error sending verification email:", error.message);
    }
  };

  const handleTokenVerification = async () => {
    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_FIRE_BASE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oobCode: verificationToken,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error.message || "Verification failed.");

      setIsEmailVerified(true);
      alert("Email verification completed!");
      dispatchFunc(authActions.login());
    } catch (error) {
      console.error("Error during token verification:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    let url = isLogin
      ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIRE_BASE_API_KEY}`
      : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIRE_BASE_API_KEY}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          returnSecureToken: true,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error.message || "Authentication failed!");

      localStorage.setItem("token", data.idToken);
      localStorage.setItem("email", formData.email);
      alert(isLogin ? "Login Completed" : "Signup complete");
      setIsLogin(true);
    } catch (err) {
      console.error("Authentication error:", err.message);
    }
  };

  return (
    
      <div className={classes.wrapper}>
        <div className={classes.container}>
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>
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
              <button
                type="button"
                className={classes.verifyButton}
                onClick={handleVerifyEmail}
                disabled={isVerificationSent}
              >
                {isVerificationSent ? "Verification Sent" : "Verify Email"}
              </button>
              {isEmailVerified && <span className={classes.verifiedTick}>✔️</span>}
            </div>

            {isLogin && (
              <div className={classes.input}>
                <label htmlFor="token">Verification Token: </label>
                <input
                  type="text"
                  id="token"
                  placeholder="Enter your token"
                  value={verificationToken}
                  onChange={(e) => setVerificationToken(e.target.value)}
                />
                <button
                  type="button"
                  className={classes.tokenButton}
                  onClick={handleTokenVerification}
                  disabled={!verificationToken}
                >
                  Verify Token
                </button>
              </div>
            )}

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
                required={!isLogin}
              />
            </div>

            <button type="submit" className={classes.formBtn}>
              {!isLogin ? "Sign Up" : "Login"}
            </button>

            <button type="button" className={classes.formBtn} onClick={handleClick}>
              {!isLogin ? "Have an account? Login" : "Create an Account"}
            </button>

            {isLogin && <button
              type="button"
              className={classes.formBtn}
              onClick={() => window.open('/reset-password', '_blank')}
            >
              Forgot Password?
            </button>}
          </form>
        </div>
      </div>
    
  );
};

export default SignUpForm;
