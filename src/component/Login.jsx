// src/Login.js
import React from 'react';
import './Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-header">Login</h2>
        <form className="login-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" placeholder="Enter your username" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
