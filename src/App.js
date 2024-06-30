// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Header from './Header';
import SideMenu from './SideMenu';
import Footer from './Footer';
import Home from './Home';
import Services from './Services';
import About from './About';
import Contact from './Contact';
import Products from './Products';
import Finaltransaction from './Finaltransaction';
import ReportTransactions from './ReportTransactions';
import Outside from './Outside';
import Login from './Login';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname !== '/login' || location.pathname !== '/outside'  && <Header />}
      {location.pathname !== '/login' || location.pathname !== '/outside' && <SideMenu />}
      <div className="main-content">
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<Outside />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/Finaltransaction" element={<Finaltransaction />} />
          <Route path="/Outside" element={<Outside />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </div>
      {location.pathname !== '/login' || location.pathname !== '/outside' && <Footer />}
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
