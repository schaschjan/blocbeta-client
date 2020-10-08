import React, {Fragment} from "react";
import {Meta} from "../../../App";
import {composeFormElement, useForm} from "../../..";
import {handleErrors} from "../../../hooks/useApi";
import {useHistory} from "react-router-dom";
import Input from "../../../components/Input/Input";
import {FormRow} from "../../../components/Form/Form";
import Button from "../../../components/Button/Button";
import {Textarea} from "../../../components/Textarea/Textarea";
import ResourceDependantSelect from "../../../components/ResourceDependantSelect/ResourceDependantSelect";
import {api, cache} from "../../../helper/api";

const AddTimeSlotBlocker = () => {
  const history = useHistory();

  const {handleSubmit, observeField, submitting, formData} = useForm({
    start_date: null,
    end_date: null,
    note: null,
    room: null
  });

  const onSubmit = async (payload) => {
    try {
      await api.timeSlotExclusion.add(payload);
      history.push("/login");

    } catch (error) {
      handleErrors(error);
    }
  };

  return (
    <Fragment>
      <Meta title="Add time slot exclusion"/>

      <div className="side-title-layout">
        <h1 className="t--alpha side-title-layout__title">
          Add a new time slot blocker.
        </h1>

        <div className="side-title-layout__content">
          <form onSubmit={(event) => handleSubmit(event, onSubmit)}>

            <FormRow>
              {composeFormElement(
                "quantity",
                "Quantity (leave blank to block room completely)",
                formData.quantity,
                Input,
                observeField,
                {
                  type: "number",
                  min: 1,
                  max: 200
                }
              )}
            </FormRow>

            <FormRow>
              {composeFormElement(
                "room",
                "Room",
                formData.room,
                ResourceDependantSelect,
                observeField,
                {
                  cacheKey: "room",
                  api: () => api.rooms.index(),
                  labelProperty: "name"
                }
              )}
            </FormRow>

            <FormRow>
              {composeFormElement(
                "start_date",
                "Start Date",
                formData.start_date,
                Input,
                observeField,
                {
                  type: "datetime-local",
                  required: true
                }
              )}
            </FormRow>

            <FormRow>
              {composeFormElement(
                "end_date",
                "End Date",
                formData.end_date,
                Input,
                observeField,
                {
                  type: "datetime-local",
                  required: true
                }
              )}
            </FormRow>

            <FormRow>
              {composeFormElement(
                "note",
                "Note",
                formData.note,
                Textarea,
                observeField
              )}
            </FormRow>

            <Button
              type="submit"
              variant="primary"
              loader={true}
              loading={submitting}
              disabled={submitting}>
              Add
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  )
};

export default AddTimeSlotBlocker;