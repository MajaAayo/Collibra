import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Front from './pages/front';
import Explore from './pages/explore';
import Search from './pages/search';
import Bookmarks from './pages/bookmarks';
import About from './pages/about';
import Terms from './pages/terms';
import './App.css';
import PrivacyPolicy from './pages/privacy';

function App() {
  return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Front />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/search" element={<Search />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
  );
}

export default App;