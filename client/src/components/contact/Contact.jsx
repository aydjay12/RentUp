import React from "react";
import img from "../images/pricing.jpg";
import Back from "../common/Back";
import "./contact.css";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh

    // Get input values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Format the mailto link
    const mailtoLink = `mailto:aydjay12@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )}`;

    // Open email client
    window.location.href = mailtoLink;
  };

  return (
    <div>
      <section className="contact mb">
        <Back name="Contact Us" title="Get Help & Friendly Support" cover={img} />
        <div className="container">
          <form className="shadow" onSubmit={handleSubmit}>
            <h4>Fill up The Form</h4> <br />
            <div>
              <input type="text" id="name" placeholder="Name" required />
              <input type="email" id="email" placeholder="Email" required />
            </div>
            <input type="text" id="subject" placeholder="Subject" required />
            <textarea id="message" cols="30" rows="10" placeholder="Your message" required></textarea>
            <button type="submit">Submit Request</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
