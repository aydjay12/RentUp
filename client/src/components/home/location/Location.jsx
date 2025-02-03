import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Heading from "../../common/Heading";
import { location } from "../../data/Data";
import "./style.css";

const Location = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleBoxClick = (city, country) => {
    // Navigate to the search page with city and country as query parameters
    navigate(`/search?location=${city}&country=${country}`);
  };

  return (
    <>
      <section className='location padding'>
        <div className='container'>
          <Heading title='Explore By Location' subtitle='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.' />

          <div className='content grid3 mtop'>
            {location.map((item, index) => (
              <div className='box' key={index} onClick={() => handleBoxClick(item.city, item.country)}>
                <img src={item.cover} alt='' />
                <div className='overlay'>
                  <h5>{item.city}, <span>{item.country}</span></h5>
                  {/* <p>
                    <label>{item.Villas}</label>
                    <label>{item.Offices}</label>
                    <label>{item.Apartments}</label>
                  </p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Location;