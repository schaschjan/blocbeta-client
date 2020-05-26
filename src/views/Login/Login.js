import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Form from "../../components/Form/Form";
import Container from "../../components/Container/Container";
import Label from "../../components/Label/Label";
import { Link } from "react-router-dom";
import "./Login.css";
import { toast } from "react-toastify";
import { AppContext } from "../../App";
import jwt_decode from "jwt-decode";
import { getUri } from "../../hooks/useApi";
import axios from "axios";
import { useIsFetching } from "react-query";
import { Loader } from "../../components/Loader/Loader";
import Wrapper from "../../components/Wrapper/Wrapper";
import {messages} from "../../messages";

const Login = () => {
  const [submitting, setSubmitting] = useState(false);
  const { setUser, setToken, setCurrentLocation, setExpiration } = useContext(
    AppContext
  );

  const history = useHistory();
  const isFetching = useIsFetching();

  const getToken = async (username, password) => {
    try {
      const { data } = await axios.post(getUri("/login"), {
        username: username,
        password: password,
      });

      return { token: data.token, success: true };
    } catch (error) {
      return { error: error, success: false };
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    const { token, error, success } = await getToken(
      data.username,
      data.password
    );

    if (!success) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      setSubmitting(false);

      return;
    }

    const payload = jwt_decode(token);
    console.log(payload);

    setExpiration(payload.exp);
    setUser({
      id: payload.id,
      username: payload.username,
    });

    setCurrentLocation(payload.location);
    setToken(token);

    setSubmitting(false);

    history.push(`/${payload.location.url}/dashboard`);
  };

  return (
    <Container>
      {isFetching ? <Loader /> : null}
      <Wrapper>
        <h1>Sign in</h1>

        <Form onSubmit={onSubmit}>
          <Label>Username</Label>
          <Input
            type="text"
            validate={{required: messages.required}}
            placeholder="…"
            name="username"
          />

          <Label>Password</Label>
          <Input
            type="password"
            validate={{required: messages.required}}
            placeholder="…"
            name="password"
          />

          <Button type="submit" primary="true" disabled={submitting}>
            Login
          </Button>
        </Form>

        <div className="support-links">
          <Link to="/register">Create Account</Link>
          <Link to="/reset-password" className="secondary">
            Forgot Password
          </Link>
        </div>
      </Wrapper>
    </Container>
  );
};

export default Login;
