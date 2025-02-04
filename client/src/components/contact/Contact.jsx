import React from "react";
import { motion } from "framer-motion";
import img from "../images/pricing.jpg";
import Back from "../common/Back";
import "./contact.css";
import { useMutation } from "react-query";
import { submitContactForm } from "../utils/api";
import { toast } from "react-toastify";
import UserDetailContext from "../context/UserDetailContext";
import { useContext } from "react";

const Contact = () => {
  const { userDetails } = useContext(UserDetailContext);
  const { token } = userDetails;

  const { mutate, isLoading } = useMutation({
    mutationFn: (formData) => submitContactForm(formData, token),
    onSuccess: () => {
      toast.success("Contact form submitted successfully");
    },
    onError: (error) => {
      toast.error("Failed to submit contact form");
      console.error("Error submitting contact form:", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh

    // Get input values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Create form data object
    const formData = {
      name,
      email,
      subject,
      message,
    };

    // Submit form data
    mutate(formData);
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
              <input type="text" id="name" placeholder="Name" required />
              <input type="email" id="email" placeholder="Email" required />
            </div>
            <input type="text" id="subject" placeholder="Subject" required />
            <textarea id="message" cols="30" rows="10" placeholder="Your message" required></textarea>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Request"}
            </motion.button>
          </motion.form>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;