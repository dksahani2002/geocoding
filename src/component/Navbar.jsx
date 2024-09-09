// src/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
  const location = useLocation(); // Get the current path

  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li className={`navbar-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Link to="/" className="navbar-link">Home</Link>
        </li>
        <li className={`navbar-item ${location.pathname === '/geocode' ? 'active' : ''}`}>
          <Link to="/geocode" className="navbar-link">Geocode</Link>
        </li>
        <li className={`navbar-item ${location.pathname === '/geocode-natcat' ? 'active' : ''}`}>
          <Link to="/geocode-natcat" className="navbar-link">GeocodeNatcat</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
