// src/components/Header.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import './Header.css';

const Header = () => {
  const location = useLocation();
  
  /*
  const showLogoutButtonRoutes = ['/history', '/create','/uploadImagePage'];

  {showLogoutButtonRoutes.includes(location.pathname) && (
              <li><LogoutButton /></li>)}
              <li><NavLink to="/gallery">Gallery</NavLink></li>
  */

  return (
    <header className="header">
      <div className="logo">APEXA</div>
      <nav>
        <div className="navlinks">
          <ul>
            <li><NavLink to="/" end>Home</NavLink></li>
            <li><NavLink to="/signin">Log In</NavLink></li>
            <li><NavLink to="/history">History</NavLink></li>
            
            <li><NavLink to="/signin">Create</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
