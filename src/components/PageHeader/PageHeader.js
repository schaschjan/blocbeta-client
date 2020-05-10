import React from "react";
import "./PageHeader.css";

export const PageHeader = ({ title, children }) => {
  return (
    <div className="page-header">
      <h1>{title}</h1>
      <div>{children}</div>
    </div>
  );
};
