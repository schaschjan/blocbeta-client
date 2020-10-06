import React, {Fragment, useContext, useEffect} from "react";
import {Meta} from "../../App";
import {useApiV2} from "../../hooks/useApi";
import "./Dashboard.css";
import {BlocBetaUIContext} from "../../components/BlocBetaUI";
import {Link} from "react-router-dom";
import {Forward} from "../../index";

const Dashboard = () => {
  const {user, isAdmin, contextualizedPath} = useContext(BlocBetaUIContext);

  const ping = useApiV2("ping");

  useEffect(() => {
    ping()
  }, []);

  return (
    <Fragment>
      <Meta title="Dashboard"/>

      <h1 className="t--alpha page-title">
        Hello {user.username}!
      </h1>

      <ul className="dashboard-links">
        <li className="dashboard-links__item">
          <Link to={contextualizedPath("/schedule")} className="t--beta">
            Book a timeslot <Forward/>
          </Link>
        </li>

        {isAdmin && (
          <li className="dashboard-links__item">
            <Link to={contextualizedPath("/schedule-overview")} className="t--beta">
              Schedule Admin <Forward/>
            </Link>
          </li>
        )}
      </ul>


    </Fragment>
  );
};

export default Dashboard;
