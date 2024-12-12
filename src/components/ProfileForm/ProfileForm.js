import React from "react";
import classes from "./ProfileForm.module.css";
import { FaGithub } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";

const ProfileForm = ({formData,setFormData,isUpdateProfile,setIsUpdateProfile})=>{

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const token = localStorage.getItem("token");

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

    return (
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
    )



}

export default ProfileForm;