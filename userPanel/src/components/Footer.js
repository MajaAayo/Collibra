import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="footer-col">
            <div className="footer-logo">
              <img src="/assets/Logo/pngl.png" alt="logo-img" />
              <span>COLLIBRA</span>
            </div>
            <p>Your digital library with over every book across various genres.</p>
            <div className="social-links">
              <a href="https://www.facebook.com/"><i className="fab fa-facebook-f"></i></a>
              <a href="https://www.twitter.com/"><i className="fab fa-x"></i></a>
              <a href="https://www.instagram.com/"><i className="fab fa-instagram"></i></a>
              <a href="https://www.pinterest.com/"><i className="fab fa-pinterest-p"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h3>Contact</h3>
            <ul>
              <li><i className="fas fa-map-marker-alt"></i> Koshi Haraicha, Koshi Province, Nepal</li>
              <li><i className="fas fa-envelope"></i> info@collibra.com</li>
              <li><i className="fas fa-phone"></i> +977 98XXXXXXXX</li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Support</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Collibra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;