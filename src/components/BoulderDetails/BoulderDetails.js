import React, { Fragment, useEffect, useContext, useState } from "react";
import { useQuery } from "react-query";
import { cache, useApi } from "../../hooks/useApi";
import { Loader } from "../../components/Loader/Loader";
import HoldType from "../HoldStyle/HoldType";
import { classNames } from "../../helper/classNames";
import "./BoulderDetails.css";
import { Close } from "../Icon/Close";
import { Button } from "../Button/Button";
import { getIcon } from "../Ascent/Ascent";
import { DrawerContext } from "../Drawer/Drawer";
import { Textarea } from "../Textarea/Textarea";

const BoulderDetails = ({ id }) => {
  const detailQuery = useQuery(
    [cache.boulder, { id }],
    useApi("boulderDetail", { id })
  );

  const [page, setPage] = useState("index");
  const [pageData, setPageData] = useState();

  const { toggle: toggleDrawer } = useContext(DrawerContext);

  useEffect(() => {
    if (detailQuery.status === "success") {
      setPageData(detailQuery.data);
    }
  }, [detailQuery]);

  const pages = {
    index: (data) => {
      console.log(data.ascents);

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
            Ascents ({data.ascents.length})
          </h3>

          {data.ascents.length > 0 && (
            <ul className="details__ascents details-ascents">
              {data.ascents.map((ascent, index) => {
                const doubted = ascent.type.includes("pending-doubt");
                const Icon = getIcon(ascent.type);

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

                    <Button
                      size={"small"}
                      onClick={() => {
                        setPage("doubt");
                        setPageData({
                          ascent,
                          id: data.id,
                          name: data.name,
                        });
                      }}
                    >
                      Doubt it
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="details__report-error">
            <Button size={"small"}>Report error</Button>
          </div>
        </Fragment>
      );
    },
    doubt: (data) => {
      return (
        <Fragment>
          <div className="details__header details-header">
            <h3 className="details-header__name t--epsilon">
              Doubt {data.ascent.username}
            </h3>

            <Close
              className="details-header__close"
              onClick={() => toggleDrawer(false)}
            />
          </div>

          <Textarea>Message</Textarea>
        </Fragment>
      );
    },
    error: (data) => {
      return <Fragment>Error</Fragment>;
    },
  };

  return <div className="details">{pageData && pages[page](pageData)}</div>;
};

export default BoulderDetails;
