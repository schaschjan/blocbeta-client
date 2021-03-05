import React, { Fragment, useContext } from "react";
import "./Current.css";
import { useParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useQuery } from "react-query";
import { AppContext, Meta } from "../../App";
import { LoadedContent } from "../../components/Loader/Loader";
import useSWR from "swr";

const Current = () => {
  const { a, b } = useParams();
  const { user } = useContext(AppContext);

  const { data, error } = useSWR();

  const { status: currentStatus, data: currentData } = useQuery(
    "compareCurrent",
    useApi("compareCurrent", { a, b })
  );

  return (
    <Fragment>
      <Meta title="Current Ranking" />
      <h1 className="t--alpha page-title">Current Ranking</h1>

      <LoadedContent loading={[currentStatus].includes("loading")}>
        Todo
      </LoadedContent>
    </Fragment>
  );
};

export { Current };
