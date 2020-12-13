import React from "react";
import "./Footer.css";

export const Footer = () => {
  return (
    <div className="footer">
      <a href="mailto:support@blocbeta.com" className="footer__item">
        Support
      </a>

      <a href="https://github.com/blocbeta" className="footer__item">
        Github
      </a>
    </div>
  );
};
