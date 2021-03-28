import React, { Fragment, useContext, useState } from "react";
import { useQuery, useMutation, queryCache } from "react-query";
import { cache, mutationDefaults, useApi } from "../../hooks/useApi";
import { Loader } from "../../components/Loader/Loader";
import HoldType from "../HoldStyle/HoldType";
import { classNames } from "../../helper/classNames";
import "./BoulderDetails.css";
import { Close } from "../Icon/Close";
import { Button } from "../Button/Button";
import { getIcon } from "../Ascent/Ascent";
import { DrawerContext } from "../Drawer/Drawer";
import { Textarea } from "../Textarea/Textarea";
import Backward from "../Icon/Backward";
import { useForm } from "../../hooks/useForm";
import { errorToast, successToast, ToastContext } from "../Toaster/Toaster";

const DoubtForm = ({ ascent, boulder }) => {
  const { toggle: toggleDrawer } = useContext(DrawerContext);
  const { dispatch } = useContext(ToastContext);
  const { handleSubmit, observeField } = useForm({
    message: null,
    ascent,
  });

  const [mutateCreation] = useMutation(useApi("createDoubt"), {
    ...mutationDefaults,
    onSuccess: () => {
      queryCache.invalidateQueries([cache.boulder, { id: boulder }]);
    },
  });

  const onSubmit = async (payload) => {
    try {
      await mutateCreation({ payload });
      dispatch(successToast("Doubt submitted"));
      toggleDrawer(false);
    } catch (error) {
      dispatch(errorToast(error));
    }
  };

  return (
    <form
      onSubmit={(event) => handleSubmit(event, onSubmit)}
      className={"doubt-form"}
    >
      <Textarea
        placeholder={"Message"}
        name={"message"}
        className={"doubt-form__message-input"}
        required={"required"}
        onChange={observeField}
      />

      <Button
        size={"small"}
        className={"doubt-form__send-button"}
        type={"submit"}
      >
        Send
      </Button>
    </form>
  );
};

const ErrorForm = ({ boulder }) => {
  const { toggle: toggleDrawer } = useContext(DrawerContext);
  const { dispatch } = useContext(ToastContext);
  const { handleSubmit, observeField } = useForm({
    message: null,
    boulder,
  });

  const [mutateCreation] = useMutation(useApi("createError"), {
    ...mutationDefaults,
  });

  const onSubmit = async (payload) => {
    try {
      await mutateCreation({ payload });

      dispatch(successToast("Error submitted"));
      toggleDrawer(false);
    } catch (error) {
      dispatch(errorToast(error));
    }
  };

  return (
    <form
      onSubmit={(event) => handleSubmit(event, onSubmit)}
      className={"error-form"}
    >
      <Textarea
        placeholder={"Message"}
        name={"message"}
        className={"error-form__message-input"}
        required={"required"}
        onChange={observeField}
      />

      <Button
        size={"small"}
        className={"error-form__send-button"}
        type={"submit"}
      >
        Send
      </Button>
    </form>
  );
};

const BoulderDetails = ({ id }) => {
  const { status, data } = useQuery(
    [cache.boulder, { id }],
    useApi("boulderDetail", { id })
  );

  const [page, setPage] = useState("index");
  const [pageData, setPageData] = useState();
  const { toggle: toggleDrawer } = useContext(DrawerContext);

  if (status === "loading") {
    return <Loader />;
  }

  const pages = {
    index: () => {
      return (
        <Fragment>
          <div className="details__header details-header">
            <HoldType
              name={data.hold_type.name}
              image={data.hold_type.image}
              small={true}
            />

            <h3 className="details-header__name t--epsilon">{data.name}</h3>

            <Close
              className="details-header__close"
              onClick={() => toggleDrawer(false)}
            />
          </div>

          <h3 className="t--epsilon details__section-title">
            Setters ({data.setters.length})
          </h3>

          {data.setters.length > 0 && (
            <ul className="details__setters details-setters">
              {data.setters.map((setter, index) => (
                <li
                  className="details-setters__item t--epsilon"
                  key={`details-setters__item-${index}`}
                >
                  {setter.username}
                </li>
              ))}
            </ul>
          )}

          <h3 className="t--epsilon details__section-title">Tags</h3>

          {data.tags.length > 0 && (
            <ul className="details__tags details-tags">
              {data.tags.map((tag, index) => (
                <li
                  className="details-tags__item t--epsilon"
                  key={`details-tags__item-${index}`}
                >
                  {tag.emoji} {tag.name}
                </li>
              ))}
            </ul>
          )}

          <h3 className="t--epsilon details__section-title">
            Ascents ({data.ascents.length > 0 ? data.ascents.length : 0})
          </h3>

          {data.ascents.length > 0 && (
            <ul className="details__ascents details-ascents">
              {data.ascents.map((ascent, index) => {
                const doubted = ascent.type.includes("-pending-doubt");
                const Icon = getIcon(ascent.type.replace("-pending-doubt", ""));

                return (
                  <li
                    className="details-ascents__item details-ascents-item"
                    key={`details-ascents__item-${index}`}
                  >
                    <span
                      className={classNames(
                        "details-ascents-item__ascent t--eta",
                        doubted
                          ? "details-ascents-item__ascent--pending-doubt"
                          : null
                      )}
                    >
                      <Icon fill={true} />
                      {ascent.username}
                    </span>

                    {!doubted && ascent.type !== "resignation" && (
                      <Button
                        size={"small"}
                        onClick={() => {
                          setPageData({ ascent, boulder: data });
                          setPage("doubt");
                        }}
                      >
                        Doubt it
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <div className="details__report-error">
            <Button size={"small"} onClick={() => setPage("error")}>
              Report error
            </Button>
          </div>
        </Fragment>
      );
    },
    doubt: ({ ascent, boulder }) => {
      return (
        <Fragment>
          <div className="details__header details-header">
            <Backward
              className="details-header__back"
              onClick={() => setPage("index")}
            />

            <h3 className="details-header__name t--epsilon">
              Doubt {ascent.username}
            </h3>

            <Close
              className="details-header__close"
              onClick={() => toggleDrawer(false)}
            />
          </div>

          <div className={"details__section-content"}>
            <DoubtForm ascent={ascent.id} boulder={boulder.id} />
          </div>
        </Fragment>
      );
    },
    error: () => {
      return (
        <Fragment>
          <div className="details__header details-header">
            <Backward
              className="details-header__back"
              onClick={() => setPage("index")}
            />

            <h3 className="details-header__name t--epsilon">Report error</h3>

            <Close
              className="details-header__close"
              onClick={() => toggleDrawer(false)}
            />
          </div>

          <div className={"details__section-content"}>
            <ErrorForm boulder={data.id} />
          </div>
        </Fragment>
      );
    },
  };

  return <div className="details">{pages[page](pageData)}</div>;
};

export default BoulderDetails;
