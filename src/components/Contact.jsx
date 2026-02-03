import React, { useState } from "react"; 
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowRight, FiLoader, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import heroImage1 from '../assets/hero-1.png';
import heroImage2 from '../assets/new.png';
import heroImage3 from '../assets/hero-3.png';

import ServicesSection from '../components/ServicesSection';
import DailyInsights from '../components/DailyInsights';
import ConsultationTopics from '../components/ConsultationTopics';
import NakshatrasSection from '../components/NakshatrasSection';
import Testimonials from '../components/Testimonials';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';
import "./Contact.css";

const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  const toastClass = type === "success" ? "toast-success" : "toast-error";
  const Icon = type === "success" ? FiCheckCircle : FiXCircle;
  return (
    <motion.div
      className={`toast-notification ${toastClass}`}
      initial={{ opacity: 0, y: -50, x: "50%" }}
      animate={{ opacity: 1, y: 0, x: "0%" }}
      exit={{ opacity: 0, y: -50, x: "50%" }}
      transition={{ duration: 0.3 }}
    >
      <Icon className="toast-icon" />
      <span className="toast-message">{message}</span>
      <button onClick={onClose} className="toast-close-btn">&times;</button>
    </motion.div>
  );
};

const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    tob: "",
    pob: "",
    query: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setToast(null);

    try {
      // ✅ Make real API call instead of simulation
      const response = await fetch("https://www.kalpjyotish.com/api/api/contact/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          gender: formData.gender,
          dob_time: `${formData.dob} ${formData.tob}`,
          place_of_birth: formData.pob,
          query: formData.query,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Form submitted successfully:", data);
        setToast({ message: "Thank you! Your query has been submitted successfully.", type: "success" });

        setFormData({
          name: "",
          email: "",
          mobile: "",
          gender: "",
          dob: "",
          tob: "",
          pob: "",
          query: "",
        });
      } else {
        throw new Error(data.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setToast({ message: "Oops! Something went wrong. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
      setTimeout(() => setToast(null), 5000);
    }
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/919105783395", "_blank");
  };

  const slideContent = [
    {
      image: heroImage1,
      title: "Chart Your Destiny",
      subtitle: "Personalized birth charts and detailed astrological reports.",
      link: "/zodiac-signs"
    },
    {
      image: heroImage2,
      title: "Consult with Experts",
      subtitle: "Connect with renowned astrologers for one-on-one sessions.",
      link: "/talk"
    },
    {
      image: heroImage3,
      title: "Ancient Wisdom, Modern Insights",
      subtitle: "Explore Vedic astrology to illuminate your life's path.",
      link: "/horoscope"
    }
  ];

  return (
    <div className="landing-page-wrapper">
      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>

      <section className="hero-section">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          effect="fade"
          speed={1200}
          className="hero-swiper"
        >
          {slideContent.map((slide, index) => (
            <SwiperSlide key={index} className="hero-slide">
              <div className="slide-background" style={{ backgroundImage: `url(${slide.image})` }}></div>
              <div className="slide-overlay"></div>
              {/* <motion.div
                className="slide-content"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
              >
                {slide.title && <h1 className="slide-title">{slide.title}</h1>}
                {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
                <Link to={slide.link} className="cta-button">
                  <span>Explore Now</span>
                  <FiArrowRight />
                </Link>
              </motion.div> */}
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="contact-form-section section-padding">
        <motion.div
          className="contact-form-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="form-card-header">
            <h2>Connect With Us</h2>
            <p>Have a question or need guidance? Fill out the form below!</p>
          </div>
          <form onSubmit={handleSubmit} className="contact-form-actual">
            <motion.div className="form-group" whileHover={{ scale: 1.01 }}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your Full Name" required />
            </motion.div>

            <motion.div className="form-group" whileHover={{ scale: 1.01 }}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" required />
            </motion.div>

            <motion.div className="form-group" whileHover={{ scale: 1.01 }}>
              <label htmlFor="mobile">Mobile Number</label>
              <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+91-1234567890" required />
            </motion.div>

            <motion.div className="form-group" whileHover={{ scale: 1.01 }}>
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </motion.div>

            <div className="dob-time">
              <motion.div className="form-group" whileHover={{ scale: 1.01 }}>
                <label htmlFor="dob">Date of Birth</label>
                <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required />
              </motion.div>

              <motion.div className="form-group" whileHover={{ scale: 1.01 }}>
                <label htmlFor="tob">Time of Birth</label>
                <input type="time" id="tob" name="tob" value={formData.tob} onChange={handleChange} required />
              </motion.div>
            </div>

            <motion.div className="form-group" whileHover={{ scale: 1.01 }}>
              <label htmlFor="pob">Place of Birth</label>
              <input type="text" id="pob" name="pob" value={formData.pob} onChange={handleChange} placeholder="e.g., New Delhi, India" required />
            </motion.div>

            <motion.div className="form-group" whileHover={{ scale: 1.01 }}>
              <label htmlFor="query">Query</label>
              <textarea id="query" name="query" value={formData.query} onChange={handleChange} rows="4" placeholder="Tell us about your cosmic question..." required></textarea>
            </motion.div>

            <div className="form-card-footer">
              <motion.button
                type="submit"
                className="connect-button submit-query-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FiLoader className="loader-icon" /> Submitting...
                  </>
                ) : (
                  "Submit Query"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </section>

      <ServicesSection />
      <ConsultationTopics />
      <NakshatrasSection />
      <DailyInsights />
      <Testimonials />
      <BlogSection />
      <Footer />

      {/* <motion.div
        className="whatsapp-icon"
        onClick={handleWhatsAppClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaWhatsapp />
      </motion.div> */}
    </div>
  );
};

export default LandingPage;
