import React from 'react';
import { Link } from 'react-router-dom';

const Front = () => {
  return (
    <>
      <div className="hero">
  <div className="hero-text">
    <h4>One click destination for every book.</h4>
    <h1>Over a thousand books at your fingertips —
      <span>"read what you love, learn what you need."</span>
    </h1>
    <br />
    <p>Join our community of readers and discover your next favorite book.</p>
    <div className="buttons">
      <Link to="/explore">Explore More →</Link>
      <Link to="/about">About Us</Link>
    </div>
  </div>
  <div className="hero-image">
    <img src="/assets/Logo/background.jpg" alt="Hero" />
  </div>
  <div className="hero-img">
    <img src="/assets/Logo/28.png" alt="Reader-Image" className="reader-image" />
  </div>
</div>
      <div className="service-links">
        <Link to="/explore?category=fiction">Fiction</Link>
        <Link to="/explore?category=non-fiction">Non-fiction</Link>
        <Link to="/explore?category=academic">Academic & Reference</Link>
        <Link to="/subscription">Subscription</Link>
      </div>
    </>
  );
};

export default Front;