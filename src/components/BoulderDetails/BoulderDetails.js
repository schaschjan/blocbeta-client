import React, {Fragment} from "react";
import {useQuery} from "react-query";
import {cache, useApi} from "../../hooks/useApi";
import {LoadedContent} from "../../components/Loader/Loader";
import HoldStyle from "../../components/HoldStyle/HoldStyle";
import {classNames} from "../../helper/buildClassNames";
import Icon from "../../components/Icon/Icon";
import Button from "../../components/Button/Button";
import "./BoulderDetails.css";
import {Close} from "../Icon/Close";

const BoulderDetails = ({id, closeDrawer}) => {
  const {status, data} = useQuery([cache.boulder, {id}], useApi("boulderDetail", {id}));

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

              <h3 className="details-header__name t--epsilon">
                {data.name}
              </h3>

              <Close className="details-header__close" onClick={() => closeDrawer()}/>
            </div>

            <h3 className="t--epsilon details__section-title">
              Ascents ({data.ascents.length})
            </h3>

            {data.ascents.length > 0 && (
              <ul className="details__ascents details-ascents">
                {data.ascents.map((ascent) => {
                  const doubted = ascent.type.includes("pending-doubt");

                  return (
                    <li className="details-ascents__item details-ascents-item">
                        <span
                          className={classNames("details-ascents-item__ascent t--eta", doubted ? "details-ascents-item__ascent--pending-doubt" : null)}>
                          <Icon name={ascent.type}/>
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
                {data.setters.map(setter => (
                  <li className="details-setters__item t--epsilon">
                    {setter.username}
                  </li>
                ))}
              </ul>
            )}

            <h3 className="t--epsilon details__section-title">
              Tags
            </h3>

            {data.tags.length > 0 && (
              <ul className="details__tags details-tags">
                {data.tags.map(tag => (
                  <li className="details-tags__item t--epsilon">
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
  )
};

export default BoulderDetails
