import React from "react";
import Awards from "./awards/Awards";
import Featured from "./featured/Featured";
import Hero from "./hero/Hero";
import Location from "./location/Location";
import Price from "./price/Price";
import Recent from "./recent/Recent";
import Team from "./team/Team";

const Home = ({card}) => {
  return (
    <div
    >
      <Hero />
      <Featured />
      <Recent />
      <Awards />
      <Location />
      <Team />
    </div>
  );
};

export default Home;
