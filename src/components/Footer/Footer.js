import React from "react";
import { version } from "./../../../package.json";
import "./Footer.css";

export const Footer = () => {
  return (
    <div className="footer">
      <a href="mailto:support@boulderdb.de" className="footer__item">
        Support
      </a>

      <a href="https://github.com/boulderdb" className="footer__item">
        Github
      </a>

      <span className={"footer__item"}>v{version}</span>
    </div>
  );
};
