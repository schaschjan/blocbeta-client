import React, { useState, useContext, Fragment } from "react";
import { Loader } from "../../../components/Loader/Loader";
import { useParams } from "react-router-dom";
import Container from "../../../components/Container/Container";
import { PageHeader } from "../../../components/PageHeader/PageHeader";
import { api, cacheKeys } from "../../../hooks/useApi";
import Wrapper from "../../../components/Wrapper/Wrapper";
import { toast } from "react-toastify";
import { queryCache, useMutation } from "react-query";
import { AppContext, Meta } from "../../../App";
import useBoulderFormData from "../../../hooks/useBoulderFormData";
import { useHistory } from "react-router-dom";
import BoulderForm from "../../../forms/Boulder/BoulderForm";
import { resolveApiData } from "../../../components/Form/Form";

const Edit = () => {
  const { boulderId } = useParams();
  const { locationPath } = useContext(AppContext);

  const [submitting, setSubmitting] = useState(false);
  let history = useHistory();

  const { status, boulder } = useBoulderFormData(boulderId);

  const [mutateOnUpdateBoulder] = useMutation(api.boulder.update, {
    throwOnError: true,
    onSuccess: () => {
      queryCache.refetchQueries(cacheKeys.boulders);
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      resolveApiData(data);
      await mutateOnUpdateBoulder({
        id: boulderId,
        data: data,
      });

      toast.success(`Updated boulder ${data.name}`);
      history.push(locationPath("/boulder"));
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (status !== "resolved") return <Loader />;

  return (
    <Fragment>
      <Meta title={`Edit ${boulder.name}`} />

      <Container>
        <PageHeader title={`Edit ${boulder.name}`} />
        <Wrapper>
          <BoulderForm
            defaultValues={boulder}
            submitting={submitting}
            onSubmit={onSubmit}
            submitLabel={"Update"}
          />
        </Wrapper>
      </Container>
    </Fragment>
  );
};

export default Edit;
