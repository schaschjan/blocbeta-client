import React, { useContext, useMemo, useState } from "react";
import { Loader } from "../Loader/Loader";
import HoldType from "../HoldStyle/HoldType";
import { classNames, joinClassNames } from "../../helper/classNames";
import { Close } from "../Icon/Close";
import { Button } from "../Button/Button";
import { getIcon } from "../Ascent/Ascent";
import { DrawerContext } from "../Drawer/Drawer";
import { Textarea } from "../Textarea/Textarea";
import Backward from "../Icon/Backward";
import { useForm } from "../../hooks/useForm";
import { toast, ToastContext } from "../Toaster/Toaster";
import { useHttp, useRequest } from "../../hooks/useRequest";
import { mutate } from "swr";
import { BoulderDBUIContext } from "../BoulderDBUI";
import styles from "./BoulderDetails.module.css";
import typography from "../../css/typography.module.css";

const DoubtForm = ({ ascent, boulder }) => {
  const { contextualizedApiPath } = useContext(BoulderDBUIContext);
  const { toggle: toggleDrawer } = useContext(DrawerContext);
  const { dispatch } = useContext(ToastContext);
  const { handleSubmit, observeField } = useForm({
    message: null,
    ascent,
  });

  const http = useHttp();

  const onSubmit = async (payload) => {
    try {
      await http.post("/doubt", payload);
      await mutate(contextualizedApiPath(`/boulder/${boulder}`));

      dispatch(toast("Doubt submitted", null, "success"));
      toggleDrawer(false);
    } catch (error) {
      console.error(error);
      dispatch(toast("Error", error, "error"));
    }
  };

  return (
    <form
      onSubmit={(event) => handleSubmit(event, onSubmit)}
      className={styles.form}
    >
      <Textarea
        placeholder={"Message"}
        name={"message"}
        className={styles.formTextArea}
        required={"required"}
        onChange={observeField}
      />

      <Button size={"small"} className={styles.formButton} type={"submit"}>
        Send
      </Button>
    </form>
  );
};

const ErrorForm = ({ boulder }) => {
  const { contextualizedApiPath } = useContext(BoulderDBUIContext);
  const { toggle: toggleDrawer } = useContext(DrawerContext);
  const { dispatch } = useContext(ToastContext);

  const { handleSubmit, observeField } = useForm({
    message: null,
    boulder,
  });

  const http = useHttp();

  const onSubmit = async (payload) => {
    try {
      await http.post("/error", payload);
      await mutate(contextualizedApiPath(`/boulder/${boulder}`));

      dispatch(toast("Error submitted", null, "success"));
      toggleDrawer(false);
    } catch (error) {
      console.error(error);
      dispatch(toast("Error", error, "error"));
    }
  };

  return (
    <form
      onSubmit={(event) => handleSubmit(event, onSubmit)}
      className={styles.form}
    >
      <Textarea
        placeholder={"Message"}
        name={"message"}
        className={styles.formTextArea}
        required={"required"}
        onChange={observeField}
      />

      <Button size={"small"} className={styles.formButton} type={"submit"}>
        Send
      </Button>
    </form>
  );
};

function SectionTitle({ children }) {
  return (
    <h3 className={joinClassNames(typography.epsilon, styles.title)}>
      {children}
    </h3>
  );
}

function AscentList({ data, setPage, setPageData }) {
  const limit = 10;

  const [ascents, setAscents] = useState(data.ascents.slice(0, limit));

  if (!ascents) {
    return null;
  }

  return (
    <ul className={styles.list}>
      {ascents.map((ascent, index) => {
        const doubted = ascent.type.includes("-pending-doubt");
        const Icon = getIcon(ascent.type.replace("-pending-doubt", ""));

        if (ascents.length === limit && index + 1 === limit) {
          return (
            <li className={joinClassNames(styles.listItem)}>
              <Button
                size={"small"}
                className={styles.listAllButton}
                onClick={() => setAscents(data.ascents)}
              >
                show {data.ascents.length - limit} more
              </Button>
            </li>
          );
        }

        return (
          <li className={styles.listItem} key={index}>
            <span
              className={joinClassNames(
                typography.eta,
                styles.ascent,
                doubted ? styles.hasPendingDoubtAscent : null
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
  );
}

const BoulderDetails = ({ id }) => {
  const { data } = useRequest(`/boulder/${id}`);

  const [page, setPage] = useState("index");
  const [pageData, setPageData] = useState();
  const { toggle: toggleDrawer } = useContext(DrawerContext);

  function Header({ children, backlink }) {
    return (
      <div className={joinClassNames(styles.header, typography.epsilon)}>
        {backlink && (
          <Backward className={styles.back} onClick={() => setPage(backlink)} />
        )}

        {children}

        <Close className={styles.close} onClick={() => toggleDrawer(false)} />
      </div>
    );
  }

  const pages = useMemo(() => {
    return {
      index: () => {
        return (
          <>
            <Header>
              <HoldType
                name={data.hold_type.name}
                image={data.hold_type.image}
                small={true}
              />

              <span className={styles.headerTitle}>{data.name}</span>
            </Header>

            <SectionTitle>Setters ({data.setters.length})</SectionTitle>

            {data.setters.length > 0 && (
              <ul className={styles.list}>
                {data.setters.map((setter, index) => (
                  <li className={styles.listItem} key={index}>
                    {setter.username}
                  </li>
                ))}
              </ul>
            )}

            <SectionTitle>Tags</SectionTitle>

            {data.tags.length > 0 && (
              <ul className={styles.list}>
                {data.tags.map((tag, index) => (
                  <li className={styles.listItem} key={index}>
                    {tag.emoji} {tag.name}
                  </li>
                ))}
              </ul>
            )}

            <SectionTitle>
              Ascents ({data.ascents.length > 0 ? data.ascents.length : 0})
            </SectionTitle>

            <AscentList
              data={data}
              setPage={setPage}
              setPageData={setPageData}
            />

            <div className={styles.reportErrorButton}>
              <Button size={"small"} onClick={() => setPage("error")}>
                Report error
              </Button>
            </div>
          </>
        );
      },
      doubt: ({ ascent, boulder }) => {
        return (
          <>
            <Header backlink={"index"}>
              <span className={styles.headerTitle}>
                Doubt {ascent.username}
              </span>
            </Header>

            <div className={styles.content}>
              <DoubtForm ascent={ascent.id} boulder={boulder.id} />
            </div>
          </>
        );
      },
      error: () => {
        return (
          <>
            <Header backlink={"index"}>
              <span className={styles.headerTitle}>Report error</span>
            </Header>

            <div className={styles.content}>
              <ErrorForm boulder={data.id} />
            </div>
          </>
        );
      },
    };
  }, [data]);

  if (!data) {
    return <Loader />;
  }

  return (
    <div className={joinClassNames(styles.root, typography.epsilon)}>
      {pages[page](pageData)}
    </div>
  );
};

export default BoulderDetails;
