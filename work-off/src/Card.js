import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Card.css';
import Dashboard from './Dashboard';
import ViewProfile from './ViewProfile';
import LeaveHistory from './LeaveHistory';
import HolidayList from './HolidayList';
import LeaveRequest from './LeaveRequest';
import AddDbData from './AddDbData';
import LocateColleague from './LocateColleague';
import CompOffRequest from './CompOffRequest'
import { GiInterleavedClaws } from "react-icons/gi";
import { FiSearch } from "react-icons/fi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AiTwotoneFileAdd } from "react-icons/ai";
import { HiChatAlt } from "react-icons/hi";
import { faTachometerAlt, faCalendarAlt, faUser, faPen, faPlus, faList, faHistory, faPaperPlane, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Card = () => {
  const location = useLocation();
  const [selectedTile, setSelectedTile] = useState('dashboard');
  const [showLeaveDetailsSubTiles, setShowLeaveDetailsSubTiles] = useState(false);
  const [username, setUsername] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [datas, setDatas] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set initial login status
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_WORK_HOURS_BACKEND_URL;

  useEffect(() => {
    if (location.state && location.state.username) {
      setUsername(location.state.username);
    }
    if (location.state && location.state.defaultTile) {
      setSelectedTile(location.state.defaultTile);
    }
  }, [location.state]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/'); // Redirect to login page if not logged in
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (username) {
      const fetchData = async () => {
        try {
          const res = await fetch(`${apiUrl}/getLeaveDetails?username=${username}`);
          if (!res.ok) {
            throw new Error('Failed to fetch user details');
          }
          const data = await res.json();
          setDashboardData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [username]);
  
   // Fetch employee data when username changes
  useEffect(() => {
    if (username) {
      const fetchEmployeeData = async () => {
        try {
          const res = await fetch(`${apiUrl}/getEmployee?username=${username}`);
          if (!res.ok) {
            throw new Error('Failed to fetch employee data');
          }
          const data = await res.json();
          setDatas(data);
        } catch (error) {
          console.error('Error fetching employee data:', error);
        }
      };

      fetchEmployeeData();
    }
  }, [username]);

  const handleTileClick = (tile) => {
    if (tile === 'dashboard') {
      const fetchData = async () => {
        try {
          const res = await fetch(`${apiUrl}/getLeaveDetails?username=${username}`);
          if (!res.ok) {
            throw new Error('Failed to fetch user details');
          }
          const data = await res.json();
          setDashboardData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
      setShowLeaveDetailsSubTiles(false);
    } else if (tile === 'addDbData') {
      setShowLeaveDetailsSubTiles(false);
    } else if (tile === 'viewProfile') {
      setShowLeaveDetailsSubTiles(false);
    } else if (tile === 'locateColleague') {
      setShowLeaveDetailsSubTiles(false);
    } else if (tile === 'leaveDetails') {
      const fetchData = async () => {
        try {
          const res = await fetch(`${apiUrl}/getLeaveDetails?username=${username}`);
          if (!res.ok) {
            throw new Error('Failed to fetch user details');
          }
          const data = await res.json();
          setDashboardData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
      setShowLeaveDetailsSubTiles(!showLeaveDetailsSubTiles);
    }
    setSelectedTile(tile);
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Update login status
  };

  return (
    <div className="cardContainer">
      <header className="App-header">
        <h3>Work-Hours</h3>
        <GiInterleavedClaws className="logo"/>
        <div className="user-profile">
        <FontAwesomeIcon icon={faSignOutAlt}/>
          <div className="logout-menu">
            <div className="logout-menu-item" onClick={handleLogout}>
              Logout
            </div>
          </div>
        </div>
      </header>
      <main className="mainContent">
        <div className="cardLeft">
          <div className="card-left">
            <div
              className={`tile-left ${selectedTile === 'dashboard' ? 'selected' : ''}`}
              onClick={() => handleTileClick('dashboard')}
            >
              <FontAwesomeIcon icon={faTachometerAlt} className='fa-icon'/> Dashboard
            </div>
            <div
              className={`tile-left ${selectedTile === 'leaveDetails' ? 'selected' : ''}`}
              onClick={() => handleTileClick('leaveDetails')}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className='fa-icon'/> Leave Details
            </div>
            {showLeaveDetailsSubTiles && (
              <div className="sub-tiles">
                <div
                  className={`tile-left sub-tile ${selectedTile === 'leaveHistory' ? 'selected' : ''}`}
                  onClick={() => handleTileClick('leaveHistory')}
                >
                  <FontAwesomeIcon icon={faHistory} className='fa-icon'/> History
                </div>
                <div
                  className={`tile-left sub-tile ${selectedTile === 'holidayList' ? 'selected' : ''}`}
                  onClick={() => handleTileClick('holidayList')}
                >
                  <FontAwesomeIcon icon={faList} className='fa-icon'/> Holidays
                </div>
                <div
                  className={`tile-left sub-tile ${selectedTile === 'apply' ? 'selected' : ''}`}
                  onClick={() => handleTileClick('apply')}
                >
                  <FontAwesomeIcon icon={faPen} className='fa-icon'/> Apply
                </div>
                {datas && datas.position.toLowerCase().includes('lead') && (
                  <div
                    className={`tile-left sub-tile ${selectedTile === 'request' ? 'selected' : ''}`}
                    onClick={() => handleTileClick('request')}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className='fa-icon'/>Leave Request
                  </div>
                )}
                <div
                  className={`tile-left sub-tile ${selectedTile === 'addCompOff' ? 'selected' : ''}`}
                  onClick={() => handleTileClick('addCompOff')}
                >
                  <AiTwotoneFileAdd icon={faPaperPlane} className='fa-icon'/>Add Comp-Off
                </div>
                {datas && datas.position.toLowerCase().includes('lead') && (
                  <div
                    className={`tile-left sub-tile ${selectedTile === 'compOffRequest' ? 'selected' : ''}`}
                    onClick={() => handleTileClick('compOffRequest')}
                  >
                    <HiChatAlt icon={faPaperPlane} className='fa-icon'/>Comp-Off Request
                  </div>
                )}
              </div>
            )}
            <div
              className={`tile-left ${selectedTile === 'viewProfile' ? 'selected' : ''}`}
              onClick={() => handleTileClick('viewProfile')}
            >
              <FontAwesomeIcon icon={faUser} className='fa-icon'/> View Profile
            </div>
            { datas && datas.position.toLowerCase().includes('administrator') &&  (
                  <div
                  className={`tile-left ${selectedTile === 'addDbData' ? 'selected' : ''}`}
                  onClick={() => handleTileClick('addDbData')}
                >
                  <FontAwesomeIcon icon={faPlus} className='fa-icon'/> Add DB Data
                </div>
            )}
            <div
              className={`tile-left ${selectedTile === 'locateColleague' ? 'selected' : ''}`}
              onClick={() => handleTileClick('locateColleague')}
            >
              <FiSearch className='fa-icon'/> Locate Your Colleague
            </div>
          </div>
        </div>
        <div className="cardRight">
          <div className="card">
            {selectedTile === 'dashboard' && <Dashboard data={dashboardData} username={username} />}
            {selectedTile === 'viewProfile' && <ViewProfile username={username} />}
            {selectedTile === 'apply' && <LeaveHistory username={username} tileAction="AppliedLeave" />}
            {selectedTile === 'leaveHistory' && <LeaveHistory username={username} tileAction="Requested" />}
            {selectedTile === 'holidayList' && <HolidayList username={username} />}
            {selectedTile === 'request' && <LeaveRequest username={username} />}
            {selectedTile === 'addDbData' && <AddDbData />}
            {selectedTile === 'leaveDetails' && <Dashboard data={dashboardData} username={username} />}
            {selectedTile === 'locateColleague' && <LocateColleague />}
            {selectedTile === 'compOffRequest' && <CompOffRequest username={username} tileAction="compOffRequest"/>}
            {selectedTile === 'addCompOff' && <CompOffRequest username={username} tileAction="addCompOff"/>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Card;
