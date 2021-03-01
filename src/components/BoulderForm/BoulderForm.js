import React, { Fragment } from "react";
import { composeFormElement, useForm } from "../../hooks/useForm";
import { FormRow } from "../Form/Form";
import { Input } from "../Input/Input";
import ResourceDependantSelect from "../ResourceDependantSelect/ResourceDependantSelect";
import { cache } from "../../hooks/useApi";
import { Select } from "../Select/Select";
import { Button } from "../Button/Button";
import PropTypes from "prop-types";

const BoulderForm = ({ submitLabel, onSubmit, data }) => {
  const { handleSubmit, observeField, submitting, formData } = useForm(data);

  return (
    <form onSubmit={(event) => handleSubmit(event, onSubmit)}>
      <FormRow>
        {composeFormElement("name", "Name", formData.name, Input, observeField)}
      </FormRow>

      <FormRow columns={2}>
        {composeFormElement(
          "start_wall",
          "Start Wall",
          formData.start_wall,
          ResourceDependantSelect,
          observeField,
          {
            cacheKey: cache.walls,
            api: cache.walls,
            labelProperty: "name",
          }
        )}

        {composeFormElement(
          "end_wall",
          "End Wall",
          formData.end_wall,
          ResourceDependantSelect,
          observeField,
          {
            cacheKey: cache.walls,
            api: cache.walls,
            labelProperty: "name",
          }
        )}
      </FormRow>

      <FormRow columns={2}>
        {composeFormElement(
          "grade",
          "Grade",
          formData.grade,
          ResourceDependantSelect,
          observeField,
          {
            cacheKey: cache.grades,
            api: cache.grades,
            labelProperty: "name",
          }
        )}

        {composeFormElement(
          "internal_grade",
          "Internal Grade",
          formData.internal_grade,
          ResourceDependantSelect,
          observeField,
          {
            cacheKey: cache.grades,
            api: cache.grades,
            labelProperty: "name",
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
            labelProperty: "name",
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
            multiple: true,
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
            multiple: true,
          }
        )}
      </FormRow>

      <FormRow>
        {composeFormElement(
          "status",
          "Status",
          formData.status,
          Select,
          observeField,
          {
            children: (
              <Fragment>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Fragment>
            ),
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
            type: "number",
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
        {submitLabel}
      </Button>
    </form>
  );
};

BoulderForm.propTypes = {
  submitLabel: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

BoulderForm.defaultProps = {
  data: {
    name: "",
    status: "active",
    points: 1000,
    start_wall: "",
    end_wall: "",
    grade: "",
    internal_grade: "",
    hold_type: "",
    tags: [""],
    setters: [""],
  },
};

export { BoulderForm };
