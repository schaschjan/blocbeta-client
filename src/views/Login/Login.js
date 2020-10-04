import React, {useContext, useEffect, Fragment} from "react";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import useForm, {composeFormElement} from "../../hooks/useForm";
import {Meta} from "../../App";
import axios from "axios";
import {FormRow} from "../../components/Form/Form";
import {handleErrors} from "../../hooks/useApi";
import {BlocBetaUIContext} from "@blocbeta/ui-core";
import {useHistory} from "react-router-dom";
import "./Login.css";

const Login = () => {
  const {handleSubmit, formData, submitting, observeField} = useForm({
    username: null,
    password: null
  });

  const history = useHistory();
  const queryParameters = new URLSearchParams(window.location.search);
  const target = queryParameters.get("target");
  const {setUser, setCurrentLocation, setExpiration, reset} = useContext(BlocBetaUIContext);

  useEffect(() => {
    reset();
  }, []);

  const onSubmit = async (payload) => {
    try {
      const {data} = await axios.post(`/api/login`, payload);

      setExpiration(data.expiration);
      setUser(data.user);
      setCurrentLocation(data.location);

      if (target) {
        window.location.href = target;
      } else {
        history.push(`${data.targetLocation}/dashboard`);
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
          Please sign to access BlocBeta.
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

            <Button variant="text" asLink={true} to="/request-password-reset">
              Forgot Password
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
