import React, { useState, useEffect } from "react";
import Container from "../../components/Container/Container";
import { Meta } from "../../App";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import Wrapper from "../../components/Wrapper/Wrapper";
import Form from "../../components/Form/Form";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import { messages } from "../../messages";
import { toast } from "react-toastify";
import Button from "../../components/Button/Button";
import { api } from "../../hooks/useApi";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

const ResetPassword = () => {
  const [submitting, setSubmitting] = useState(false);
  const [hashValid, setHashValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const { hash } = useParams();

  const checkToken = async (hash) => {
    try {
      setLoading(true);
      await api.checkPasswordResetHash(hash);
      setHashValid(true);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkToken(hash);
  }, []);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await api.resetPassword(hash, data);
      toast.success(`Password updated!`);
      history.push("/login");
    } catch (error) {
      toast.error(error.response.data.message);
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
          <Label>Password</Label>
          <Input
            type="password"
            validate={{ required: messages.required }}
            name="password"
          />

          <Button
            type="submit"
            primary="true"
            disabled={!hashValid || submitting}
            loading={loading}
          >
            Update password
          </Button>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default ResetPassword;
