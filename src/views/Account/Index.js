import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Label from "../../components/Label/Label";
import { Input } from "../../components/Input/Input";
import { extractErrorMessage } from "../../hooks/useApi";
import Switch from "../../components/Switch/Switch";
import { Meta } from "../../App";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import { Loader } from "../../components/Loader/Loader";
import {
  errorToast,
  toast,
  ToastContext,
} from "../../components/Toaster/Toaster";
import { Button } from "../../components/Button/Button";
import { FormRow } from "../../components/Form/Form";
import { composeFormElement, useForm } from "../../hooks/useForm";
import Avatar from "../../components/Avatar/Avatar";
import { useHttp, useRequest } from "../../hooks/useRequest";
import layouts from "../../css/layouts.module.css";
import typography from "../../css/typography.module.css";
import styles from "./Index.module.css";
import { joinClassNames } from "../../helper/classNames";
import { mutate } from "swr";
import { Select } from "../../components/Select/Select";

const UploadField = ({ value, renderValue, onSuccess }) => {
  const { dispatch } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  const globalHttp = useHttp(false);

  const handleUpload = async (file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await globalHttp.post("/upload", formData);

      onSuccess(data.file);
    } catch (error) {
      dispatch(errorToast(error));
    }

    setLoading(false);
  };

  return (
    <div className={styles.uploadField}>
      {loading ? <Loader /> : renderValue(value)}

      <div>
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
  } = useForm({
    ...defaults,
    notifications: Object.keys(defaults.notifications),
  });

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
        <Label>E-Mail Notifications</Label>
        <Select
          onChange={(event, newValue) => setKeyValue("notifications", newValue)}
          value={formData.notifications}
          name={"notifications"}
          multiple={true}
          options={Object.keys(defaults.notifications)}
          renderOption={(option) => option}
          getOptionLabel={(option) => option}
        />
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
  const { data } = useRequest("/me", false);
  const globalHttp = useHttp(false);

  const { contextualizedPath } = useContext(BoulderDBUIContext);
  const history = useHistory();

  const { dispatch } = useContext(ToastContext);

  // todo: reload user object after submit to reflect changes immediately
  const onSubmit = async (data) => {
    try {
      delete data.id;
      delete data.username;

      await globalHttp.put("/me", data);

      await mutate("/api/me");
      dispatch(toast("Success", "Account updated!", "success"));
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "error"));
    }
  };

  const scheduleAccountDeletion = async () => {
    if (window.confirm("Confirm account deletion")) {
      try {
        await globalHttp.delete("/me");

        dispatch(
          toast("Your account was scheduled for deletion and will be removed.")
        );

        history.push(contextualizedPath("/dashboard"));
      } catch (error) {
        dispatch(toast("Error", extractErrorMessage(error), "error"));
      }
    }
  };

  if (!data) {
    return <Loader />;
  }

  return (
    <>
      <Meta title="Account" />

      <div className={layouts.side}>
        <h1 className={joinClassNames(layouts.sideTitle, typography.alpha)}>
          Account
        </h1>

        <div className={layouts.sideContent}>
          <Form defaults={data} onSubmit={onSubmit} />

          <div className={styles.actions}>
            <Button
              variant="error"
              size={"small"}
              onClick={() => scheduleAccountDeletion()}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export { Index };
