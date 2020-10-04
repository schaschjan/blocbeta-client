import React, {Fragment, useContext, useEffect} from "react";
import {PageHeader} from "../../components/PageHeader/PageHeader";
import {Meta} from "../../App";
import {useApiV2} from "../../hooks/useApi";
import {BlocBetaUIContext} from "@blocbeta/ui-core";
import "./Dashboard.css";

const Dashboard = () => {
  const {user} = useContext(BlocBetaUIContext);

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
