import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import img from "../images/pricing.jpg";
import Back from "../common/Back";
import "./contact.css";
import { submitContactForm } from "../utils/api"; // Import the API function

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    // Validate form fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("All fields are required");
      return;
    }

    try {
      // Send form data to the backend
      await submitContactForm(formData);
      toast.success("Form submitted successfully!");

      // Clear the form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <section className="contact mb">
        <Back name="Contact Us" title="Get Help & Friendly Support" cover={img} />
        <div className="container">
          <motion.form
            className="shadow"
            onSubmit={handleSubmit}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h4>Fill up The Form</h4> <br />
            <div>
              <input
                type="text"
                id="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="text"
              id="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              id="message"
              cols="30"
              rows="10"
              placeholder="Your message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Request
            </motion.button>
          </motion.form>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;