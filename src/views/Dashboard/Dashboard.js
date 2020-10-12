import React, {Fragment, useContext, useEffect} from "react";
import {Meta} from "../../App";
import {useApiV2} from "../../hooks/useApi";
import "./Dashboard.css";
import {BlocBetaUIContext} from "../../components/BlocBetaUI";
import {Link} from "react-router-dom";

const Dashboard = () => {
  const {user, isAdmin, contextualizedPath} = useContext(BlocBetaUIContext);

  const ping = useApiV2("ping");

  useEffect(() => {
    ping()
  }, []);

  return (
    <Fragment>
      <Meta title="Dashboard"/>

      <div className="dashboard-section">
        <h2 className="t--beta dashboard-section__title">
          Hello {user.username}!
        </h2>

        <ul className="dashboard-links">
          <li className="dashboard-links__item">
            <Link to={contextualizedPath("/schedule")} className="t--gamma">
              Book a timeslot
            </Link>
          </li>
        </ul>
      </div>

      {isAdmin && (
        <Fragment>
          <div className="dashboard-section">
            <h3 className="t--beta dashboard-section__title">Schedule</h3>

            <ul className="dashboard-links">
              <li className="dashboard-links__item">
                <Link to={contextualizedPath("/admin/schedule-ticker")} className="t--gamma">
                  Live Ticker
                </Link>
              </li>
            </ul>

          </div>

          <div className="dashboard-section">
            <h3 className="t--beta dashboard-section__title">Schedule Overrides</h3>

            <ul className="dashboard-links">
              <li className="dashboard-links__item">
                <Link to={contextualizedPath("/admin/time-slot-blocker")} className="t--gamma">
                  List
                </Link>
              </li>

              <li className="dashboard-links__item">
                <Link to={contextualizedPath("/admin/time-slot-blocker/add")} className="t--gamma">
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
                <Link to={contextualizedPath("/admin/rooms/add")} className="t--gamma">
                  Add
                </Link>
              </li>
            </ul>

          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Dashboard;
