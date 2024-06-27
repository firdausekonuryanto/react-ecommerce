// src/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <table width={'100%'}>
        <tr>
          <td width={'92%'}><span className="welcome-message">Welcome back, Firdaus !!!</span></td>
          <td align='center' width={'4%'}><img src={`${process.env.PUBLIC_URL}/setting account.png`} alt="config" className="config-icon" /></td>
          <td align='center' width={'4%'}><img src={`${process.env.PUBLIC_URL}/logout-icon.png`} alt="Logout" className="logout-icon" /></td>
        </tr>
      </table>
    </header>
  );
}

export default Header;
