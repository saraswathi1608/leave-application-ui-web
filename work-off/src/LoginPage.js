import React, { useState, useRef } from 'react';
import { FaUserAlt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [useremail, setUseremail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showPasswordSentModal, setShowPasswordSentModal] = useState(false);
  const [passwordSentMessage, setPasswordSentMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // New state for password visibility
  const passwordSentTimerRef = useRef(null);
  const apiUrl = process.env.REACT_APP_WORK_HOURS_BACKEND_URL;
  console.log('apiurl:',apiUrl);

  const handleSignIn = async () => {
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    // if(username == 'Saranya'){
    //   navigate('/card', { state: { defaultTile: 'dashboard', username: username }  });
    // }

    try {
      const res = await fetch(`${apiUrl}/getEmployee?username=${username}`);
      if (!res.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data = await res.json();
      if (data.email === username && data.password === password) {
        navigate('/card', { state: { defaultTile: 'dashboard', username: username }  });
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('Error fetching data: ' + error.message);
    }
  };

  const handleForgotPassword = () => {
    setUseremail('');
    setShowForgotPasswordModal(true);
    setError('');
  };

  const sendPasswordEmail = async () => {
    if (!useremail.trim()) {
      setError('Email is required');
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/getLoginPassword?username=${username}`);
      if (!res.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data = await res.json();
      if (data.email === useremail) {
        
      } else {
        setError('Invalid username');
        return;
      }
    } catch (error) {
      setError('Error fetching data: ' + error.message);
    }

    setTimeout(() => {
      setShowForgotPasswordModal(false);
      const message = `Password sent to ${useremail} !!`;
      setPasswordSentMessage(message);
      setShowPasswordSentModal(true);
      passwordSentTimerRef.current = setTimeout(() => {
        setShowPasswordSentModal(false);
      }, 2000);
    }, 1000);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setError('');
  };

  const closePasswordSentModal = () => {
    setShowPasswordSentModal(false);
    if (passwordSentTimerRef.current) {
      clearTimeout(passwordSentTimerRef.current);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleOnChangeUserEmail = (e) => {
    setUseremail(e.target.value);
    setError("");
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1 className="login-heading">Work-Hours</h1>
        <div className="login-form">
          <div className="input-container">
            <FaUserAlt className="icon" />
            <input
              type="text"
              placeholder="Username"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-container password-container">
            <FaLock className="icon" />
            <input
              type={passwordVisible ? 'text' : 'password'} // Toggle visibility based on state
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="password-toggle" onClick={togglePasswordVisibility}>
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button className="login-button" onClick={handleSignIn}>
            Sign In
          </button>
          <a href="#" className="forgot-password" onClick={handleForgotPassword}>
            Forgot Password?
          </a>
        </div>
      </div>

      {showForgotPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <input
              type="text"
              placeholder="Enter your email"
              className="modal-input"
              value={useremail}
              onChange={handleOnChangeUserEmail}
            />
            {error && <p className="error-message">{error}</p>}
            <div className="profileActions">
              <button className="modal-button" onClick={sendPasswordEmail}>
                OK
              </button>
              <button className="modal-button" onClick={closeForgotPasswordModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordSentModal && (
        <div className="password-sent-message">
          <p>{passwordSentMessage}</p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
