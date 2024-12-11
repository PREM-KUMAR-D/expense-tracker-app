import React, { Fragment } from "react";
import classes from "./SignUpForm.module.css";

const SignUpForm = (props) => {
  return (
    <Fragment>
      <div className={classes.container}>
        <h2>Sign Up</h2>
        <form>
          
          <div className={classes.input}>
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
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
              required
            />
          </div>

          
          
            <button type="submit" className={classes.formBtn}>Sign Up</button>
          
            
            <button className={classes.formBtn}>
                Have an account? Login
            </button>
        </form>
      </div>

    </Fragment>
  );
};

export default SignUpForm;
