import React, { Fragment, useContext } from "react";
import { Meta } from "../../App";
import "./Index.css";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import { Link } from "react-router-dom";
import { AccessDenied } from "../../components/AccessDenied/AccessDenied";
import { Button } from "../../components/Button/Button";

const Index = () => {
  const { contextualizedPath, isAdmin } = useContext(BoulderDBUIContext);

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <Fragment>
      <Meta title="Admin" />

      <div className="dashboard-section">
        <h3 className="t--beta dashboard-section__title">Boulder</h3>

        <ul className="dashboard-links">
          <li className="dashboard-links__item">
            <Button
              size={"small"}
              variant={"primary"}
              asLink={true}
              to={contextualizedPath("/admin/boulder/add")}
            >
              Add
            </Button>
          </li>
        </ul>
      </div>

      <div className="dashboard-section">
        <h3 className="t--beta dashboard-section__title">Setters</h3>

        <ul className="dashboard-links">
          <li className="dashboard-links__item">
            <Button
              size={"small"}
              variant={"primary"}
              asLink={true}
              to={contextualizedPath("/admin/setters/add")}
            >
              Add
            </Button>
          </li>

          <li className="dashboard-links__item">
            <Button
              size={"small"}
              variant={"primary"}
              asLink={true}
              to={contextualizedPath("/admin/setters")}
            >
              List
            </Button>
          </li>
        </ul>
      </div>
    </Fragment>
  );
};

export { Index };
