import React from "react";
import { footer } from "../../data/Data";
import Logo from "../../images/logo-light.png";
import "./footer.css";
import { motion } from "framer-motion";

const Footer = () => {
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
          <div className="send flex">
            <div className="text">
              <h1>Do You Have Questions?</h1>
              <p>We'll help you to grow your career and growth.</p>
            </div>
            <motion.a 
              href="mailto:aydjay12@gmail.com"
              whileHover={{ scale: 1.1 }}
            >
              <button className="btn5">Contact Us Today</button>
            </motion.a>
          </div>
        </div>
      </motion.section>

      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <div className="box">
            <div className="logo log">
              <img src={Logo} alt="" />
              <h2>Do You Need Help With Anything?</h2>
              <p>
                Receive updates, hot deals, tutorials, discounts sent straight
                in your inbox every month.
              </p>

              <div className="input flex">
                <input type="text" placeholder="Email Address" />
                <motion.a href="mailto:aydjay12@gmail.com" whileHover={{ scale: 1.1 }}>
                  <button>Subscribe</button>
                </motion.a>
              </div>
            </div>
          </div>

          {footer.map((val, index) => (
            <motion.div
              key={index}
              className="box box2"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3>{val.title}</h3>
              <ul>
                {val.text.map((items, idx) => (
                  <motion.li 
                    key={idx} 
                    whileHover={{ scale: 1.05 }}
                  >
                    {items.list}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.footer>

      <motion.div 
        className="legal"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <span>© 2023 RentUP. Designed By GorkCoder.</span>
      </motion.div>
    </>
  );
};

export default Footer;
