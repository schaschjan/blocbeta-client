import React, {Fragment, useContext, useEffect} from "react";
import {useQuery} from "react-query";
import "./Dashboard.css";
import {PageHeader} from "../../components/PageHeader/PageHeader";
import {AppContext, locationPath, Meta} from "../../App";
import {Link} from "react-router-dom";
import axios from "axios";
import {useApiV2} from "../../hooks/useApi";

const Dashboard = () => {
  const {user} = useContext(AppContext);

  const {status: boulderStatus, data: boulderStatistic} = useQuery("boulderStatistics", useApiV2("boulderStatistics"));

  const ping = useApiV2("ping");

  useEffect(() => {
    ping()
  }, []);

  return (
    <Fragment>
      <Meta title="Dashboard"/>
      <PageHeader title={`Hello ${user.username}!`}/>

      <Link to={{
        pathname: locationPath("/boulder"),
        search: "?ascent=todo"
      }}>

        All {(boulderStatus === "success") && (boulderStatistic.activeBoulders)} boulders
      </Link>
    </Fragment>
  );

};

export default Dashboard;
