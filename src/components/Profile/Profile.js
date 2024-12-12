import React, { useState } from "react";
import classes from "./Profile.module.css";
import { Link, useLocation } from "react-router";
import { FaGithub } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";






const Profile = (props) => {
    const location = useLocation();
    const check = location.pathname === "/profile";
    const [isUpdateProfile, setIsUpdateProfile] = useState(check ? false : true);
    const [formData,setFormData] = useState({
        fullname:"",
        photoUrl:"",
    })

    const token = localStorage.getItem("token");

    const handleFormSubmit = async(event)=>{
        event.preventDefault();
        try {
            const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_FIRE_BASE_API_KEY}`,{
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    idToken: token,
                    displayName: event.target.fullName.value,
                    photoUrl: event.target.profilePhoto.value,
                })
            });

            const data = await res.json();
            
            if(!res.ok){
                throw new Error(res.body);
            }

            console.log("The result is ", JSON.stringify(data));


        } catch (error) {
            console.log(error);
        }

    }

    const handleChange= (event)=>{
        const key = event.target.name;
        const value = event.target.value;
        setFormData((prevData)=>{
            return {...prevData, [key]: value}
        })
    }


    return (
        <div className={classes.container}>
            <nav>
                <div className={classes.navContainer}>
                    <div className={classes.title}>
                        <h1>
                            {!isUpdateProfile
                                ? "Welcome to Expense Tracker !!"
                                : "Winners never quit, Quitters never win"}
                        </h1>
                    </div>
                    <div className={classes.profile}>
                        {!isUpdateProfile ? (
                            <p>
                                Your Profile is Incomplete.
                                <Link to="/update-profile" onClick={() => setIsUpdateProfile(true)}>
                                    Complete Now
                                </Link>
                            </p>
                        ) : (
                            <p>
                                Your Profile is 64% Completed. A Completed Profile has a higher chance
                                of landing a job.
                                <Link to="/update-profile" onClick={() => setIsUpdateProfile(true)}>
                                    Complete Now
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </nav>
            <main className={classes.mainContainer}>
                {isUpdateProfile && (
                    <div className={classes.contactContainer}>
                        <div className={classes.header}>
                            <div className={classes.contactDetails}>
                                <h2>Contact Details</h2>
                            </div>
                            <button className={classes.closeButton} onClick={() => setIsUpdateProfile(false)}>
                                Cancel
                            </button>
                        </div>
                        <form className={classes.form} onSubmit={handleFormSubmit}>
                            <div className={classes.formGroup}>
                                <label htmlFor="fullName"><FaGithub/> Full Name:</label>
                                <input 
                                    type="text" 
                                    id="fullName" 
                                    name="fullName" 
                                    placeholder="Enter your full name"
                                    onChange={handleChange}
                                    />
                            </div>
                            <div className={classes.formGroup}>
                                <label htmlFor="profilePhoto"> <TbWorld/> Profile Photo URL:</label>
                                <input 
                                    type="url" 
                                    id="profilePhoto" 
                                    name="profilePhoto" 
                                    placeholder="Enter the URL of your profile photo"
                                    onChange={handleChange}
                                    />
                            </div>

                            <button type="submit">Submit</button>
                        </form>

                    </div>
                )}
            </main>
        </div>
    );
};

export default Profile;
