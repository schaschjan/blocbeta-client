import React from "react";
import HyperLink from "../HyperLink/HyperLink";
import "./Footer.css";

export const Footer = () => {
  return (
    <div className="footer">
      {/*<li>*/}
      {/*  <HyperLink href="https://github.com/blocbeta/blocbeta-client/issues/new?template=Feature_request.md">*/}
      {/*    Request Feature*/}
      {/*  </HyperLink>*/}
      {/*</li>*/}
      {/*<li>*/}
      {/*  <HyperLink href="https://blocbeta.com">About</HyperLink>*/}
      {/*</li>*/}
      {/*<li>*/}
      {/*  <HyperLink href={"github"}>Support the platform</HyperLink>*/}
      {/*</li>*/}

      <HyperLink href="mailto:support@blocbeta.com" className="footer__item">
        Support
      </HyperLink>

      <HyperLink href="https://github.com/blocbeta" className="footer__item">
        Github
      </HyperLink>
    </div>
  );
};
