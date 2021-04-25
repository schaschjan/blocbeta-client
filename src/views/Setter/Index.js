import React, { useContext } from "react";
import { extractErrorMessage } from "../../hooks/useApi";
import { toast, ToastContext } from "../../components/Toaster/Toaster";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import { AccessDenied } from "../../components/AccessDenied/AccessDenied";
import { useHttp, useRequest } from "../../hooks/useRequest";
import layouts from "../../css/layouts.module.css";
import { joinClassNames } from "../../helper/classNames";
import typography from "../../css/typography.module.css";
import styles from "./Index.module.css";
import { Button } from "../../components/Button/Button";
import { mutate } from "swr";

const Index = () => {
  const { dispatch } = useContext(ToastContext);
  const { isAdmin, contextualizedApiPath } = useContext(BoulderDBUIContext);
  const { data } = useRequest("/setter");
  const locationHttp = useHttp();

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <>
      <div className={layouts.side}>
        <h1 className={joinClassNames(layouts.sideTitle, typography.alpha)}>
          Setter ({data && data.length})
        </h1>

        <div className={layouts.sideContent}>
          {data &&
            data.map((setter) => {
              return (
                <div className={styles.row}>
                  <div
                    className={joinClassNames(
                      styles.cell,
                      !setter.active ? styles.isInactiveCell : null
                    )}
                  >
                    {setter.username}
                  </div>

                  <div className={styles.cell}>
                    <Button
                      size={"small"}
                      variant={setter.active ? "danger" : "primary"}
                      onClick={async () => {
                        try {
                          await locationHttp.put(`/setter/${setter.id}`, {
                            active: !setter.active,
                          });

                          await mutate(contextualizedApiPath("/setter"));

                          dispatch(toast("Update successful", null, "success"));
                        } catch (error) {
                          dispatch(
                            toast("Error", extractErrorMessage(error), "danger")
                          );
                        }
                      }}
                    >
                      {setter.active ? "deactivate" : "re-activate"}
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export { Index };
