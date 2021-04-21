import React, {useContext, useEffect, useState} from "react";
import {
    errorToast,
    successToast,
    ToastContext,
} from "../../components/Toaster/Toaster";
import {Input} from "../../components/Input/Input";
import {FormElement} from "../../components/Form/Form";
import layouts from "../../css/layouts.module.css";
import {Button} from "../../components/Button/Button";
import {useHttp, useRequest} from "../../hooks/useRequest";
import {joinClassNames} from "../../helper/classNames";
import typography from "../../css/typography.module.css";
import {mutate} from "swr";
import {BoulderDBUIContext} from "../../components/BoulderDBUI";

const Add = () => {
        const {contextualizedApiPath} = useContext(BoulderDBUIContext);
        const {dispatch} = useContext(ToastContext);

        const {data: setters} = useRequest("/setter/current");
        const globalHttp = useHttp(false);
        const locationHttp = useHttp();

        const [search, setSearch] = useState("");
        const [users, setUsers] = useState([]);

        const fetchResults = async (username) => {
            const {data} = await globalHttp.get(`/user/search`, {
                params: {
                    username: username
                },
            });

            return data;
        }

        useEffect(() => {
            if (search.length < 1) {
                return
            }

            fetchResults(search).then(data => setUsers(data))
        }, [search])

        return (
            <>
                <div className={layouts.side}>
                    <h1 className={joinClassNames(layouts.sideTitle, typography.alpha)}>
                        Add Setter
                    </h1>

                    <div className={layouts.sideContent}>
                        <FormElement>
                            <Input
                                placeholder="Search for a username"
                                onChange={async (event) => setSearch(event.target.value)}
                            />
                        </FormElement>

                        <ul>
                            {users.map((user) => {
                                const isSetter = setters.find((setter) => setter.username === user.username) !== undefined;

                                return (
                                    <li>
                                        <span>{user.username}</span>

                                        {!isSetter ? (
                                            <Button
                                                size="small"
                                                onClick={async () => {
                                                    try {
                                                        await locationHttp.post('/setter', {user: user.id})
                                                        await mutate(contextualizedApiPath('/setter'))

                                                        dispatch(successToast(`Added ${user.username} to setters`));
                                                    } catch (error) {
                                                        dispatch(errorToast(error));
                                                    }
                                                }}>
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
    }
;

export {Add};
