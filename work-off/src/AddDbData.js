import React, { useState } from 'react';
import Select from 'react-select';
import './AddDbData.css';

const AddDbData = () => {
  const [view, setView] = useState('buttons');
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [empIdOptions, setEmpIdOptions] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const apiUrl = process.env.REACT_APP_WORK_HOURS_BACKEND_URL;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : '');
    setErrorMessage(''); // Clear error message on file selection
    console.log('Selected file:', file);
  };

  const fetchEmpIds = async () => {
    try {
      const response = await fetch(`${apiUrl}/getEmpIds`);
      if (response.ok) {
        const text = await response.text(); // Read the response as text
        if (text) {
          const data = JSON.parse(text); // Parse the text if it's not empty
          const options = data.map(empId => ({
            value: empId,
            label: empId
          }));
          setEmpIdOptions(options);
        } else {
          setEmpIdOptions([]); // Set to an empty array if data is null or undefined
        }
      } else {
        console.error('Error fetching empIds:', response.statusText);
        setEmpIdOptions([]); // Set to an empty array if response is not ok
      }

      setView('removeEmployee');
    } catch (error) {
      console.error('Error fetching empIds:', error);
      setEmpIdOptions([]); // Set to an empty array if there's an error
    }
  };

  const handleBack = () => {
    resetForm();
    setView('buttons');
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const buttonType = event.nativeEvent.submitter.getAttribute('data-button-type');
    console.log('Button clicked:', buttonType);

    if (buttonType !== 'remove-submit' && !fileName) {
      setErrorMessage('Please upload a file before submitting.');
      return;
    }

    if (buttonType === 'remove-submit' && !selectedEmpId) {
      setErrorMessage('Please select an employee ID before submitting.');
      return;
    }

    const formData = new FormData();
    if (buttonType !== 'remove-submit') {
      formData.append('file', event.target.elements.fileInput.files[0]);
    }

    try {
      let response;
      if (buttonType === 'employee-submit') {
        response = await fetch(`${apiUrl}/saveBulkEmployeeDetails`, {
          method: 'POST',
          body: formData,
        });
      } else if (buttonType === 'leave-submit') {
        response = await fetch(`${apiUrl}/saveBulkLeaveDetails`, {
          method: 'POST',
          body: formData,
        });
      } else if (buttonType === 'holiday-submit') {
        response = await fetch(`${apiUrl}/saveHolidayList`, {
          method: 'POST',
          body: formData,
        });
      } else if (buttonType === 'remove-submit') {
        response = await fetch(`${apiUrl}/deleteEmployee?empId=${selectedEmpId.value}`, {
          method: 'DELETE',
        });
      }

      if (response.ok) {
        setIsSuccess(true);
        setView('buttons');
        resetForm();

        // Hide success message after 3 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error performing the operation:', error);
      setErrorMessage('Error performing the operation. Please try again.');
    }
  };

  const resetForm = () => {
    setFileName('');
    setErrorMessage('');
    setSelectedEmpId(null);
  };

  const renderForm = () => {
    switch (view) {
      case 'addEmployee':
        return (
          <form className="form" onSubmit={handleSubmit}>
            <h2>Add Employee</h2>
            <div className="file-input-container">
              <label htmlFor="employeeFile" className="file-label">
                {fileName || 'Upload Excel File'}
              </label>
              <input
                id="employeeFile"
                name="fileInput"
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
              />
              {fileName && <div className="file-name">{fileName}</div>}
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button type="submit" data-button-type="employee-submit">Submit</button>
            <button type="button" onClick={() => handleBack()}>Back</button>
          </form>
        );
      case 'addLeaveDetails':
        return (
          <form className="form" onSubmit={handleSubmit}>
            <h2>Add Leave Details</h2>
            <div className="file-input-container">
              <label htmlFor="leaveDetailsFile" className="file-label">
                {fileName || 'Upload Excel File'}
              </label>
              <input
                id="leaveDetailsFile"
                name="fileInput"
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
              />
              {fileName && <div className="file-name">{fileName}</div>}
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button type="submit" data-button-type="leave-submit">Submit</button>
            <button type="button" onClick={() => handleBack()}>Back</button>
          </form>
        );
      case 'removeEmployee':
        return (
          <form className="form" onSubmit={handleSubmit}>
            <h2>Remove Employee Using Employee Id</h2>
            <div className="file-input-container">
              <label className="label">Select EmployeeId</label>
              <Select
                value={selectedEmpId}
                options={empIdOptions}
                onChange={setSelectedEmpId}
                isSearchable
              />
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button type="submit" data-button-type="remove-submit">Submit</button>
            <button type="button" onClick={() => handleBack()}>Back</button>
          </form>
        );
      case 'addHolidays':
        return (
          <form className="form" onSubmit={handleSubmit}>
            <h2>Add Holidays</h2>
            <div className="file-input-container">
              <label htmlFor="holidaysFile" className="file-label">
                {fileName || 'Upload Excel File'}
              </label>
              <input
                id="holidaysFile"
                name="fileInput"
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
              />
              {fileName && <div className="file-name">{fileName}</div>}
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button type="submit" data-button-type="holiday-submit">Submit</button>
            <button type="button" onClick={() => handleBack()}>Back</button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      {view === 'buttons' ? (
        <>
          {isSuccess && (
            <div className="successMessage">
              Operation done successfully!
            </div>
          )}
          <div className="buttonDiv">
            <button className="addDbDataButton" onClick={() => setView('addEmployee')}>
              Add Employee
            </button>
            </div>
            <div className="buttonDiv">
            <button className="addDbDataButton" onClick={() => fetchEmpIds()}>
              Remove Employee
            </button>
          </div>
          <div className="buttonDiv">
            <button className="addDbDataButton" onClick={() => setView('addLeaveDetails')}>
              Add Leave Details
            </button>
          </div>
          <div className="buttonDiv">
            <button className="addDbDataButton" onClick={() => setView('addHolidays')}>
              Add Holidays
            </button>
          </div>
        </>
      ) : (
        renderForm()
      )}
    </div>
  );
};

export default AddDbData;
