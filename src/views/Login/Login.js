import React, {useEffect, useState, useContext, Fragment} from "react";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import useForm, {composeFormElement} from "../../hooks/useForm";
import {AppContext, Meta} from "../../App";
import axios from "axios";
import {FormRow} from "../../components/Form/Form";
import useQueryParameters from "../../hooks/useQueryParameters";
import {useHistory} from "react-router-dom";
import {handleErrors} from "../../hooks/useApi";
import "./Login.css";

const Login = () => {
  const history = useHistory();

  const {handleSubmit, formData, submitting, observeField} = useForm({
    username: null,
    password: null
  });

  const {setUser, setCurrentLocation, setExpiration} = useContext(AppContext);

  const queryParameters = useQueryParameters();
  const target = queryParameters.get("target");

  const getScheduleUrl = (location) => {
    return `https://schedule.blocbeta.com/${location.url}/schedule`
  };

  const onSubmit = async (payload) => {
    try {
      const {data} = await axios.post(`/api/login`, payload, {params: target});

      console.log(data);

      setExpiration(data.expiration);
      setUser(data.user);

      if (!data.location) {
        history.push("/setup");
        return;
      }


      setCurrentLocation(data.location);

      if (queryParameters.get("target") === "schedule") {
        window.location.href = getScheduleUrl(data.location);
      } else {
        history.push(`/${data.location.url}/dashboard`)
      }

    } catch (error) {
      handleErrors(error);
    }
  };

  return (
    <Fragment>
      <Meta title="Log in"/>

      <div className="side-title-layout">
        <h1 className="t--alpha side-title-layout__title">
          {queryParameters.get("target") === "schedule" ? (
            <Fragment>Please sign in to book a training slot.</Fragment>
          ) : (
            <Fragment>Please sign to access BlocBeta.</Fragment>
          )}
        </h1>

        <div className="side-title-layout__content">
          <form onSubmit={(event) => handleSubmit(event, onSubmit)}>
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

            <Button type="submit"
                    loader={true}
                    loading={submitting}
                    disabled={submitting}>
              Login
            </Button>
          </form>

          <div className="login-extra">
            <Button variant="text" asLink={true} to="/register">
              Create Account
            </Button>

            <Button variant="text" asLink={true} to="/password-reset/request">
              Forgot Password
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
