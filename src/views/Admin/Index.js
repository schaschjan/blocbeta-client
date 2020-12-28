import React, { Fragment, useContext, useEffect } from "react";
import { Meta } from "../../App";
import "./Index.css";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import { Link } from "react-router-dom";

const Index = () => {
  const { contextualizedPath } = useContext(BoulderDBUIContext);

  return (
    <Fragment>
      <Meta title="Admin" />

      <div className="dashboard-section">
        <h3 className="t--beta dashboard-section__title">Schedule</h3>

        <ul className="dashboard-links">
          <li className="dashboard-links__item">
            <Link
              to={contextualizedPath("/admin/schedule-ticker")}
              className="t--gamma"
            >
              Live Ticker
            </Link>
          </li>
        </ul>
      </div>

      <div className="dashboard-section">
        <h3 className="t--beta dashboard-section__title">Schedule Overrides</h3>

        <ul className="dashboard-links">
          <li className="dashboard-links__item">
            <Link
              to={contextualizedPath("/admin/time-slot-blocker")}
              className="t--gamma"
            >
              List
            </Link>
          </li>

          <li className="dashboard-links__item">
            <Link
              to={contextualizedPath("/admin/time-slot-blocker/add")}
              className="t--gamma"
            >
              Add
            </Link>
          </li>
        </ul>
      </div>

      <div className="dashboard-section">
        <h3 className="t--beta dashboard-section__title">Rooms</h3>

        <ul className="dashboard-links">
          <li className="dashboard-links__item">
            <Link to={contextualizedPath("/admin/rooms")} className="t--gamma">
              List
            </Link>
          </li>

          <li className="dashboard-links__item">
            <Link
              to={contextualizedPath("/admin/rooms/add")}
              className="t--gamma"
            >
              Add
            </Link>
          </li>
        </ul>
      </div>

      <div className="dashboard-section">
        <h3 className="t--beta dashboard-section__title">Guest Reservation</h3>

        <ul className="dashboard-links">
          <li className="dashboard-links__item">
            <Link
              to={contextualizedPath("/admin/reservations/add-guest")}
              className="t--gamma"
            >
              Add
            </Link>
          </li>
        </ul>
      </div>

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
