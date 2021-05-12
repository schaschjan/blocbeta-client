import React, { useContext, useMemo } from "react";
import { extractErrorMessage } from "../../hooks/useApi";
import { toast, ToastContext } from "../../components/Toaster/Toaster";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import { AccessDenied } from "../../components/AccessDenied/AccessDenied";
import { useHttp, useRequest } from "../../hooks/useRequest";
import layouts from "../../css/layouts.module.css";
import { joinClassNames } from "../../helper/classNames";
import typography from "../../css/typography.module.css";
import { Button } from "../../components/Button/Button";
import { mutate } from "swr";
import { AdminTable } from "../../components/AdminTable/AdminTable";
import { Loader } from "../../components/Loader/Loader";
import styles from "./Index.module.css";

const Index = () => {
  const { dispatch } = useContext(ToastContext);
  const { isAdmin, contextualizedApiPath } = useContext(BoulderDBUIContext);
  const { data } = useRequest("/wall");
  const locationHttp = useHttp();

  const columns = useMemo(() => {
    return [
      {
        accessor: "name",
        Header: "Name",
      },
      {
        id: "deactivate",
        Header: "",
        Cell: ({ row: { original: setter } }) => {
          return (
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
          );
        },
      },
    ];
  }, []);

  if (!isAdmin) {
    return <AccessDenied />;
  }

  if (!data) {
    return <Loader />;
  }

  return (
    <>
      <div className={layouts.side}>
        <h1 className={joinClassNames(layouts.sideTitle, typography.alpha)}>
          Walls ({data && data.length})
        </h1>

        <div className={layouts.sideContent}>
          <AdminTable
            data={data}
            columns={columns}
            rowClassName={styles.row}
            headerClassName={styles.header}
          />
        </div>
      </div>
    </>
  );
};

export { Index };
