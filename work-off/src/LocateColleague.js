import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { MdPersonSearch } from "react-icons/md";
import './LocateColleague.css';  // Create a CSS file for styling

const LocateColleague = () => {
    const [empNames, setEmpNames] = useState([]);
    const [selectedEmpName, setSelectedEmpName] = useState(null);
    const [empDetails, setEmpDetails] = useState(null);
    const [leaveDetails, setLeaveDetails] = useState(null);
    const apiUrl = process.env.REACT_APP_WORK_HOURS_BACKEND_URL;

    useEffect(() => {
        const fetchEmpNames = async () => {
            try {
                const response = await fetch(`${apiUrl}/getEmpEmailIds`);
                const data = await response.json();
                const options = data.map(name => ({
                    value: name,
                    label: name
                }));
                setEmpNames(options);
            } catch (error) {
                console.error('Error fetching empNames:', error);
            }
        };
        fetchEmpNames();
    }, []);

    const handleSelectedEmpName = (option) => {
        setSelectedEmpName(option);
        setEmpDetails(null);  // Clear previous details when a new name is selected
    };

    const fetchEmpDetails = async () => {
        if (selectedEmpName) {
            try {
                const response = await fetch(`${apiUrl}/getEmployee?username=${selectedEmpName.value}`);
                const data = await response.json();
                setEmpDetails(data);
                
                const res = await fetch(`${apiUrl}/getLeaveDetails?username=${selectedEmpName.value}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch leave details');
                }
                const leaveValue = await res.json();
                setLeaveDetails(leaveValue);
            } catch (error) {
                console.error('Error fetching empDetails:', error);
            }
        }
    };

    return (
        <div>
            <h2>Select colleague & Locate</h2>
            <div className="formRow">
                <div className="formColumn">
                    <div className="select-container">
                        <Select
                            placeholder='Select your Colleague'
                            value={selectedEmpName}
                            onChange={handleSelectedEmpName}
                            options={empNames}
                            isSearchable
                        />
                        <button onClick={fetchEmpDetails}><MdPersonSearch /></button>
                    </div>
                    {empDetails && (
                        <div className="emp-details">
                            <h2>Employee Details</h2>
                            <p><strong>Name:</strong> {empDetails.userName}</p>
                            <p><strong>Contact:</strong> {empDetails.mobile}</p>
                            <p><strong>Email:</strong> {empDetails.email}</p>
                            <p><strong>Date of Birth:</strong> {empDetails.dateOfBirth}</p>
                            <p><strong>Domain:</strong> {empDetails.domain}</p>
                            <p><strong>Position:</strong> {empDetails.position}</p>
                            <p><strong>Designation:</strong> {empDetails.designation}</p>
                        </div>
                    )}
                </div>
                <div className="formColumn">
                    {leaveDetails && (
                        <table className="leaveRequestTable">
                             <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Count</th>
                                </tr>
                            </thead> 
                            <tbody>
                                <tr>
                                    <td>Earned</td>
                                    <td>{leaveDetails.earned}</td>
                                </tr>
                                <tr>
                                    <td>Casual</td>
                                    <td>{leaveDetails.casual}</td>
                                </tr>
                                <tr>
                                    <td>Optional</td>
                                    <td>{leaveDetails.optional}</td>
                                </tr>
                                <tr>
                                    <td>Comp-Off</td>
                                    <td>{leaveDetails.compOff}</td>
                                </tr>
                                <tr>
                                    <td>Last Year Balance</td>
                                    <td>{leaveDetails.lastYearBalance}</td>
                                </tr>
                                <tr>
                                    <td>Total</td>
                                    <td>{leaveDetails.total}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocateColleague;
