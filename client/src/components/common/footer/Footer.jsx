import React from "react";
import { footer } from "../../data/Data";
import Logo from "../../images/logo-light.png";
import "./footer.css";

const Footer = () => {
  return (
    <>
      <section className="footerContact">
        <div className="container">
          <div className="send flex">
            <div className="text">
              <h1>Do You Have Questions ?</h1>
              <p>We'll help you to grow your career and growth.</p>
            </div>
            <a href="mailto:aydjay12@gmail.com">
            <button className="btn5">Contact Us Today</button>
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="box">
            <div className="logo log">
              <img src={Logo} alt="" />
              <h2>Do You Need Help With Anything?</h2>
              <p>
                Receive updates, hot deals, tutorials, discounts sent straignt
                in your inbox every month
              </p>

              <div className="input flex">
                <input type="text" placeholder="Email Address" />
                <a href="mailto:aydjay12@gmail.com">
                  <button>Subscribe</button>
                </a>
              </div>
            </div>
          </div>

          {footer.map((val) => (
            <div className="box box2">
              <h3>{val.title}</h3>
              <ul>
                {val.text.map((items) => (
                  <li> {items.list} </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
      <div className="legal">
        <span>© 2023 RentUP. Designed By GorkCoder.</span>
      </div>
    </>
  );
};

export default Footer;
