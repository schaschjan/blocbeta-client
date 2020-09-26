import React, {useEffect, useState, useContext, Fragment} from "react";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import useForm, {composeFormElement} from "../../hooks/useForm";
import {AppContext, Meta} from "../../App";
import axios from "axios";
import {FormRow} from "../../components/Form/Form";
import useQueryParameters from "../../hooks/useQueryParameters";
import "./Login.css";

const Login = () => {
  const {setAppClassName} = useContext(AppContext);

  const {handleSubmit, formData, observeField} = useForm({
    username: null,
    password: null
  });

  const [submitting, setSubmitting] = useState(false);
  const {setUser, setCurrentLocation, setExpiration} = useContext(AppContext);

  const queryParameters = useQueryParameters();
  let target = queryParameters.get("target");

  const getScheduleUrl = (location) => {
    return `https://schedule.blocbeta.com/${location}.url/schedule`
  };

  const onSubmit = async (payload) => {
    setSubmitting(true);

    try {
      const {data} = await axios.post(`/api/login`, payload, {params: target});

      setExpiration(data.expiration);
      setUser(data.user);
      setCurrentLocation(data.location);

      if (queryParameters.get("target") === "schedule") {
        window.location.href = getScheduleUrl(data.location);
      } else {
        window.location.href = "/salon/dashboard"
      }

    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setAppClassName("login");
  }, []);

  return (
    <Fragment>
      <Meta title="Log in"/>

      <div className="login-layout">
        <div className="login-layout__intro login-layout-intro">
          <h1 className="t--alpha login-layout-intro__text">Please sign in to book a training slot:</h1>
        </div>

        <form onSubmit={(event) => handleSubmit(event, onSubmit)} className="login-layout__form">
          <FormRow>
            {composeFormElement(
              "username",
              "Username",
              formData.username,
              Input,
              observeField,
              {
                type: "text",
                required: true
              }
            )}
          </FormRow>

          <FormRow>
            {composeFormElement(
              "password",
              "Password",
              formData.password,
              Input,
              observeField,
              {
                type: "password",
                required: true
              }
            )}
          </FormRow>

          <Button type="submit" disabled={submitting}>
            Login
          </Button>
        </form>
      </div>
    </Fragment>
  );
};

export default Login;
