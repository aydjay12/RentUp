import React from "react";
import "./verified.scss";
import Logo from "../../pics/logo.png";
import tick from "../../../../public/svg/tick.svg";
import { useNavigate } from "react-router-dom";

const Verified = () => {
  const navigate = useNavigate();

  return (
    <div className="verifiedPage">
      <div className="logo">
        <img src={Logo} alt="" />
      </div>
      <div className="message">
        <img className="tick" src={tick} alt="" />
        <h1>Email Verification</h1>
        <p>Hi Dear User, You Have Successfully Verified Your Email.</p>
        <button onClick={() => navigate("/new-password")} className="doneButton">
          Done
        </button>
      </div>
    </div>
  );
};

export default Verified;
