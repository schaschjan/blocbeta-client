import React, { useState } from "react";
import Container from "../../components/Container/Container";
import { Meta } from "../../App";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import Wrapper from "../../components/Wrapper/Wrapper";
import {Form} from "../../components/Form/Form";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import { messages } from "../../messages";
import { toast } from "react-toastify";
import Button from "../../components/Button/Button";
import { api } from "../../hooks/useApi";

const RequestPasswordReset = () => {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await api.requestPasswordReset(data);
      toast.success(`Password reset mail sent!`);
    } catch (error) {
      toast.error(error.response.data.form.username);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Meta title="Reset password" />
      <PageHeader title="Reset password" />

      <Wrapper>
        <Form onSubmit={onSubmit} className={"login-form"}>
          <Label>Username</Label>
          <Input
            type="text"
            validate={{ required: messages.required }}
            placeholder=""
            name="username"
          />

          <Button type="submit" primary="true" disabled={submitting}>
            Send reset link
          </Button>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default RequestPasswordReset;
