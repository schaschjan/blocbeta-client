import React, { useState, useContext, useEffect } from "react";
import { Meta } from "../../App";
import { FormRow } from "../../components/Form/Form";
import { Input } from "../../components/Input/Input";
import { extractErrorMessage } from "../../hooks/useApi";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import styles from "./Reset.module.css";
import {
  successToast,
  toast,
  ToastContext,
} from "../../components/Toaster/Toaster";
import { classNames } from "../../helper/classNames";
import { composeFormElement, useForm } from "../../hooks/useForm";
import { Button } from "../../components/Button/Button";
import layouts from "../../css/layouts.module.css";
import typography from "../../css/typography.module.css";
import { useHttp } from "../../hooks/useRequest";

const Reset = () => {
  const [hashFound, setHashFound] = useState(false);
  const { dispatch } = useContext(ToastContext);
  const globalHttp = useHttp(false);

  const history = useHistory();
  const { hash } = useParams();

  const { handleSubmit, observeField, submitting, formData } = useForm({
    password: null,
  });

  const checkToken = async (hash) => {
    try {
      await globalHttp.get(`/reset/${hash}`, false);
      setHashFound(true);
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "error"));
    }
  };

  useEffect(() => {
    checkToken(hash);
  }, []);

  const onSubmit = async (payload) => {
    try {
      await globalHttp.post(`/reset/${hash}`, payload);
      dispatch(
        successToast(
          "Your Password was successfully updated. You can now log in again."
        )
      );
      history.push("/login");
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "error"));
    }
  };

  return (
    <>
      <Meta title="Reset password" />

      <div className={layouts.side}>
        <div className={layouts.sideTitle}>
          <h1 className={typography.alpha}>Choose your new password wisely.</h1>
        </div>

        <div className={layouts.sideContent}>
          <form
            onSubmit={(event) => handleSubmit(event, onSubmit)}
            className={classNames(
              styles.form,
              !hashFound ? styles.isDisabledForm : null
            )}
          >
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
              primary="true"
              loader={true}
              loading={submitting}
              disabled={submitting}
            >
              Update password
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export { Reset };
