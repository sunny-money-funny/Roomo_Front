// src/App.js
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home'; 
import Chat from './components/Chat/Chat';
import ReservationHistory from './components/Chat/ReservationHistory';
import ProviderChat from './components/Provider/ProviderChat';

function App() {
  return (
    <Router>
      <div className="App">
        <h1 style={{ fontSize: '25px', textAlign: 'center', color: '#FFFFFF' }}>{/* */} </h1>
        <Routes>
          <Route path="/" element={<Home />} />             
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat" element={<ReservationHistory />} />          
          <Route path="/provider" element={<ProviderChat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App