import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import "./Footer.css";
import logo from "../flammeB.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <a href="https://www.instagram.com/flammestore__/" target="_blank" rel="noopener noreferrer" className="instagram-link">
          <FaInstagram className="instagram-icon" />
        </a>
      </div>
      <div className="footer-content">
        <img src={logo} alt="Flamme Logo" className="footer-logo" />
        <p className="footer-text">We do what we like 🔥</p>
      </div>
    </footer>
  );
};

export default Footer;
