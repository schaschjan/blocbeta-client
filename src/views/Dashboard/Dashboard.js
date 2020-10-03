import React, {Fragment, useContext, useEffect} from "react";
import {useQuery} from "react-query";
import "./Dashboard.css";
import {PageHeader} from "../../components/PageHeader/PageHeader";
import {Meta} from "../../App";
import {useApiV2} from "../../hooks/useApi";
import {BlocBetaUIContext} from "@blocbeta/ui-core";

const Dashboard = () => {
  const {user} = useContext(BlocBetaUIContext);

  const {status: boulderStatus, data: boulderStatistic} = useQuery("boulderStatistics", useApiV2("boulderStatistics"));

  const ping = useApiV2("ping");

  useEffect(() => {
    ping()
  }, []);

  return (
    <Fragment>
      <Meta title="Dashboard"/>
      <PageHeader title={`Hello ${user.username}!`}/>
    </Fragment>
  );

};

export default Dashboard;
