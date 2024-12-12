import React, { useState } from "react";
import classes from "./Profile.module.css";
import { Link, useLocation } from "react-router";
import { FaGithub } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";

const Profile = (props) => {
    const location = useLocation();
    const check = location.pathname === "/profile";
    const [isUpdateProfile, setIsUpdateProfile] = useState(check ? false : true);

    console.log("PathName : ", location.pathname, "IsUpdateProfile : ", isUpdateProfile);

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
                        <form className={classes.form}>
                            <div className={classes.formGroup}>
                                <label htmlFor="fullName"><FaGithub/> Full Name:</label>
                                <input type="text" id="fullName" name="fullName" placeholder="Enter your full name" />
                            </div>
                            <div className={classes.formGroup}>
                                <label htmlFor="profilePhoto"> <TbWorld/> Profile Photo URL:</label>
                                <input type="url" id="profilePhoto" name="profilePhoto" placeholder="Enter the URL of your profile photo" />
                            </div>
                        </form>

                    </div>
                )}
            </main>
        </div>
    );
};

export default Profile;
