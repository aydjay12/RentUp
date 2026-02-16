import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import img from "../images/pricing.jpg";
import Back from "../common/Back";
import "./contact.css";
import { useContactStore } from "../../store/useContactStore";
import useSnackbarStore from "../../store/useSnackbarStore";
import { Loader, Phone, Mail, MapPin, Send } from "lucide-react";

const Contact = () => {
  const { submitContactForm, mutationLoading: loading } = useContactStore();
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (showErrors) validate();
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message too short";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowErrors(true);

    if (validate()) {
      try {
        await submitContactForm(formData);
        showSnackbar("Message sent successfully!", "success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setErrors({});
        setShowErrors(false);
      } catch (error) {
        showSnackbar("Failed to send message.", "error");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="contact-page"
    >
      <Back
        name="Contact Us"
        title="Get Help & Friendly Support"
        cover={img}
      />

      <section className="contact-main section">
        <div className="container flex-between">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="info-header">
              <h2>Contact Information</h2>
              <p>Have questions? We're here to help you find your dream home.</p>
            </div>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon-box">
                  <Phone size={24} />
                </div>
                <div className="info-details">
                  <h3>Call Us</h3>
                  <p>+1 (234) 567 890</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon-box">
                  <Mail size={24} />
                </div>
                <div className="info-details">
                  <h3>Email Us</h3>
                  <p>support@rentup.com</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon-box">
                  <MapPin size={24} />
                </div>
                <div className="info-details">
                  <h3>Our Office</h3>
                  <p>123 Real Estate St, City, Country</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="contact-form-container"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form className="contact-form shadow" onSubmit={handleSubmit} noValidate>
              <h3>Send us a Message</h3>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className={showErrors && errors.name ? "input-error" : ""}
                  />
                  {showErrors && errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={showErrors && errors.email ? "input-error" : ""}
                  />
                  {showErrors && errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                  className={showErrors && errors.subject ? "input-error" : ""}
                />
                {showErrors && errors.subject && <span className="error-text">{errors.subject}</span>}
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  id="message"
                  rows="6"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  className={showErrors && errors.message ? "input-error" : ""}
                ></textarea>
                {showErrors && errors.message && <span className="error-text">{errors.message}</span>}
              </div>

              <motion.button
                type="submit"
                className="submit-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Submit Request</span>
                    <Send size={18} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;
