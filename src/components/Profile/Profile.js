import React, { useEffect, useState } from "react";
import classes from "./Profile.module.css";
import { Link, useLocation, useNavigate } from "react-router";

import ProfileForm from "../ProfileForm/ProfileForm";

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
            <ProfileForm
                formData={formData}
                setFormData={setFormData}
                isUpdateProfile={isUpdateProfile}
                setIsUpdateProfile={setIsUpdateProfile}
            />
        </div>
    );
};

export default Profile;
