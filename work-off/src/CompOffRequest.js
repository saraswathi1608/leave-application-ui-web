import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import DatePicker from 'react-multi-date-picker';
import './CompOffRequest.css';

const CompOffRequest = ({ username, tileAction }) => {
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedReportingTo, setSelectedReportingTo] = useState([]);
    const [reason, setReason] = useState('');
    const [errors, setErrors] = useState({});
    const [approvers, setApprovers] = useState([]);
    const [selectedApprover, setSelectedApprover] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
  
    const [view, setView] = useState('table');
    const [compOffHistory, setCompOffHistory] = useState([]);
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
          const res = await fetch(`${apiUrl}/getCompOffHistory?username=${username}`);
          if (!res.ok) {
            throw new Error('Failed to fetch leave history');
          }
          const data = await res.json();
          setCompOffHistory(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, [username]);
  
    const fetchCompOffHistory = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${apiUrl}/getCompOffHistory?username=${username}`);
        if (!res.ok) {
          throw new Error('Failed to fetch leave history');
        }
        const data = await res.json();
        console.log("Data comp-off his:",data);
        setCompOffHistory(data);
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
  
    const filteredCompOffHistory = tileAction === 'compOffRequest'
      ? compOffHistory.filter(leave => leave.status === 'Requested')
      : compOffHistory.filter(leave => leave);
  
    const handleAddCompOff = () => {
      setView('form');
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (validateForm()) {
        const formattedDates = selectedDates.length > 0 
          ? selectedDates.map(date => new Date(date).toISOString().split('T')[0]).join(',')
          : '';
        const payload = {
          dates: formattedDates,
          emailId: username,
          reportingTo: selectedReportingTo.map(option => option.value).join(','),
          reason,
          requestApprover: selectedApprover
        };
  
        try {
          console.log('payload',payload);
          const response = await fetch(`${apiUrl}/saveCompOffHistory`, {
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
          fetchCompOffHistory(); // Fetch the updated leave history after form submission
  
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

    const handleAction = async (id, action) => {
      const payload = {
        id,
        action
      };
      console.log('payload:', payload);
      try {
        const response = await fetch(`${apiUrl}/updateCompOffHistory`, {
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
        setCompOffHistory(compOffHistory.filter(request => request.id !== id));
        console.log(`Leave request ${action}ed successfully`);
      } catch (error) {
        console.error(`Error ${action}ing leave request:`, error);
      }
    };
    
      const validateForm = () => {
        const errors = {};
        if (selectedDates.length === 0) errors.selectedDates = 'Date is required.';
        if (!selectedReportingTo || selectedReportingTo.length === 0) errors.reportingTo = 'Reporting to is required.';
        if (!reason) errors.reason = 'Reason is required.';
        if (!selectedApprover) errors.approver = 'Request Approver is required.';
        setErrors(errors);
        return Object.keys(errors).length === 0;
      };
    
      const resetForm = () => {
        setSelectedDates([]);
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
    
      const handleApproverChange = (option) => {
        setSelectedApprover(option.value);
        if (option.value) {
          setErrors((prevErrors) => ({ ...prevErrors, approver: '' }));
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
      {tileAction === 'addCompOff' ? (
        <div>
          {view === 'table' ? (
            <div>
              {isSuccess && (
                <div className="successMessage">
                  Comp-Off Requested successfully!
                </div>
              )}
              <table className="compOffHistory-table">
                <thead>
                  <tr>
                    {/* <th>Type</th> */}
                    <th>Dates</th>
                    {/* <th>Requested To</th> */}
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompOffHistory.map((compOff, index) => (
                    <tr key={index}>
                      {/* <td>{leave.type}</td> */}
                      <td>{compOff.dates}</td>
                      {/* <td>{compOff.reportingTo}</td> */}
                      <td>{compOff.reason}</td>
                      <td>{compOff.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tileAction === 'addCompOff' && (
                <button className="addCompOffButton" onClick={handleAddCompOff}>
                  ADD
                </button>
              )}
            </div>
          ) : (
            <div className="modal-overlay">
              <div className="modal-content">
              <form onSubmit={handleSubmit}>
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
                    <label className="label">Requested To</label>
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
                    <label className="label">Comp-Off Dates</label>
                    <DatePicker
                      multiple
                      value={selectedDates}
                      onChange={handleDatesChange}
                      className="datePicker"
                    />
                    {errors.selectedDates && <div className="errorText">{errors.selectedDates}</div>}
                  </div>
                  <div className="formColumn">
                  <label className="label">Reason:</label>
                  <textarea
                    className="textAreaField"
                    value={reason}
                    onChange={handleReasonChange}
                  />
                  {errors.reason && <div className="errorText">{errors.reason}</div>}
                  </div>
                </div>
                <div className="formRow">
                <div className="formColumn">
                <button type="submit" className="submitButton">Send Request</button>
                </div><div className="formColumn">
                <button type="button" className="submitButton" onClick={() => handleBack()}>Back</button>
                </div></div>
              </form>
            </div>
            </div>
          )}
        </div>
      ) : (
            <table className="compOffHistory-table">
                <thead>
                  <tr>
                    {/* <th>Emp Id</th> */}
                    <th>Emp Name</th>
                    <th>Dates</th>
                    <th>Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompOffHistory.map((compOff, index) => (
                    <tr key={index}>
                      {/* <td>{compOff.employeeId}</td> */}
                      <td>{compOff.empName}</td>
                      <td>{compOff.dates}</td>
                      <td>{compOff.reason}</td>
                      <td>
                        <button className="acceptButton" onClick={() => handleAction(compOff.id, 'accept')}>Accept</button>
                        <button className="rejectButton" onClick={() => handleAction(compOff.id, 'reject')}>Reject</button>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
      )}
    </div>
      );
    };

export default CompOffRequest;