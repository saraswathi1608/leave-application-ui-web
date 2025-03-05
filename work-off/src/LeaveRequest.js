import React, { useState, useEffect } from 'react';
import './LeaveRequest.css'; // Import your CSS file

const LeaveRequest = ({ username }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const apiUrl = process.env.REACT_APP_WORK_HOURS_BACKEND_URL;

  useEffect(() => {
    // Fetch leave requests from backend API when component mounts
    const fetchLeaveRequests = async () => {
      try {
        const res = await fetch(`${apiUrl}/getRequestedLeave?username=${username}`);
        if (res.ok) {
          const text = await res.text(); // Read the response as text
          if (text) {
            const data = JSON.parse(text); // Parse the text if it's not empty
            console.log('leave request data:', data);
            setLeaveRequests(data);
          } else {
            setLeaveRequests([]);
          }
        } else {
          throw new Error('Failed to fetch requested leave history');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchLeaveRequests();
  }, [username]);

  const handleAction = async (id, action) => {
    const payload = {
      id,
      action
    };
    console.log('payload:', payload);
    try {
      const response = await fetch(`${apiUrl}/updateLeaveHistory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Update the state to remove the processed request
      setLeaveRequests(leaveRequests.filter(request => request.id !== id));
      console.log(`Leave request ${action}ed successfully`);
    } catch (error) {
      console.error(`Error ${action}ing leave request:`, error);
    }
  };

  return (
    <div>
      <h2>Leave Requests</h2>
      <div className="table-container">
        <table className="leaveRequestTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((request, index) => (
              <tr key={index}>
                <td>{request.empName}</td>
                <td>{request.dates}</td>
                <td>{request.reason}</td>
                <td>
                  <button className="acceptButton" onClick={() => handleAction(request.id, 'accept')}>Accept</button>
                  <button className="rejectButton" onClick={() => handleAction(request.id, 'reject')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequest;
