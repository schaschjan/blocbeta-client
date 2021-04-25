import React, { useContext } from "react";
import { Meta } from "../../App";
import { FormRow } from "../../components/Form/Form";
import { Input } from "../../components/Input/Input";
import { useHistory } from "react-router-dom";
import { extractErrorMessage } from "../../hooks/useApi";
import { toast, ToastContext } from "../../components/Toaster/Toaster";
import { composeFormElement, useForm } from "../../hooks/useForm";
import { Button } from "../../components/Button/Button";
import layouts from "../../css/layouts.module.css";
import typography from "../../css/typography.module.css";
import { useHttp } from "../../hooks/useRequest";

const Request = () => {
  const history = useHistory();
  const { dispatch } = useContext(ToastContext);
  const globalHttp = useHttp(false);

  const { handleSubmit, observeField, submitting, formData } = useForm({
    email: null,
  });

  const onSubmit = async (payload) => {
    try {
      await globalHttp.post(`/request-reset`, payload);
      dispatch(
        toast(
          null,
          "You will receive instructions on how to reset your password via E-Mail.",
          "success"
        )
      );
      history.push("/login");
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "danger"));
    }
  };

  return (
    <>
      <Meta title="Reset password" />

      <div className={layouts.side}>
        <div className={layouts.sideTitle}>
          <h1 className={typography.alpha}>
            Receive instructions on how to recover your password via E-Mail.
          </h1>
        </div>

        <div className={layouts.sideContent}>
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
                  maxLength: 60,
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
              Send reset link
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export { Request };
