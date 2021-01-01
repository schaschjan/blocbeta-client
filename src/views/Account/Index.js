import React, { Fragment, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Label from "../../components/Label/Label";
import { Input } from "../../components/Input/Input";
import { extractErrorMessage, useApi } from "../../hooks/useApi";
import { useMutation, useQuery } from "react-query";
import Switch from "../../components/Switch/Switch";
import { Meta } from "../../App";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import "./Index.css";
import { LoadedContent, Loader } from "../../components/Loader/Loader";
import {
  errorToast,
  toast,
  ToastContext,
} from "../../components/Toaster/Toaster";
import { Button } from "../../components/Button/Button";
import { FormRow } from "../../components/Form/Form";
import { composeFormElement, useForm } from "../../hooks/useForm";
import axios from "axios";
import Avatar from "../../components/Avatar/Avatar";

const UploadField = ({ value, renderValue, onSuccess }) => {
  const { dispatch } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onSuccess(data.file);
    } catch (error) {
      dispatch(errorToast(error));
    }

    setLoading(false);
  };

  return (
    <div className={"upload-field"}>
      {loading ? <Loader /> : renderValue(value)}

      <div className={"file-input"}>
        <label
          htmlFor={"image"}
          className="button button--primary button--small file-input__button"
        >
          Upload
        </label>

        <input
          type="file"
          style={{
            display: "none",
          }}
          id={"image"}
          name={"image"}
          onChange={(event) => {
            handleUpload(event.target.files[0]);
          }}
        />
      </div>
    </div>
  );
};

const Form = ({ defaults, onSubmit }) => {
  const {
    handleSubmit,
    submitting,
    formData,
    setKeyValue,
    observeField,
  } = useForm(defaults);

  return (
    <form onSubmit={(event) => handleSubmit(event, onSubmit)}>
      <FormRow>
        <UploadField
          value={formData.image}
          renderValue={(value) => {
            return <Avatar image={`${value}`} />;
          }}
          onSuccess={(resource) => setKeyValue("image", resource)}
        />
      </FormRow>

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
        <Input value={formData.username} disabled />
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
            required: true,
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
            required: true,
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
        Update
      </Button>
    </form>
  );
};

const Index = () => {
  const { status, data } = useQuery("me", useApi("me"));
  const deleteMe = useApi("deleteMe");
  const [mutate] = useMutation(useApi("updateMe"), { throwOnError: true });
  const { contextualizedPath } = useContext(BoulderDBUIContext);
  const history = useHistory();

  const { dispatch, successToast } = useContext(ToastContext);

  const onSubmit = async (data) => {
    try {
      await mutate({ payload: data });
      dispatch(successToast("Success", "Account updated!", "success"));
    } catch (error) {
      dispatch(errorToast(extractErrorMessage(error)));
    }
  };

  const scheduleAccountDeletion = async () => {
    if (window.confirm("Confirm account deletion")) {
      try {
        await deleteMe();
        dispatch(
          successToast(
            "Your account was scheduled for deletion and will be removed."
          )
        );

        history.push(contextualizedPath("/dashboard"));
      } catch (error) {
        dispatch(toast("Error", extractErrorMessage(error), "danger"));
      }
    }
  };

  return (
    <Fragment>
      <Meta title="Account" />

      <h1 className="t--alpha page-title">Account</h1>

      <LoadedContent loading={status !== "success"}>
        <div className="account-layout content-offset">
          <Form defaults={data} onSubmit={onSubmit} />

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

export { Index };
