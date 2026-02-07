// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

// Import Components and Pages
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage'; 
import DailyHoroscope from './components/DailyHoroscope';
import AstroShopSection from './components/AstroShopSection';
import PoojaSection from './components/PoojaSection';
import PoojaDetails from "./pages/PoojaDetails";
import ZodiacSigns from './components/ZodiacExplorer';
// import PromotionModal from './components/PromotionModal';
import SignupModal from './components/SignupModal';
import { AnimatePresence } from 'framer-motion';
import AstrologerList from './pages/AstrologerList';
import Profile from './pages/Profile';
import Contact from './components/Contact';


function App() {
  // const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);

  // const closePromoModal = () => setIsPromoModalOpen(false);

  // useEffect(() => {
  //   const hasSeenModal = sessionStorage.getItem('promoModalSeen');
  //   if (!hasSeenModal) {
  //     const timer = setTimeout(() => {
  //       setIsPromoModalOpen(true);
  //       sessionStorage.setItem('promoModalSeen', 'true');
  //     }, 15000);
  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  return (
    <Router>
      <AnimatePresence>
        {/* {isPromoModalOpen && <PromotionModal onClose={closePromoModal} />} */}
      </AnimatePresence>
      
      <SignupModal isOpen={isSignupModalOpen} onClose={closeSignupModal} />

      <Navbar onSignupClick={openSignupModal} />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/horoscope" element={<DailyHoroscope />} />
          <Route path="/shop" element={<AstroShopSection />} />
          <Route path="/pooja" element={<PoojaSection />} />
          <Route path="/pooja/:id" element={<PoojaDetails />} />
          <Route path="/zodiac-signs" element={<ZodiacSigns />} />
          <Route path="/astro-connect" element={<AstrologerList />} />
             <Route path="/Contact-us" element={<Contact />} />

          {/* This route correctly tells the app to render the Profile component */}
          <Route path="/profile/:userId" element={<Profile />} />
          
        </Routes>
      </main>
    </Router>
  );
}

export default App;










