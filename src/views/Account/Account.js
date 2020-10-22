import React, {Fragment, useContext} from "react";
import {useHistory} from "react-router-dom";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import {extractErrorMessage, useApi} from "../../hooks/useApi";
import {useMutation, useQuery} from "react-query";
import Switch from "../../components/Switch/Switch";
import {Meta} from "../../App";
import {composeFormElement, useForm, FormRow} from "../../index";
import {BlocBetaUIContext} from "../../components/BlocBetaUI";
import "./Account.css";
import {LoadedContent} from "../../components/Loader/Loader";
import {toast, ToastContext} from "../../components/Toaster/Toaster";

const Form = ({defaults, onSubmit}) => {
  const {handleSubmit, submitting, formData, observeField} = useForm(defaults);

  return <form onSubmit={(event) => handleSubmit(event, onSubmit)}>
    <FormRow>
      {composeFormElement(
        "visible",
        "Visibile",
        formData.visible,
        Switch,
        observeField
      )}
    </FormRow>

    <FormRow>
      <Label>Username</Label>
      <Input value={formData.username} disabled/>
    </FormRow>

    <FormRow>
      {composeFormElement(
        "email",
        "Email",
        formData.email,
        Input,
        observeField,
        {
          type: "email",
          required: true
        }
      )}
    </FormRow>

    <FormRow>
      {composeFormElement(
        "firstName",
        "First Name",
        formData.firstName,
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
        "lastName",
        "Last Name",
        formData.lastName,
        Input,
        observeField,
        {
          type: "text",
          required: true
        }
      )}
    </FormRow>

    <Button
      type="submit"
      variant="primary"
      loader={true}
      loading={submitting}
      disabled={submitting}>
      Update
    </Button>
  </form>
};

const Account = () => {
  const {status, data} = useQuery("me", useApi("me"));
  const deleteMe = useApi("deleteMe");
  const [mutate] = useMutation(useApi("updateMe"), {throwOnError: true});
  const {contextualizedPath} = useContext(BlocBetaUIContext);
  const history = useHistory();

  const {dispatch} = useContext(ToastContext);

  const onSubmit = async (data) => {

    delete data.media;

    try {
      await mutate({payload: data});

      dispatch(
        toast(
          "Success",
          "Account updated!",
          "success"
        )
      );

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

  const scheduleAccountDeletion = async () => {
    if (window.confirm("Confirm account deletion")) {

      try {
        await deleteMe();
        alert("Your account was scheduled for deletion and will be removed.");
        history.push(contextualizedPath("/dashboard"))

      } catch (error) {

        dispatch(
          toast(
            "Error",
            extractErrorMessage(error),
            "danger"
          )
        );
      }
    }
  };

  return (
    <Fragment>
      <Meta title="Account"/>

      <h1 className="t--alpha page-title">
        Account
      </h1>


      <LoadedContent loading={status !== "success"}>
        <div className="account-layout content-offset">
          <Form defaults={data} onSubmit={onSubmit}/>

          <div className="account-layout__actions">
            <Button variant="danger" onClick={() => scheduleAccountDeletion()}>
              Delete Account
            </Button>
          </div>
        </div>
      </LoadedContent>
    </Fragment>
  );
};

export default Account;
