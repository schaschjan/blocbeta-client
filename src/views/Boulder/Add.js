import React, { Fragment, useContext } from "react";
import { Meta } from "../../App";
import { cache, useApi } from "../../hooks/useApi";
import { Input } from "../../components/Input/Input";
import { FormRow } from "../../components/Form/Form";
import { queryCache, useMutation } from "react-query";
import ResourceDependantSelect from "../../components/ResourceDependantSelect/ResourceDependantSelect";
import {
  errorToast,
  successToast,
  ToastContext,
} from "../../components/Toaster/Toaster";
import { composeFormElement, useForm } from "../../hooks/useForm";
import { Button } from "../../components/Button/Button";
import { Select } from "../../components/Select/Select";

const Add = () => {
  const { dispatch } = useContext(ToastContext);

  const {
    handleSubmit,
    observeField,
    submitting,
    formData,
    resetForm,
  } = useForm({
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
  });

  const [mutateCreation] = useMutation(useApi("createBoulder"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries([cache.boulder]);
    },
  });

  const onSubmit = async (payload) => {
    try {
      await mutateCreation({ payload });

      dispatch(successToast("Boulder created!"));
      resetForm();
    } catch (error) {
      dispatch(errorToast(error));
    }
  };

  return (
    <Fragment>
      <Meta title="Add time slot exclusion" />

      <div className="side-title-layout">
        <h1 className="t--alpha side-title-layout__title">
          Add a new boulder.
        </h1>

        <div className="side-title-layout__content">
          <form onSubmit={(event) => handleSubmit(event, onSubmit)}>
            <FormRow>
              {composeFormElement(
                "name",
                "Name",
                formData.name,
                Input,
                observeField
              )}
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
              Add
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export { Add };
