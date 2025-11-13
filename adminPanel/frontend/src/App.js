// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Admin from './pages/admin';
import EditBook from './pages/EditBook';
import ViewBooks from './pages/ViewBooks';
import Login from './pages/Login';
import './App.css';


function PrivateRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('admin');
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  const handleLogin = (admin) => {
    localStorage.setItem('admin', JSON.stringify(admin));
    // Optionally, you can force a reload or redirect here
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        } />
        <Route path="/editbook" element={
          <PrivateRoute>
            <EditBook />
          </PrivateRoute>
        } />
        <Route path="/viewbooks" element={
          <PrivateRoute>
            <ViewBooks />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;