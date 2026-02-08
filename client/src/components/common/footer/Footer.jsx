import React, { useState } from "react";
import { footer } from "../../data/Data";
import Logo from "../../images/logo-light.png";
import "./footer.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      window.location.href = `mailto:aydjay12@gmail.com?subject=Newsletter Subscription&body=Subscribe me: ${email}`;
    }
  };

  return (
    <>
      <motion.section
        className="footerContact"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <div className="send">
            <div className="text">
              <h1>Do You Have Questions?</h1>
              <p>We'll help you to find your perfect home and grow your future.</p>
            </div>
            <motion.button
              className="contact-button"
              onClick={() => navigate("/contact")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us Today
            </motion.button>
          </div>
        </div>
      </motion.section>

      <footer className="footer-main">
        <div className="container footer-grid">
          {/* Section 1: About */}
          <motion.div
            className="footer-section about"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="footer-logo">
              <img src={Logo} alt="RentUp" />
            </div>
            <p>
              Find and list your dream properties with ease. We provide the most reliable real estate platform for buyers, sellers, and renters.
            </p>
            <div className="footer-socials">
              <a href="mailto:aydjay12@gmail.com">
                <Facebook size={20} className="social-icon" />
              </a>
              <a href="mailto:aydjay12@gmail.com">
                <Twitter size={20} className="social-icon" />
              </a>
              <a href="mailto:aydjay12@gmail.com">
                <Instagram size={20} className="social-icon" />
              </a>
              <a href="mailto:aydjay12@gmail.com">
                <Linkedin size={20} className="social-icon" />
              </a>
            </div>
            <div className="footer-contact-info">
              <div className="contact-item">
                <Phone size={18} className="contact-icon" />
                <span>+1 234 567 890</span>
              </div>
              <div className="contact-item">
                <Mail size={18} className="contact-icon" />
                <span>info@rentup.com</span>
              </div>
              <div className="contact-item">
                <MapPin size={18} className="contact-icon" />
                <span>123 Real Estate St, City, Country</span>
              </div>
            </div>
          </motion.div>

          {/* Section 2 & 3: Links */}
          {footer.map((val, index) => (
            <motion.div
              key={index}
              className="footer-section links"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              viewport={{ once: true }}
            >
              <h3>{val.title}</h3>
              <ul>
                {val.links.map((link, idx) => (
                  <li key={idx} onClick={() => navigate(link.path)}>
                    {link.name}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Section 4: Stay Updated */}
          <motion.div
            className="footer-section subscribe"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3>STAY UPDATED</h3>
            <p>Subscribe to our newsletter for the latest property deals and updates.</p>
            <form className="footer-subscribe-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <p>© {new Date().getFullYear()} RentUP. All rights reserved. Designed By Xel.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
