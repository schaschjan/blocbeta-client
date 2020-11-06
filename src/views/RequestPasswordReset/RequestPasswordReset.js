import React, {Fragment, useContext} from "react";
import {Meta} from "../../App";
import {FormRow} from "../../components/Form/Form";
import Input from "../../components/Input/Input";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {extractErrorMessage} from "../../hooks/useApi";
import {toast, ToastContext} from "../../components/Toaster/Toaster";
import {composeFormElement, useForm} from "../../hooks/useForm";
import {Button} from "../../components/Button/Button";

const RequestPasswordReset = () => {
  const history = useHistory();
  const {dispatch} = useContext(ToastContext);

  const {handleSubmit, observeField, submitting, formData} = useForm({
    email: null
  });

  const onSubmit = async (payload) => {

    try {
      await axios.post(`/api/request-reset`, payload);
      alert("You will receive instructions on how to reset your password via E-Mail.");
      history.push("/login");

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
      <Meta title="Reset password"/>

      <div className="side-title-layout">
        <h1 className="t--alpha side-title-layout__title">
          Receive instructions on how to recover your password via E-Mail.
        </h1>

        <div className="side-title-layout__content">
          <form onSubmit={(event) => handleSubmit(event, onSubmit)}>
            <FormRow>
              {composeFormElement(
                "email",
                "E-Mail",
                formData.email,
                Input,
                observeField,
                {
                  type: "email",
                  required: true,
                  maxLength: 60
                }
              )}
            </FormRow>

            <Button
              type="submit"
              primary="true"
              loader={true}
              loading={submitting}
              disabled={submitting}>
              Send reset link
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default RequestPasswordReset;
