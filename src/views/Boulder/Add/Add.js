import React, { useState } from "react";
import Container from "../../../components/Container/Container";
import { PageHeader } from "../../../components/PageHeader/PageHeader";
import { messages } from "../../../messages";
import { getOption } from "../../../helpers";
import { api, cacheKeys } from "../../../hooks/useApi";
import Wrapper from "../../../components/Wrapper/Wrapper";
import { store } from "../../../store";
import { queryCache, useMutation } from "react-query";
import { toast } from "react-toastify";
import { Meta } from "../../../App";
import BoulderForm from "../../../forms/Boulder/BoulderForm";
import { resolveApiData } from "../../../components/Form/Form";

const Add = () => {
  const initial = {
    grade: null,
    internalGrade: null,
    holdStyle: null,
    startWall: null,
    endWall: null,
    setters: null,
    tags: null,
    status: getOption(store.states.find((state) => state.id === "active")),
    points: 1000,
  };

  const [submitting, setSubmitting] = useState(false);
  const [formDefaults, setFormDefaults] = useState(initial);

  const [mutateOnAddBoulder] = useMutation(api.boulder.add, {
    onSuccess: () => {
      queryCache.refetchQueries(cacheKeys.boulders);
      queryCache.refetchQueries(cacheKeys.ascents);
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      resolveApiData(data);
      await mutateOnAddBoulder(data);

      toast.success(`Added boulder ${data.name}`);
      setFormDefaults({ ...initial });
    } catch (error) {
      toast.error(messages.errors.general);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Meta title={"Add Boulder"} />
      <PageHeader title={`Add Boulder`} />

      <Wrapper>
        <BoulderForm
          defaultValues={formDefaults}
          submitting={submitting}
          onSubmit={onSubmit}
          submitLabel={"Create & new"}
        />
      </Wrapper>
    </Container>
  );
};

export default Add;
