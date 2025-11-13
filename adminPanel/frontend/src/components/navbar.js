// src/components/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "../css/style.css";

const Navbar = () => {
  return (
    <>
      <div className="top-bar"></div>
      <nav className="navbar">
        <div className="logo">
          <NavLink to="/admin">
            <img src="/assets/LOGO/pngl.png" alt="Collibra Logo" />
            <span>Collibra</span>
          </NavLink>
        </div>
        <ul className="nav-links">
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ViewBooks"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              View Books
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/EditBook"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Update Books
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
