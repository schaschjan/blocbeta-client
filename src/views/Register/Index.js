import React, { useContext, Fragment } from "react";
import { Meta } from "../../App";
import { FormRow } from "../../components/Form/Form";
import { Input } from "../../components/Input/Input";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { extractErrorMessage } from "../../hooks/useApi";
import { toast, ToastContext } from "../../components/Toaster/Toaster";
import { Select } from "../../components/Select/Select";
import { Button } from "../../components/Button/Button";
import { composeFormElement, useForm } from "../../hooks/useForm";
import layouts from "../../css/layouts.module.css";
import typography from "../../css/typography.module.css";

const Index = () => {
  const history = useHistory();
  const { dispatch } = useContext(ToastContext);

  const {
    handleSubmit,
    observeField,
    submitting,
    setKeyValue,
    formData,
  } = useForm({
    username: null,
    email: null,
    firstName: null,
    lastName: null,
    gender: "",
    password: null,
  });

  const onSubmit = async (payload) => {
    try {
      await axios.post(`/api/register`, {
        ...payload,
        gender: payload.gender.value,
      });
      dispatch(
        toast("Your account was created! You can now log in.", null, "success")
      );
      history.push("/login");
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "danger"));
    }
  };

  return (
    <Fragment>
      <Meta title="Account" />

      <div className={layouts.side}>
        <div className={layouts.sideTitle}>
          <h1 className={typography.alpha}>
            Please provide some information for your account.
          </h1>
        </div>

        <div className={layouts.sideContent}>
          <form onSubmit={(event) => handleSubmit(event, onSubmit)}>
            <FormRow>
              {composeFormElement(
                "firstName",
                "First Name",
                formData.firstName,
                Input,
                observeField,
                {
                  type: "text",
                  required: true,
                  minlength: 2,
                  maxLength: 40,
                }
              )}
            </FormRow>

            <FormRow>
              {composeFormElement(
                "lastName",
                "Last Name",
                formData.lastName,
                Input,
                observeField,
                {
                  type: "text",
                  required: true,
                  minlength: 2,
                  maxLength: 40,
                }
              )}
            </FormRow>

            <FormRow>
              {composeFormElement(
                "username",
                "Username",
                formData.username,
                Input,
                observeField,
                {
                  type: "text",
                  required: true,
                  minlength: 2,
                  maxLength: 20,
                }
              )}
            </FormRow>

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
                  maxLength: 60,
                }
              )}
            </FormRow>

            <FormRow>
              {composeFormElement(
                "gender",
                "Gender",
                formData.gender,
                Select,
                (event, newValue) => setKeyValue("gender", newValue),
                {
                  renderOption: (option) => option.label,
                  getOptionLabel: (option) => option.label,
                  options: [
                    {
                      label: "Female",
                      value: "female",
                    },
                    {
                      label: "Male",
                      value: "male",
                    },
                  ],
                  required: true,
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
                  required: true,
                  minlength: 6,
                }
              )}
            </FormRow>

            <Button
              type="submit"
              variant="primary"
              loader={true}
              loading={submitting}
              disabled={submitting}
            >
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export { Index };
