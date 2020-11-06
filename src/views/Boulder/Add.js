import React, {Fragment, useContext} from "react";
import {Meta} from "../../App";
import {cache, extractErrorMessage} from "../../hooks/useApi";
import {useHistory} from "react-router-dom";
import Input from "../../components/Input/Input";
import {FormRow} from "../../components/Form/Form";
import {Textarea} from "../../components/Textarea/Textarea";
import ResourceDependantSelect from "../../components/ResourceDependantSelect/ResourceDependantSelect";
import {api} from "../../helper/api";
import {BlocBetaUIContext} from "../../components/BlocBetaUI";
import {toast, ToastContext} from "../../components/Toaster/Toaster";
import {composeFormElement, useForm} from "../../hooks/useForm";
import {Button} from "../../components/Button/Button";

export default () => {
  const history = useHistory();
  const {dispatch} = useContext(ToastContext);

  const {handleSubmit, observeField, submitting, formData} = useForm({
    name: null,
    points: 1000,
    start_wall: null,
    end_wall: null,
    grade: null,
    hold_type: null,
    tags: [null],
    setters: [null]
  });

  const {contextualizedPath} = useContext(BlocBetaUIContext);

  const onSubmit = async (payload) => {
    console.log(payload);

    try {
      await api.timeSlotExclusion.add(payload);
      alert("blocker added!");
      history.push(contextualizedPath("/dashboard"));

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
      <Meta title="Add time slot exclusion"/>

      <div className="side-title-layout">
        <h1 className="t--alpha side-title-layout__title">
          Add a new boulder.
        </h1>

        <div className="side-title-layout__content">
          <form onSubmit={event => handleSubmit(event, onSubmit)}>

            <FormRow>
              {composeFormElement(
                "name",
                "Name",
                formData.name,
                Input,
                observeField
              )}
            </FormRow>

            <FormRow>
              {composeFormElement(
                "start_wall",
                "Start Wall",
                formData.start_wall,
                ResourceDependantSelect,
                observeField,
                {
                  cacheKey: cache.walls,
                  api: cache.walls,
                  labelProperty: "name"
                }
              )}
            </FormRow>

            <FormRow>
              {composeFormElement(
                "end_wall",
                "End Wall",
                formData.end_wall,
                ResourceDependantSelect,
                observeField,
                {
                  cacheKey: cache.walls,
                  api: cache.walls,
                  labelProperty: "name"
                }
              )}
            </FormRow>

            <FormRow>
              {composeFormElement(
                "grade",
                "Grade",
                formData.grade,
                ResourceDependantSelect,
                observeField,
                {
                  cacheKey: cache.grades,
                  api: cache.grades,
                  labelProperty: "name"
                }
              )}
            </FormRow>

            <FormRow>
              {composeFormElement(
                "hold_type",
                "Hold Type",
                formData.hold_type,
                ResourceDependantSelect,
                observeField,
                {
                  cacheKey: cache.holdTypes,
                  api: cache.holdTypes,
                  labelProperty: "name"
                }
              )}
            </FormRow>

            <FormRow>
              {composeFormElement(
                "tags",
                "Tags",
                formData.tags,
                ResourceDependantSelect,
                observeField,
                {
                  cacheKey: cache.tags,
                  api: cache.tags,
                  labelProperty: "name",
                  multiple: true
                }
              )}
            </FormRow>

            <FormRow>
              {composeFormElement(
                "setters",
                "Setter",
                formData.setters,
                ResourceDependantSelect,
                observeField,
                {
                  cacheKey: cache.setters,
                  api: cache.setters,
                  labelProperty: "username",
                  multiple: true
                }
              )}
            </FormRow>

            <FormRow>
              {composeFormElement(
                "points",
                "Points",
                formData.points,
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
              Add
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};
