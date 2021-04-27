import React, { useContext, useEffect, useState } from "react";
import {
  errorToast,
  successToast,
  ToastContext,
} from "../../components/Toaster/Toaster";
import { Input } from "../../components/Input/Input";
import { FormElement } from "../../components/Form/Form";
import layouts from "../../css/layouts.module.css";
import { Button } from "../../components/Button/Button";
import { useHttp, useRequest } from "../../hooks/useRequest";
import { joinClassNames } from "../../helper/classNames";
import typography from "../../css/typography.module.css";
import { mutate } from "swr";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import styles from "./Add.module.css";
import { useForm } from "../../hooks/useForm";

const Form = () => {
  const locationHttp = useHttp();
  const { dispatch } = useContext(ToastContext);

  const { handleSubmit, formData, observeField, resetForm } = useForm({
    username: "",
  });

  return (
    <div className={styles.addForm}>
      <form
        onSubmit={(event) =>
          handleSubmit(event, async () => {
            try {
              await locationHttp.post("/setter", {
                username: formData.username,
              });

              dispatch(successToast(`Added ${formData.username} to setters`));
              resetForm();
            } catch (error) {
              dispatch(errorToast(error));
            }
          })
        }
      >
        <FormElement>
          <Input
            placeholder="Username"
            name={"username"}
            value={formData.username}
            onChange={observeField}
          />
        </FormElement>

        <div className={styles.addButton}>
          <Button>Add</Button>
        </div>
      </form>
    </div>
  );
};

const Add = () => {
  const { contextualizedApiPath } = useContext(BoulderDBUIContext);
  const { dispatch } = useContext(ToastContext);

  const { data: setters } = useRequest("/setter");
  const globalHttp = useHttp(false);
  const locationHttp = useHttp();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const fetchResults = async (username) => {
    const { data } = await globalHttp.get(`/user/search`, {
      params: {
        username: username,
      },
    });

    return data;
  };

  useEffect(() => {
    if (search.length < 1) {
      setUsers([]);
      return;
    }

    fetchResults(search).then((data) => setUsers(data));
  }, [search]);

  return (
    <>
      <div className={layouts.side}>
        <h1 className={joinClassNames(layouts.sideTitle, typography.alpha)}>
          Add Setter without an account:
        </h1>

        <div className={layouts.sideContent}>
          <Form />
        </div>
      </div>

      <br />
      <br />

      <div className={layouts.side}>
        <h1 className={joinClassNames(layouts.sideTitle, typography.alpha)}>
          Add Setter with an existing account:
        </h1>

        <div className={layouts.sideContent}>
          <FormElement>
            <Input
              value={search}
              onClear={() => setSearch("")}
              placeholder="Search for a username"
              onChange={async (event) => setSearch(event.target.value)}
            />
          </FormElement>

          <ul className={styles.searchResults}>
            {users.map((user) => {
              const isSetter =
                setters.find((setter) => setter.username === user.username) !==
                undefined;

              return (
                <li className={styles.searchResultItem}>
                  <span>{user.username}</span>

                  {!isSetter ? (
                    <Button
                      size="small"
                      onClick={async () => {
                        try {
                          await locationHttp.post("/setter", { user: user.id });
                          await mutate(contextualizedApiPath("/setter"));
                          setSearch("");

                          dispatch(
                            successToast(`Added ${user.username} to setters`)
                          );
                        } catch (error) {
                          dispatch(errorToast(error));
                        }
                      }}
                    >
                      Add
                    </Button>
                  ) : (
                    <Button size="small" disabled={true}>
                      Already a setter
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};
export { Add };
