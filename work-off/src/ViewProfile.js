import React, { useState, useEffect } from 'react';
import './ViewProfile.css'; 
import { FaEdit } from 'react-icons/fa';

const ViewProfile = ({ username }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const apiUrl = process.env.REACT_APP_WORK_HOURS_BACKEND_URL;
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        mobile: "",
        position: "",
        employeeId: "",
        dateOfBirth: "",
        designation: "",
        domain: "",
    });

    useEffect(() => {
        fetch(`${apiUrl}/getEmployee?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setProfile({
                    name: data.userName,
                    email: data.email,
                    mobile: data.mobile,
                    position: data.position,
                    employeeId: data.employeeId,
                    dateOfBirth: data.dateOfBirth,
                    designation: data.designation,
                    domain: data.domain,
                });
            })
            .catch(error => console.error('Error fetching profile data:', error));
    }, [username]);

    const handleEdit = () => setIsEditMode(true);

    const handleSave = async () => {
        const payload = {
            userName: profile.name,
            mobile: profile.mobile,
            email: profile.email,
            position: profile.position,
            designation: profile.designation,
            domain: profile.domain,
            dateOfBirth: profile.dateOfBirth,
            employeeId: profile.employeeId,
        };

        try {
            const response = await fetch('${apiUrl}/updateEmployeeDetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Profile updated successfully:', data);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
        setIsEditMode(false);
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    return (
        <div className="profileContainer">
            <div className="profileDetails">
            <h2 className="profileHeader">Profile Information</h2>
                {isEditMode ? (
                    <>
                        <div className="profileRow">
                            <div className="profileCol">
                                <label>User Name</label>
                                <input type="text" name="name" value={profile.name} onChange={handleChange} readOnly />
                            </div>
                            <div className="profileCol">
                                <label>Email</label>
                                <input type="email" name="email" value={profile.email} onChange={handleChange} readOnly />
                            </div>
                        </div>
                        <div className="profileRow">
                            <div className="profileCol">
                                <label>Mobile</label>
                                <input type="text" name="mobile" value={profile.mobile} onChange={handleChange} />
                            </div>
                            <div className="profileCol">
                                <label>Position</label>
                                <input type="text" name="position" value={profile.position} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="profileRow">
                            <div className="profileCol">
                                <label>Employee ID</label>
                                <input type="text" name="employeeId" value={profile.employeeId} onChange={handleChange} readOnly />
                            </div>
                            <div className="profileCol">
                                <label>Date of Birth</label>
                                <input type="date" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="profileRow">
                            <div className="profileCol">
                                <label>Designation</label>
                                <input type="text" name="designation" value={profile.designation} onChange={handleChange} />
                            </div>
                            <div className="profileCol">
                                <label>Domain</label>
                                <input type="text" name="domain" value={profile.domain} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="profileActions">
                            <button className="saveButton" onClick={handleSave}>Save</button>
                            <button className="cancelButton" onClick={() => setIsEditMode(false)}>Cancel</button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="profileRow">
                            <div className="profileCol">
                                <strong>User Name:</strong> {profile.name}
                            </div>
                            <div className="profileCol">
                                <strong>Email:</strong> {profile.email}
                            </div>
                        </div>
                        <div className="profileRow">
                            <div className="profileCol">
                                <strong>Mobile:</strong> {profile.mobile}
                            </div>
                            <div className="profileCol">
                                <strong>Position:</strong> {profile.position}
                            </div>
                        </div>
                        <div className="profileRow">
                            <div className="profileCol">
                                <strong>Employee ID:</strong> {profile.employeeId}
                            </div>
                            <div className="profileCol">
                                <strong>Date of Birth:</strong> {profile.dateOfBirth}
                            </div>
                        </div>
                        <div className="profileRow">
                            <div className="profileCol">
                                <strong>Designation:</strong> {profile.designation}
                            </div>
                            <div className="profileCol">
                                <strong>Domain:</strong> {profile.domain}
                            </div>
                        </div>
                        <div className="editButton">
                            <FaEdit className="editIcon" onClick={handleEdit} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ViewProfile;
