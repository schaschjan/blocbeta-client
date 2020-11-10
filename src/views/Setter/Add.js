import React, {Fragment, useContext, useState} from "react";
import {errorToast, successToast, ToastContext} from "../../components/Toaster/Toaster";
import {Input} from "../../components/Input/Input";
import {FormElement} from "../../components/Form/Form";
import {cache, mutationDefaults, useApi} from "../../hooks/useApi";
import axios from "axios";
import {ResultList, ResultListItem} from "../../components/ResultList/ResultList";
import {Button} from "../../components/Button/Button";
import {useQuery, useMutation, queryCache} from "react-query";
import {LoadedContent} from "../../components/Loader/Loader";

const Add = () => {
  const {dispatch} = useContext(ToastContext);
  const {status, data: setters} = useQuery(cache.setters, useApi("setters"));

  const [searchResults, setSearchResults] = useState([]);

  const [mutateCreation, {
    status: mutateCreationStatus,
    error: mutateCreationError
  }] = useMutation(useApi("createSetter"), {
    ...mutationDefaults,
    onSuccess: () => {
      queryCache.invalidateQueries(cache.setters);
    },
  });

  return <Fragment>
    <h1 className="t--alpha page-title">
      Add setter
    </h1>

    <LoadedContent loading={status === "loading"}>
      <FormElement>
        <Input
          placeholder="Search for a username"
          onChange={async (event) => {

            const {data} = await axios.get(`/api/user/search`, {
              params: {
                username: event.target.value
              }
            });

            setSearchResults(data);
          }}/>
      </FormElement>

      <ResultList>
        {searchResults.map(result => {
          const isSetter = setters.find(setter => setter.username === result.username) !== undefined;

          return (
            <ResultListItem>
              <span>
                {result.username}
              </span>

              {!isSetter ? (
                <Button size="small" onClick={async () => {

                  try {
                    await mutateCreation({
                      payload: {
                        active: true,
                        username: result.username
                      }
                    });

                    dispatch(successToast(`Added ${result.username} to setters`))

                  } catch (error) {
                    dispatch(errorToast(error))
                  }
                }}>
                  Add
                </Button>
              ) : (
                <Button size="small" disabled={true}>
                  Already a setter
                </Button>
              )}
            </ResultListItem>
          )
        })}
      </ResultList>
    </LoadedContent>
  </Fragment>
};

export {Add}
