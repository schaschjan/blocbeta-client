import React, {Fragment, useContext} from "react";
import {useQuery} from "react-query";
import "./Dashboard.css";
import {PageHeader} from "../../components/PageHeader/PageHeader";
import {AppContext, Meta} from "../../App";
import {Link} from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const {user, contextualizedPath} = useContext(AppContext);

  const {status: boulderStatus, data: boulderStatistic} = useQuery("stat-boulders", async () => {
    const {data} = await axios.get(`/api${contextualizedPath("/statistic/boulder")}`);

    return data;
  });

  return (
    <Fragment>
      <Meta title="Dashboard"/>
      <PageHeader title={`Hello ${user.username}!`}/>

      <Link to={{
        pathname: contextualizedPath("/boulder"),
        search: "?ascent=todo"
      }}>

        All boulders {(boulderStatus === "success") && (boulderStatistic.activeBoulders)}
      </Link>
    </Fragment>
  );

};

export default Dashboard;
