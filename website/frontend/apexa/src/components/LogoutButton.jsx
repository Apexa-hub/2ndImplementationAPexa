// src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LogoutButton.css';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get('/logout');
      if (response.data.Status === "Success") {
        navigate('/signin'); // Change the route to your sign-in page
      } else {
        console.error('Logout failed: Unsuccessful response');
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
