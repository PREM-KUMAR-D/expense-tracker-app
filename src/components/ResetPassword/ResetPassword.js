import React,{useState} from "react";
import classes from  "./ResetPassword.module.css";

const ResetPassword =(props)=>{

    const [email,setEmail] = useState("");

    
    
    const handleChange = (event)=>{
        setEmail(event.target.value);
    }

    const formSubmitHandler=async (event)=>{
        event.preventDefault();

        

    
        try {
          const res = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.REACT_APP_FIRE_BASE_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                requestType: "PASSWORD_RESET",
                email: email,
              }),
            }
          );
    
          const data = await res.json();
          if (!res.ok) throw new Error(data.error.message || "Failed to send Reset email.");
    
          
          alert("Reset Password email sent! Please check your inbox.");
        } catch (error) {
          console.error("Error sending verification email:", error.message);
        }



    }

    return(
        
      <div className={classes.wrapper}>
      <div className={classes.container}>
      <h2> Forgot Password</h2>

      <form className={classes.form}  onSubmit={formSubmitHandler}>
                            <div className={classes.formGroup}>
                                <label htmlFor="resetEmail">
                                    Email Reset:  </label>
                                <input
                                    type="email"
                                    id="resetEmail"
                                    name="resetEmail"
                                    placeholder="Enter your email for reset"
                                    value={email}
                                    onChange={handleChange}                                
                                />
                            </div>

                <button type="submit"> Send Email</button>
        </form>

      </div>
      </div>
    )


}

export default ResetPassword;