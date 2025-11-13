import React, { useState, useEffect, useCallback } from 'react';
import { FaGooglePlay, FaApple } from 'react-icons/fa';

const AboutUs = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const toggleComingSoon = useCallback(() => {
    setShowComingSoon((prev) => {
      const newState = !prev;
      document.body.style.overflow = newState ? 'hidden' : 'auto';
      return newState;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('storage', () => {});

    return () => {
      window.removeEventListener('storage', () => {});
      document.body.style.overflow = 'auto'; // Cleanup overflow style
    };
  }, []);

  return (
    <>
      <main>
        <section className="about-us">
          <div className="container">
            <div className="about-us-header">
            <h1>About Us</h1>
            </div>
            <p>
              Collibra is your ultimate digital library platform dedicated to making reading accessible to everyone. We provide a vast collection of e-books, and digital publications across multiple genres. Whether you're a casual reader or a book enthusiast, our platform offers curated collections, personalized recommendations, and seamless reading experiences across all your devices.
            </p>
            <p>
              Our mission is to empower readers and writers by creating a community-driven platform where knowledge and stories come alive. We believe in the power of reading to transform minds and connect people across the globe. Collibra provides authors and publishers with tools to reach a global audience while giving readers instant access to a world of literature at their fingertips.
            </p>

            <div className="mobile-app-section">
              <h2>Experience Collibra On The Go</h2>
              <p>Access your favorite books anytime, anywhere with our mobile application</p>
              
              <div className="mobile-app-content">
                <div className="mobile-app-image">
                  <img src="/assets/LOGO/37.png" alt="Collibra Mobile App" />
                </div>
                
                <div className="download-options">
                  <h3>Download Our App</h3>
                  <p>Get full access to our library with our feature-rich mobile application</p>
                  
                  <div className="download-buttons">
                    <button 
                      className="download-btn play-store" 
                      onClick={toggleComingSoon} 
                      aria-label="Download from Google Play"
                    >
                      <FaGooglePlay className="icon" />
                      <div className="btn-text">
                        <span>GET IT ON</span>
                        <span>Google Play</span>
                      </div>
                    </button>
                    
                    <button 
                      className="download-btn app-store" 
                      onClick={toggleComingSoon} 
                      aria-label="Download from App Store"
                    >
                      <FaApple className="icon" />
                      <div className="btn-text">
                        <span>Download on the</span>
                        <span>App Store</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p>
              Our platform features advanced reading tools including bookmarking, and the ability to download books for offline reading. We support multiple formats and provide a seamless experience.
            </p>

            <p>
              We're committed to building a vibrant community of readers and supporting independent authors. Our features include easy book discovery, curated collections, and the ability to explore trending reads. We help readers find their next favorite book through smart algorithms and community recommendations. Whether you're exploring new genres or revisiting classics, Collibra is your gateway to endless stories.
            </p>

            <p>
              We're passionate about connecting people with great books and stories. Thank you for being part of the Collibra community. Your reading journey is our inspiration. If you have any questions, suggestions, or feedback, we'd love to hear from you. Together, let's make reading more accessible and enjoyable for everyone.
            </p>

            <p>
              Sincerely,
            </p>
            <p>
              Collibra Team
            </p>
          </div>
        </section>
      </main>

      {/* Updated Coming Soon Modal */}
      {showComingSoon && (
        <div 
          className="modal-overlay" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="coming-soon-title"
        >
          <div className="coming-soon-modal">
            <h3 id="coming-soon-title">Coming Soon!</h3>
            <p>The Collibra mobile app will be available for download in the coming weeks.</p>
            <p>Stay tuned for updates on our release date!</p>
            <button 
              className="close-modal-btn" 
              onClick={toggleComingSoon} 
              aria-label="Close Coming Soon Modal"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AboutUs;