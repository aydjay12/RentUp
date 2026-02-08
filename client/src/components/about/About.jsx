import React from "react";
import Back from "../common/Back";
import Heading from "../common/Heading";
import img from "../images/about.jpg";
import { motion } from "framer-motion";
import "./about.css";
import { Users, Home, Globe, Award } from "lucide-react";

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="about-page"
    >
      <Back name="Our Story" title="Who We Are & Our Mission" cover={img} />

      <section className="about-main section">
        <div className="container flex-between">
          <motion.div
            className="about-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Heading
              title="Our Agency Story"
              subtitle="Building Dreams, One Home at a Time"
            />
            <p className="about-desc">
              Founded with a vision to revolutionize the real estate industry, RentUp has grown from a local agency into a trusted partner for thousands of homeowners and seekers. We believe that finding a home is more than just a transaction; it's about finding where you belong.
            </p>
            <p className="about-desc">
              Our team of dedicated professionals combines deep market expertise with a personal touch, ensuring that every client receives a tailored experience that exceeds expectations.
            </p>
          </motion.div>

          <motion.div
            className="about-right"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="about-image-container">
              <img src={img} alt="About RentUp" className="main-about-img" />
              <div className="experience-badge">
                <h3>10+</h3>
                <p>Years of Experience</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="about-stats">
          <div className="stat-item">
            <Home className="stat-icon" />
            <div className="stat-text">
              <h3>12K+</h3>
              <span>Properties</span>
            </div>
          </div>
          <div className="stat-item">
            <Users className="stat-icon" />
            <div className="stat-text">
              <h3>8K+</h3>
              <span>Happy Clients</span>
            </div>
          </div>
          <div className="stat-item">
            <Globe className="stat-icon" />
            <div className="stat-text">
              <h3>50+</h3>
              <span>Cities</span>
            </div>
          </div>
          <div className="stat-item">
            <Award className="stat-icon" />
            <div className="stat-text">
              <h3>15+</h3>
              <span>Awards</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-vision section bg-section">
        <div className="container">
          <div className="grid-3">
            <motion.div
              className="mv-card card"
              whileHover={{ y: -10 }}
            >
              <div className="mv-icon-box">
                <Users size={32} color="var(--accent)" />
              </div>
              <h3>Our Mission</h3>
              <p>To provide transparent, efficient, and personalized real estate services that empower people to build wealth and find their perfect sanctuary.</p>
            </motion.div>

            <motion.div
              className="mv-card card"
              whileHover={{ y: -10 }}
            >
              <div className="mv-icon-box">
                <Globe size={32} color="var(--accent)" />
              </div>
              <h3>Our Vision</h3>
              <p>To become the world's most trusted real estate platform, known for innovation, integrity, and our commitment to community well-being.</p>
            </motion.div>

            <motion.div
              className="mv-card card"
              whileHover={{ y: -10 }}
            >
              <div className="mv-icon-box">
                <Award size={32} color="var(--accent)" />
              </div>
              <h3>Our Values</h3>
              <p>Integrity first, absolute transparency, customer obsession, and constant innovation in everything we do for our valued clients.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
