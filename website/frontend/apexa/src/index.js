// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import './index.css';
import App from './App';

ReactDOM.render(
  <Router> {/* Wrap your entire app with BrowserRouter */}
    <App />
  </Router>,
  document.getElementById('root')
);
