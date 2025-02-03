import React from "react";
import Heading from "../../common/Heading";
import { team } from "../../data/Data";
import "./team.css";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const Team = () => {
  return (
    <>
      <section className="team">
        <div className="container">
          <Heading
            title="Our Featured Agents"
            subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
          />

          <div className="content mtop grid3">
            {team.map((val, index) => (
              <div className="box" key={index}>
                <button className="btn3">{val.list} Listings</button>
                <div className="details">
                  <div className="img">
                    <img src={val.cover} alt="" />
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <i className="fa fa-location-dot"></i>
                  <label>{val.address}</label>
                  <h4>{val.name}</h4>

                  <ul>
                    {val.icon.map((icon, index) => (
                      <a href="mailto:aydjay12@gmail.com">
                        <li key={index}>{icon}</li>
                      </a>
                    ))}
                  </ul>
                  <div className="pad flex">
                    <a href="mailto:aydjay12@gmail.com">
                      <button className="message">
                        <FaEnvelope /> Message
                      </button>
                    </a>
                    <a href="mailto:aydjay12@gmail.com">
                      <button className="call">
                        <FaPhoneAlt />
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Team;
