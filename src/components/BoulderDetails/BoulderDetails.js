import React, { createContext, useContext, useMemo, useState } from "react";
import { Loader } from "../Loader/Loader";
import HoldType from "../HoldStyle/HoldType";
import { joinClassNames } from "../../helper/classNames";
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
import { parseDate } from "../../helper/parseDate";
import axios from "axios";
import { extractErrorMessage } from "../../hooks/useApi";

function DoubtForm({ ascent }) {
  const { contextualizedApiPath } = useContext(BoulderDBUIContext);
  const { toggle: toggleDrawer } = useContext(DrawerContext);
  const { dispatch } = useContext(ToastContext);
  const { boulder } = useContext(BoulderDetailContext);

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
      console.error(error.response);
      dispatch(toast("Error", extractErrorMessage(error), "error"));
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
}

function ErrorForm() {
  const { contextualizedApiPath } = useContext(BoulderDBUIContext);
  const { toggle: toggleDrawer } = useContext(DrawerContext);
  const { dispatch } = useContext(ToastContext);
  const { boulder } = useContext(BoulderDetailContext);

  const { handleSubmit, observeField } = useForm({
    message: null,
    boulder: boulder.id,
  });

  const http = useHttp();

  const onSubmit = async (payload) => {
    try {
      await http.post("/error", payload);
      await mutate(contextualizedApiPath(`/boulder/${boulder.id}`));

      dispatch(toast("Error submitted", null, "success"));
      toggleDrawer(false);
    } catch (error) {
      console.error(error.response);
      dispatch(toast("Error", extractErrorMessage(error), "error"));
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
}

function CommentForm() {
  const { contextualizedApiPath } = useContext(BoulderDBUIContext);
  const { toggle: toggleDrawer } = useContext(DrawerContext);
  const { dispatch } = useContext(ToastContext);
  const { boulder } = useContext(BoulderDetailContext);

  const { handleSubmit, observeField } = useForm({
    message: null,
    boulder: boulder.id,
  });

  const http = useHttp();

  const onSubmit = async (payload) => {
    try {
      await http.post("/comment", payload);
      await mutate(contextualizedApiPath(`/boulder/${boulder.id}`));

      dispatch(toast("Comment submitted", null, "success"));
      toggleDrawer(false);
    } catch (error) {
      console.error(error.response);
      dispatch(toast("Error", extractErrorMessage(error), "error"));
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
}

function SectionTitle({ children }) {
  return (
    <h3 className={joinClassNames(typography.epsilon, styles.title)}>
      {children}
    </h3>
  );
}

function SectionSeparator() {
  return <span className={styles.separator} />;
}

function AscentList() {
  const { boulder, setPage, setPageData } = useContext(BoulderDetailContext);
  const limit = 10;

  const [ascents, setAscents] = useState(boulder.ascents.slice(0, limit));

  if (!ascents) {
    return null;
  }

  return (
    <ul className={styles.list}>
      {ascents.map((ascent) => {
        const doubted = ascent.type.includes("-pending-doubt");
        const Icon = getIcon(ascent.type.replace("-pending-doubt", ""));

        if (ascents.length === limit && ascent.id + 1 === limit) {
          return (
            <li className={joinClassNames(styles.listItem)} key={ascent.id}>
              <Button
                size={"small"}
                className={styles.listAllButton}
                onClick={() => setAscents(boulder.ascents)}
              >
                show {boulder.ascents.length - limit} more
              </Button>
            </li>
          );
        }

        return (
          <li className={styles.listItem} key={ascent.id}>
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
                  setPageData({ ascent });
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

function Comment({ id, message, author, createdAt, matchesUser = false }) {
  const http = useHttp();
  const { contextualizedApiPath } = useContext(BoulderDBUIContext);
  const { dispatch } = useContext(ToastContext);
  const { boulder } = useContext(BoulderDetailContext);

  const deleteComment = async (id, boulderId) => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return null;
    }

    const confirmed = window.confirm("Are you sure?");

    if (!confirmed) {
      return null;
    }

    try {
      await http.delete(`/comment/${id}`);
      await mutate(contextualizedApiPath(`/boulder/${boulderId}`));
    } catch (error) {
      console.error(error.response);
      dispatch(toast("Error", extractErrorMessage(error.response), "error"));
    }
  };

  return (
    <li className={joinClassNames(typography.eta, styles.commentListItem)}>
      <div>{message}</div>

      <div className={styles.commentAuthor}>{matchesUser ? author : "You"}</div>

      <div className={styles.commentDate}>{parseDate(createdAt).string}</div>

      {matchesUser && (
        <button
          onClick={() => deleteComment(id, boulder.id)}
          className={joinClassNames(typography.eta, styles.commentDelete)}
        >
          delete
        </button>
      )}
    </li>
  );
}

function CommentList({}) {
  const { user } = useContext(BoulderDBUIContext);
  const { boulder } = useContext(BoulderDetailContext);

  return (
    <ul className={styles.commentList}>
      {boulder.comments.length === 0 ? (
        <li className={joinClassNames(typography.eta)}>Be the first!</li>
      ) : (
        boulder.comments.map((comment) => (
          <Comment
            key={comment.id}
            {...comment}
            createdAt={comment.created_at}
            matchesUser={user.username === comment.author}
          />
        ))
      )}
    </ul>
  );
}

const BoulderDetailContext = createContext(null);

function RateButton({ onClick, children, active = false }) {
  return (
    <button
      onClick={onClick}
      className={joinClassNames(
        styles.rateButton,
        active ? styles.active : null
      )}
    >
      {children}
    </button>
  );
}

function BoulderDetails({ id }) {
  const { data: boulder } = useRequest(`/boulder/${id}`);
  const [page, setPage] = useState("index");
  const [pageData, setPageData] = useState();
  const { toggle: toggleDrawer } = useContext(DrawerContext);
  const { dispatch } = useContext(ToastContext);
  const http = useHttp();

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
                name={boulder.hold_type.name}
                image={boulder.hold_type.image}
                small={true}
              />

              <span className={styles.headerTitle}>{boulder.name}</span>
            </Header>

            <SectionTitle>Setters ({boulder.setters.length})</SectionTitle>

            {boulder.setters.length > 0 && (
              <ul className={styles.list}>
                {boulder.setters.map((setter) => (
                  <li className={styles.listItem} key={setter.id}>
                    {setter.username}
                  </li>
                ))}
              </ul>
            )}

            <SectionSeparator />

            {boulder.tags.length > 0 && (
              <>
                <SectionTitle>Tags</SectionTitle>
                <ul className={styles.list}>
                  {boulder.tags.map((tag) => (
                    <li className={styles.listItem} key={tag.id}>
                      {tag.emoji} {tag.name}
                    </li>
                  ))}
                </ul>
                <SectionSeparator />
              </>
            )}

            <SectionTitle>
              Ascents ({boulder.ascents.length > 0 ? boulder.ascents.length : 0}
              )
            </SectionTitle>

            <AscentList />

            <SectionSeparator />

            <SectionTitle>Comments</SectionTitle>

            <CommentList />

            <div className={styles.commentButton}>
              <Button size={"small"} onClick={() => setPage("comment")}>
                Leave a comment
              </Button>
            </div>

            <SectionSeparator />

            <div className={styles.rating}>
              <RateButton
                onClick={async () => {
                  try {
                    await http.post(`/rating`, {
                      rating: 10,
                      boulder: boulder.id,
                    });

                    dispatch(toast("Rating submitted!", null, "success"));
                  } catch (error) {
                    console.error(error.response);
                    dispatch(
                      toast("Error", extractErrorMessage(error), "error")
                    );
                  }
                }}
                active={boulder.rating && boulder.rating.rating === 10}
              >
                👍
              </RateButton>

              <span>/</span>

              <RateButton
                onClick={async () => {
                  try {
                    await http.post(`/rating`, {
                      rating: 0,
                      boulder: boulder.id,
                    });

                    dispatch(toast("Rating submitted!", null, "success"));
                  } catch (error) {
                    console.error(error.response);
                    dispatch(
                      toast("Error", extractErrorMessage(error), "error")
                    );
                  }
                }}
                active={boulder.rating && boulder.rating.rating === 0}
              >
                👎
              </RateButton>
            </div>

            <SectionSeparator />

            <div className={styles.reportErrorButton}>
              <Button
                size={"small"}
                onClick={() => setPage("error")}
                variant={"error"}
              >
                Report error
              </Button>
            </div>
          </>
        );
      },
      doubt: ({ ascent }) => {
        return (
          <>
            <Header backlink={"index"}>
              <span className={styles.headerTitle}>
                Doubt {ascent.username}
              </span>
            </Header>

            <div className={styles.content}>
              <DoubtForm ascent={ascent.id} />
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
              <ErrorForm />
            </div>
          </>
        );
      },
      comment: () => (
        <>
          <Header backlink={"index"}>
            <span className={styles.headerTitle}>Leave a comment</span>
          </Header>

          <div className={styles.content}>
            <CommentForm />
          </div>
        </>
      ),
    };
  }, [boulder]);

  if (!boulder) {
    return <Loader />;
  }

  return (
    <BoulderDetailContext.Provider
      value={{
        page,
        setPage,
        pageData,
        setPageData,
        boulder,
      }}
    >
      <div className={joinClassNames(styles.root, typography.epsilon)}>
        {pages[page](pageData)}
      </div>
    </BoulderDetailContext.Provider>
  );
}

export default BoulderDetails;
