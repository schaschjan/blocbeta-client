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
        <div className="dashboard-section">
          <h2 className="t--beta dashboard-section__title">Admin</h2>

          <ul className="dashboard-links dashboard-links--admin">
            <li className="dashboard-links__item">
              <Link to={contextualizedPath("/admin/schedule-ticker")} className="t--gamma">
                Schedule Ticker
              </Link>
            </li>

            <li className="dashboard-links__item">
              <Link to={contextualizedPath("/admin/time-slot-blocker/add")} className="t--gamma">
                Block a time slot
              </Link>
            </li>

            <li className="dashboard-links__item">
              <Link to={contextualizedPath("/admin/time-slot-blocker")} className="t--gamma">
                List currently blocked time slots
              </Link>
            </li>
          </ul>
        </div>
      )}
    </Fragment>
  );
};

export default Dashboard;
