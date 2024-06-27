// src/Login.js
import React from 'react';
import './Login.css';

function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <div className="user-box">
            <input type="text" name="username" required="" />
            <label>Username</label>
          </div>
          <div className="user-box">
            <input type="password" name="password" required="" />
            <label>Password</label>
          </div>
          <button type="submit" className="login-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
