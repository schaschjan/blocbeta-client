import React, { Fragment, useContext } from "react";
import { useQuery } from "react-query";
import { cache, useApi } from "../../hooks/useApi";
import { LoadedContent } from "../../components/Loader/Loader";
import HoldStyle from "../../components/HoldStyle/HoldStyle";
import { classNames } from "../../helper/classNames";
import "./BoulderDetails.css";
import { Close } from "../Icon/Close";
import { Button } from "../Button/Button";
import { getIcon } from "../Ascent/Ascent";
import { DrawerContext } from "../Drawer/Drawer";

const BoulderDetails = ({ id }) => {
  const { status, data } = useQuery(
    [cache.boulder, { id }],
    useApi("boulderDetail", { id })
  );

  const { toggle: toggleDrawer } = useContext(DrawerContext);

  return (
    <div className="details">
      <LoadedContent loading={status === "loading"}>
        {data && (
          <Fragment>
            <div className="details__header details-header">
              <HoldStyle
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

                      <Button size={"small"}>Doubt it</Button>
                    </li>
                  );
                })}
              </ul>
            )}

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

            <div className="details__report-error">
              <Button size={"small"}>Report error</Button>
            </div>
          </Fragment>
        )}
      </LoadedContent>
    </div>
  );
};

export default BoulderDetails;
