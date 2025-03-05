import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Card from './Card';
import LoginPage from './LoginPage';
import './App.css'; // Import your CSS file for the App

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/card" element={<Card />} />
      </Routes>
    </Router>
  );
}

export default App;
