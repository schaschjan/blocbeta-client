import React, {useContext, useEffect, Fragment} from "react";
import {Input} from "../../components/Input/Input";
import {Meta} from "../../App";
import axios from "axios";
import {FormRow} from "../../components/Form/Form";
import {extractErrorMessage} from "../../hooks/useApi";
import {BlocBetaUIContext} from "../../components/BlocBetaUI";
import {useHistory} from "react-router-dom";
import "./Index.css";
import {toast, ToastContext} from "../../components/Toaster/Toaster";
import {composeFormElement, useForm} from "../../hooks/useForm";
import {Button} from "../../components/Button/Button";

const Index = () => {
  const {handleSubmit, formData, submitting, observeField} = useForm({
    username: null,
    password: null
  });

  const history = useHistory();
  const {setUser, setCurrentLocation, setExpiration, reset} = useContext(BlocBetaUIContext);

  const {dispatch} = useContext(ToastContext);

  useEffect(() => {
    reset();
  }, []);

  const onSubmit = async (payload) => {
    try {
      const {data} = await axios.post(`/api/login`, payload);

      setExpiration(data.expiration);
      setUser(data.user);
      setCurrentLocation(data.location);

      if (!data.user.username || !data.user.first_name || !data.user.last_name) {
        alert("Account details missing. Please add them in your account settings!");
      }

      if (!data.targetLocation) {
        history.push(`/setup`);
      } else {
        history.push(`${data.targetLocation}/dashboard`);
      }

    } catch (error) {

      dispatch(
        toast(
          "Error",
          extractErrorMessage(error),
          "danger"
        )
      );
    }
  };

  return (
    <Fragment>
      <Meta title="Log in"/>

      <div className="side-title-layout">
        <div className="side-title-layout__title">
          <h1 className="t--alpha">
            Please sign to access BlocBeta.
          </h1>
          <br/>
          <br/>

          <h2 className="t--gamma">
            If you have an existing boulderdb.de account use it to sign in.
          </h2>
        </div>

        <div className="side-title-layout__content">
          <form onSubmit={(event) => handleSubmit(event, onSubmit)}>
            <FormRow>
              {composeFormElement(
                "username",
                "Username / Email",
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
            <Button variant="primary" size="small" asLink={true} to="/register">
              Create Account
            </Button>

            <Button variant="primary" size="small" asLink={true} to="/password-reset/request">
              Forgot Password
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export {Index};
