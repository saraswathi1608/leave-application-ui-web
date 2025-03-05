import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import DatePicker from 'react-multi-date-picker';
import './LoginPage.css';
import './LeaveHistory.css';


const LeaveHistory = ({ username, tileAction }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedHalfDay, setSelectedHalfDay] = useState('');
  const [type, setType] = useState('');
  const [selectedReportingTo, setSelectedReportingTo] = useState([]);
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});
  const [approvers, setApprovers] = useState([]);
  const [selectedApprover, setSelectedApprover] = useState('');
  const [isHalfDay , setIsHalfDay] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [view, setView] = useState('table');
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_WORK_HOURS_BACKEND_URL;

  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        const response = await fetch(`${apiUrl}/getEmpEmailIds`);
        const data = await response.json();
        const options = data.map(approver => ({
          value: approver,
          label: approver
        }));
        setApprovers(options);
      } catch (error) {
        console.error('Error fetching approvers:', error);
      }
    };

    fetchApprovers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/getLeaveHistory?username=${username}`);
        if (!res.ok) {
          throw new Error('Failed to fetch leave history');
        }
        const data = await res.json();
        setLeaveHistory(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const fetchLeaveHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/getLeaveHistory?username=${username}`);
      if (!res.ok) {
        throw new Error('Failed to fetch leave history');
      }
      const data = await res.json();
      console.log("Data leave his:",data);
      setLeaveHistory(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
      setView('table'); // Switch back to the table view after fetching the updated leave history
    }
  };

  if (isLoading) {
    return <div className="leaveHistory-loading">Loading...</div>;
  }

  const filteredLeaveHistory = tileAction === 'AppliedLeave'
    ? leaveHistory.filter(leave => leave.status === 'Requested')
    : leaveHistory.filter(leave => leave.status !== 'Requested');

  const handleApplyLeave = () => {
    setView('form');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const formattedDates = selectedDates.length > 0 
        ? selectedDates.map(date => new Date(date).toISOString().split('T')[0]).join(',')
        : '';
      const formattedHalfDay = selectedHalfDay 
        ? new Date(selectedHalfDay).toISOString().split('T')[0] 
        : '';
      const payload = {
        dates: formattedDates,
        type,
        emailId: username,
        reportingTo: selectedReportingTo.map(option => option.value).join(','),
        reason,
        halfDay: formattedHalfDay,
        requestApprover: selectedApprover
      };

      try {
        console.log('payload',payload);
        const response = await fetch(`${apiUrl}/saveAppliedLeave`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse response body only if it contains JSON
        const responseText = await response.text();
        if (responseText) {
          const data = JSON.parse(responseText);
          console.log('Form submitted successfully:', data);
        }

        setIsSuccess(true);
        resetForm();
        fetchLeaveHistory(); // Fetch the updated leave history after form submission

        // Hide success message after 3 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleBack = () => {
    resetForm();
    setView('table')
  };

  const validateForm = () => {
    const errors = {};
    if (selectedDates.length === 0 && !isHalfDay) errors.selectedDates = 'Date is required.';
    if(isHalfDay && !selectedHalfDay) errors.isHalfDay = 'Date is required';
    if (!type) errors.type = 'Type is required.';
    if (!selectedReportingTo || selectedReportingTo.length === 0) errors.reportingTo = 'Reporting to is required.';
    if (!reason) errors.reason = 'Reason is required.';
    if (!selectedApprover) errors.approver = 'Request Approver is required.';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setSelectedDates([]);
    setSelectedHalfDay('');
    setType('');
    setSelectedReportingTo([]);
    setReason('');
    setErrors({});
    setSelectedApprover('');
  };

  const handleReportingToChange = (selectedOptions) => {
    setSelectedReportingTo(selectedOptions);
    if (selectedOptions.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, reportingTo: '' }));
    }
  };

  const handleDatesChange = (dates) => {
    setSelectedDates(dates);
    if (dates.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, selectedDates: '' }));
    }
  };

  const handlePickHalfDayChange = (pickHalfDay) => {
    setSelectedHalfDay(pickHalfDay);
    if(selectedHalfDay){
      setErrors((prevErrors) => ({ ...prevErrors, selectedHalfDay: ''}));
    }
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, type: '' }));
    }
  };

  const handleApproverChange = (option) => {
    setSelectedApprover(option.value);
    if (option.value) {
      setErrors((prevErrors) => ({ ...prevErrors, approver: '' }));
    }
  };

  const handleHalfDay = (event) => {
    setIsHalfDay(event.target.checked);
    if(!(event.target.checked)){
      setSelectedHalfDay('');
    }
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, reason: '' }));
    }
  };

  return (
    <div>
      {view === 'table' ? (
        <div>
          {isSuccess && (
            <div className="successMessage">
              Leave applied successfully!
            </div>
          )}
          <table className="leaveHistory-table">
            <thead>
              <tr>
                {/* <th>Type</th> */}
                <th>Dates</th>
                {/* <th>Reporting To</th> */}
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaveHistory.map((leave, index) => (
                <tr key={index}>
                  {/* <td>{leave.type}</td> */}
                  <td>{leave.dates}</td>
                  {/* <td>{leave.reportingTo}</td> */}
                  <td>{leave.reason}</td>
                  <td>{leave.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {tileAction === 'AppliedLeave' && (
            <button className="applyLeaveButton" onClick={handleApplyLeave}>
              Apply Leave
            </button>
          )}
        </div>
      ) : (
        <div className="modal-overlay">
          <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="formRow">
            <div className="formColumn">
                <label className="label">Type</label>
                <select
                  className="inputField"
                  value={type}
                  onChange={handleTypeChange}
                >
                  <option value="">--Select--</option>
                  <option value="Casual">Casual</option>
                  <option value="Earned">Earned</option>
                  <option value="Optional">Optional</option>
                  <option value="Comp-Off">Comp-Off</option>
                  <option value="LastYearBalance">LastYearBalance</option>
                </select>
                {errors.type && <div className="errorText">{errors.type}</div>}
              </div>
              <div className="formColumn">
                <label className="label">Request Approver</label>
                <Select
                  value={approvers.find(option => option.value === selectedApprover)}
                  onChange={handleApproverChange}
                  options={approvers}
                  isSearchable
                />
                {errors.approver && <div className="errorText">{errors.approver}</div>}
              </div>
              </div>
            <div className="formRow">
            <div className="formColumn">
                <label className="label">Select Dates</label>
                <DatePicker
                  multiple
                  value={selectedDates}
                  onChange={handleDatesChange}
                  className="datePicker"
                />
                {errors.selectedDates && <div className="errorText">{errors.selectedDates}</div>}
              </div>
              <div className="formColumn centerContent">
                  <div className="checkboxContainer">
                    <input type="checkbox" name="halfDay" value="halfDay" onChange={handleHalfDay}/>
                    <label className="label">Half Day?</label>
                  </div>
                </div>
                {isHalfDay && (
                <div className="formColumn">
                <label className="label">Pick Half Day</label>
                <DatePicker
                  value={selectedHalfDay}
                  onChange={handlePickHalfDayChange}
                  className="datePicker"
                />
                {errors.selectedHalfDay && <div className="errorText">{errors.selectedHalfDay}</div>}
              </div>
                )}
            </div>
            <div className="formRow">
            <div className="formColumn">
                <label className="label">Reporting To</label>
                <Select
                  value={selectedReportingTo}
                  onChange={handleReportingToChange}
                  options={approvers}
                  isMulti
                  isSearchable
                />
                {errors.reportingTo && <div className="errorText">{errors.reportingTo}</div>}
              </div>
              <div className="formColumn">
              <label className="label">Reason:</label>
              {/* <textarea
                className="textAreaField"
                value={reason}
                onChange={handleReasonChange}
              /> */}
              <select
                  className="inputField"
                  value={reason}
                  onChange={handleReasonChange}
                >
                  <option value="">--Select--</option>
                  <option value="Health Issues">Health Issues</option>
                  <option value="Personal Reason">Personal Reason</option>
                  <option value="Festival Celebration">Festival Celebration</option>
                  <option value="Native Visit">Native Visit</option>
                </select>
              {errors.reason && <div className="errorText">{errors.reason}</div>}
              </div>
            </div>
            <div className="formRow">
            <div className="formColumn">
            <button type="submit" className="submitButton">Apply</button>
            </div><div className="formColumn">
            <button type="button" className="submitButton" onClick={() => handleBack()}>Back</button>
            </div></div>
          </form>
        </div>
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;
