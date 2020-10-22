import React, {useContext, Fragment} from "react";
import {Meta} from "../../App";
import {FormRow} from "../../components/Form/Form";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import {useForm, composeFormElement} from "../../index";
import axios from "axios";
import Select from "../../components/Select/Select";
import {useHistory} from "react-router-dom";
import "./Register.css"
import {extractErrorMessage} from "../../hooks/useApi";
import {toast, ToastContext} from "../../components/Toaster/Toaster";

const Register = () => {
  const history = useHistory();
  const {dispatch} = useContext(ToastContext);

  const {handleSubmit, observeField, submitting, formData} = useForm({
    username: null,
    email: null,
    firstName: null,
    lastName: null,
    gender: "",
    password: null
  });

  const onSubmit = async (payload) => {
    try {
      await axios.post(`/api/register`, payload);
      alert("Your account was created! You can now log in.");
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
      <Meta title="Account"/>

      <div className="side-title-layout">
        <h1 className="t--alpha side-title-layout__title">
          Please provide some information for your account.
        </h1>

        <div className="side-title-layout__content">
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
                  maxLength: 40
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
                  maxLength: 40
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
                  maxLength: 20
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
                  maxLength: 60
                }
              )}
            </FormRow>

            <FormRow>
              {composeFormElement(
                "gender",
                "Gender",
                formData.gender,
                Select,
                observeField,
                {
                  children: (
                    <Fragment>
                      <option value="">–</option>
                      <option value="neutral">Neutral</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </Fragment>
                  ),
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
              disabled={submitting}>
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
