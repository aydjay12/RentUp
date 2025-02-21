import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import img from "../images/pricing.jpg";
import Back from "../common/Back";
import "./contact.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContactStore } from "../../store/useContactStore";
import { Loader } from "lucide-react";

const Contact = () => {
  const { submitContactForm, loading } = useContactStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [showMsg, setShowMsg] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Validation function
  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      subject: "",
      message: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  useEffect(() => {
    validate();
  }, [formData]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowMsg(true);

    if (validate()) {
      try {
        await submitContactForm(formData);

        // Reset form fields and errors
        setFormData({ name: "", email: "", subject: "", message: "" });
        setErrors({ name: "", email: "", subject: "", message: "" });
        setShowMsg(false); // Reset error display state

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {}
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <section className="contact mb">
        <Back
          name="Contact Us"
          title="Get Help & Friendly Support"
          cover={img}
        />
        <div className="container">
          <motion.form
            className="shadow"
            onSubmit={handleSubmit}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            noValidate
          >
            <h4>Fill up The Form</h4> <br />
            <div className="name-email">
              <div className="input-group">
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {showMsg && errors.name && (
                  <p className="error-message">{errors.name}</p>
                )}
              </div>
              <div className="input-group">
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {showMsg && errors.email && (
                  <p className="error-message">{errors.email}</p>
                )}
              </div>
            </div>
            <div className="input-group">
              <input
                type="text"
                id="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
              />
              {showMsg && errors.subject && (
                <p className="error-message">{errors.subject}</p>
              )}
            </div>
            <div className="input-group">
              <textarea
                id="message"
                cols="30"
                rows="10"
                placeholder="Your message"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
              {showMsg && errors.message && (
                <p className="error-message">{errors.message}</p>
              )}
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Submit Request"}
            </motion.button>
          </motion.form>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;
