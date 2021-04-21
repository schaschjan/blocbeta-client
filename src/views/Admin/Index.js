import React, { Fragment, useContext } from "react";
import { Meta } from "../../App";
import "./Index.css";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import { Link } from "react-router-dom";
import { AccessDenied } from "../../components/AccessDenied/AccessDenied";

const Index = () => {
  const { contextualizedPath, isAdmin } = useContext(BoulderDBUIContext);

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <Fragment>
      <Meta title="Admin" />

      <div className="dashboard-section">
        <h3 className="t--beta dashboard-section__title">Setters</h3>

        <ul className="dashboard-links">
          <li className="dashboard-links__item">
            <Link
              to={contextualizedPath("/admin/setters")}
              className="t--gamma"
            >
              List
            </Link>
          </li>

          <li className="dashboard-links__item">
            <Link
              to={contextualizedPath("/admin/setters/add")}
              className="t--gamma"
            >
              Add
            </Link>
          </li>
        </ul>
      </div>

      <div className="dashboard-section">
        <h3 className="t--beta dashboard-section__title">Boulder</h3>

        <ul className="dashboard-links">
          <li className="dashboard-links__item">
            <Link
              to={contextualizedPath("/admin/boulder/add")}
              className="t--gamma"
            >
              Add
            </Link>
          </li>
        </ul>
      </div>
    </Fragment>
  );
};

export { Index };
