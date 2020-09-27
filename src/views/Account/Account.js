import React, {Fragment} from "react";
import {Loader} from "../../components/Loader/Loader";
import {toast} from "react-toastify";
import {Form, FormRow} from "../../components/Form/Form";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import {api} from "../../hooks/useApi";
import {useMutation, useQuery} from "react-query";
import Switch from "../../components/Switch/Switch";
import {Meta} from "../../App";
import axios from "axios";
import useForm, {composeFormElement} from "../../hooks/useForm";

const Account = () => {

  const {status, data} = useQuery("me", async () => {
    const {data} = await axios.get(`/api/me`);

    return data;
  });

  const defaults = {
    apeIndex: null,
    armSpan: null,
    email: null,
    gender: null,
    height: null,
    media: null,
    username: null,
    visible: null,
    weight: null,
  };

  const {handleSubmit, formData, observeField} = useForm(status === "success" ? data : defaults);

  const [mutate, {status: updateStatus}] = useMutation(api.me.update, {
    throwOnError: true,
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      await mutate(data);
      toast.success("Account updated");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const scheduleAccountDeletion = async () => {
    if (window.confirm("Confirm account deletion")) {
      const data = await api.me.delete();
      toast.warn(data.message);
    }
  };

  if (status === "loading") return <Loader/>;

  return (
    <Fragment>
      <Meta title="Account"/>

      <Form onSubmit={onSubmit} defaultValues={data}>
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
          primary="true"
          disabled={updateStatus === "loading"}>
          Update
        </Button>
      </Form>

      <Button variant="danger" onClick={() => scheduleAccountDeletion()}>
        Delete Account
      </Button>
    </Fragment>
  );
};

export default Account;
