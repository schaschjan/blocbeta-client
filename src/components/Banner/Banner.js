import React from "react";
import "./Banner.css";

const Banner = ({ children }) => {
  return (
    <marquee className="banner">
      <span className="message">{children}</span>
    </marquee>
  );
};

export default Banner;
