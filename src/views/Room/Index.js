import React, {Fragment} from "react";
import {useQuery} from "react-query";
import {LoadedContent} from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";
import {useApiV2} from "../../hooks/useApi";
import {Button} from "../../index";
import "./Index.css";

export default () => {
  const {status, data} = useQuery("rooms", useApiV2("rooms"));

  return <Fragment>
    <h1 className="t--alpha page-title">
      Rooms
    </h1>

    <LoadedContent loading={status === "loading"}>
      <EmptyState isEmpty={!data || data.length === 0}>

        <div className="crud-list">
          <ul className="crud-list__header crud-list-header">
            <li className="crud-list-header__item crud-list-header-item">
              Name
            </li>

            <li className="crud-list-header__item crud-list-header-item">
              Action
            </li>
          </ul>

          <ul className="crud-list__content crud-list-content">
            {data && data.map(room => {
              return (
                <li className="crud-list-content__item crud-list-content-item">
                  <div className="crud-list-content-item__cell">
                    {room.name}
                  </div>

                  <div className="crud-list-content-item__cell">
                    <Button size="small">Show</Button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

      </EmptyState>
    </LoadedContent>
  </Fragment>
};