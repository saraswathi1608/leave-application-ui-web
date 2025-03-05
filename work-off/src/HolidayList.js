import React, { useEffect, useState } from 'react';
import './HolidayList.css';

const HolidayList = ({ username }) => {
  const [holidays, setHolidays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [type, setType] = useState('COMPULSORY'); // Set default type to 'COMPULSORY'
  const apiUrl = process.env.REACT_APP_WORK_HOURS_BACKEND_URL;

  const fetchHolidays = async (holidayType) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/getHolidayList?type=${holidayType}`);
      if (response.ok) {
        const text = await response.text(); // Read the response as text
        if (text) {
          const data = JSON.parse(text); // Parse the text if it's not empty
          setHolidays(data);
        } else {
          setHolidays([]); // Set to an empty array if data is null or undefined
        }
      } else {
        console.error('Network response was not ok');
        setHolidays([]); // Set to an empty array if response is not ok
      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (type) {
      fetchHolidays(type);
    }
  }, [type]);

  const handleTileClick = (holidayType) => {
    setType(holidayType);
  };

  return (
    <div className="holidayList-container">
      <div className="holidayList-tiles">
        <h3 className="holidayList-title">Holiday List</h3>
        <div
          className={`tile ${type === 'COMPULSORY' ? 'selected' : ''}`}
          onClick={() => handleTileClick('COMPULSORY')}
        >
          Compulsory
        </div>
        <div
          className={`tile ${type === 'OPTIONAL' ? 'selected' : ''}`}
          onClick={() => handleTileClick('OPTIONAL')}
        >
          Optional
        </div>
      </div>
      <div className="holidayList-content">
        {type && (
          <div className="holidayList-tableContainer">
            {isLoading ? (
              <div className="holidayList-loading">Loading...</div>
            ) : (
              <table className="holidayList-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Holiday</th>
                  </tr>
                </thead>
                <tbody>
                  {holidays.map((holiday, index) => (
                    <tr key={index}>
                      <td>{holiday.holidayDate}</td>
                      <td>{holiday.holidayDay}</td>
                      <td>{holiday.holiday}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidayList;
