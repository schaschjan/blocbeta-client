import React, {Fragment} from "react";
import {Loader} from "../../components/Loader/Loader";
import {toast} from "react-toastify";
import {FormRow} from "../../components/Form/Form";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import {handleErrors, useApiV2} from "../../hooks/useApi";
import {useMutation, useQuery} from "react-query";
import Switch from "../../components/Switch/Switch";
import {Meta} from "../../App";
import useForm, {composeFormElement} from "../../hooks/useForm";

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

    <FormRow>
      {composeFormElement(
        "armSpan",
        "Arm span",
        formData.armSpan,
        Input,
        observeField,
        {
          type: "text"
        }
      )}
    </FormRow>

    <FormRow>
      {composeFormElement(
        "height",
        "Height",
        formData.height,
        Input,
        observeField,
        {
          type: "number"
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
  const {status, data} = useQuery("me", useApiV2("me"));
  const deleteMe = useApiV2("deleteMe");

  const [mutate] = useMutation(useApiV2("updateMe"), {throwOnError: true});

  const onSubmit = async (data) => {
    try {
      await mutate({payload: data});
      alert("Your account was updated!");

    } catch (error) {
      handleErrors(error);
    }
  };

  const scheduleAccountDeletion = async () => {
    if (window.confirm("Confirm account deletion")) {
      deleteMe();
      toast.warn(data.message);
    }
  };

  if (status !== "success") return <Loader/>;

  return (
    <Fragment>
      <Meta title="Account"/>

      <div className="account-layout content-offset">
        <Form defaults={data} onSubmit={onSubmit}/>

        <div>
          <Button variant="danger" onClick={() => scheduleAccountDeletion()}>
            Delete Account
          </Button>
        </div>
      </div>

    </Fragment>
  );
};

export default Account;
