import React from "react";
import "./ResultList.css";

const ResultList = ({ children }) => {
  return <ul className="result-list">{children}</ul>;
};

const ResultListItem = ({ children }) => {
  return <li className="result-list__item">{children}</li>;
};

export { ResultList, ResultListItem };
