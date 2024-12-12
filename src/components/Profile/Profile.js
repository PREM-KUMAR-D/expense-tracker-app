import React, { useEffect, useState } from "react";
import classes from "./Profile.module.css";
import { Link, useLocation, useNavigate } from "react-router";
import { FaGithub } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";

const Profile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const check = location.pathname === "/profile";
    const [isUpdateProfile, setIsUpdateProfile] = useState(check ? false : true);
    const [formData, setFormData] = useState({
        fullName: "",
        profilePhoto: "",
    });

    const token = localStorage.getItem("token");

    
    useEffect(() => {
        const fetchProfileData = async () => {
            if (!token) return; 

            try {
                const res = await fetch(
                    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.REACT_APP_FIRE_BASE_API_KEY}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            idToken: token,
                        }),
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error.message || "Failed to fetch profile data");
                }

                const userInfo = data.users[0];
                setFormData({
                    fullName: userInfo.displayName || "",
                    profilePhoto: userInfo.photoUrl || "",
                });
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchProfileData();
    }, [token]);

    const logoutHandler = ()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        navigate('/login');
    }


    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_FIRE_BASE_API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        idToken: token,
                        displayName: formData.fullName,
                        photoUrl: formData.profilePhoto,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error.message || "Failed to update profile");
            }

            console.log("Profile updated successfully:", data);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

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
                    {token && <button type="button"  className={classes.logOutBtn}onClick={logoutHandler}> Logout</button>}

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
                            <button
                                className={classes.closeButton}
                                onClick={() => setIsUpdateProfile(false)}
                            >
                                Cancel
                            </button>
                        </div>
                        <form className={classes.form} onSubmit={handleFormSubmit}>
                            <div className={classes.formGroup}>
                                <label htmlFor="fullName">
                                    <FaGithub /> Full Name:
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    placeholder="Enter your full name"
                                    value={formData.fullName} 
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={classes.formGroup}>
                                <label htmlFor="profilePhoto">
                                    <TbWorld /> Profile Photo URL:
                                </label>
                                <input
                                    type="url"
                                    id="profilePhoto"
                                    name="profilePhoto"
                                    placeholder="Enter the URL of your profile photo"
                                    value={formData.profilePhoto} 
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
