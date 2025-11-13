// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../css/style.css";

const Navbar = () => {
  return (
    <>
      <div className="top-bar"></div>
      <nav className="navbar">
        <div className="logo">
          <Link to="/admin">
            <img src="/assets/LOGO/pngl.png" alt="Collibra Logo" />
            <span>Collibra</span>
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/admin">Home</Link>
          </li>
          <li>
            <Link to="/ViewBooks">View Books</Link>
          </li>
          <li>
            <Link to="/EditBook">Update Books</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;