import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <header className="privacy-header">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
      </header>

      <div className="policy-content">
        <section className="policy-section">
          <h2>1. Information We Collect</h2>
          <p>
            When you use Collibra, we may collect personal information including:
          </p>
          <ul>
            <li>Account registration details (name, email)</li>
            <li>Reading preferences and history</li>
            <li>Device and usage information</li>
            <li>Payment details for premium services</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>2. How We Use Your Information</h2>
          <p>
            We use your data to:
          </p>
          <ul>
            <li>Provide and personalize our services</li>
            <li>Process transactions securely</li>
            <li>Improve our platform and develop new features</li>
            <li>Communicate important service updates</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. Data Security</h2>
          <p>
            We implement industry-standard security measures including:
          </p>
          <ul>
            <li>SSL/TLS encryption</li>
            <li>Regular security audits</li>
            <li>Limited employee access to sensitive data</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>4. Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul>
            <li>Access and request a copy of your data</li>
            <li>Request correction or deletion</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent where applicable</li>
          </ul>
        </section>

        <div className="contact-section">
          <h3>Contact Us</h3>
          <p>
            For privacy-related inquiries, please contact our Data Protection Officer at <br />
            <br />
            <ul>
              <li><i className="fas fa-map-marker-alt"></i> Koshi Haraicha, Koshi Province, Nepal</li>
              <li><i className="fas fa-envelope"></i> info@collibra.com</li>
              <li><i className="fas fa-phone"></i> +977 98XXXXXXXX</li>
            </ul>
          </p>
        </div>
      </div>

    </div>
  );
};

export default PrivacyPolicy;