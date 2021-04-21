import React, {useContext, useEffect, Fragment} from "react";
import {Meta} from "../../App";
import {extractErrorMessage} from "../../hooks/useApi";
import {BoulderDBUIContext} from "../../components/BoulderDBUI";
import {useHistory} from "react-router-dom";
import styles from "./Index.module.css";
import layouts from "../../css/layouts.module.css";
import typography from "../../css/typography.module.css";
import {
    successToast,
    toast,
    ToastContext,
} from "../../components/Toaster/Toaster";
import {composeFormElement, useForm} from "../../hooks/useForm";
import {Button} from "../../components/Button/Button";
import {Input} from "../../components/Input/Input";
import FormRow from "../../components/FormRow/FormRow";
import {useHttp} from "../../hooks/useRequest";

const Index = () => {
    const {handleSubmit, formData, submitting, observeField} = useForm({
        username: null,
        password: null,
    });

    const globalHttp = useHttp();

    const history = useHistory();
    const {setUser, setCurrentLocation, setExpiration, reset} = useContext(
        BoulderDBUIContext
    );

    const {dispatch} = useContext(ToastContext);

    useEffect(() => {
        reset();
    }, []);

    const onSubmit = async (payload) => {
        try {
            const {
                expiration,
                user,
                location,
                targetLocation,
            } = await globalHttp.post('/login', {payload});

            setExpiration(expiration);
            setUser(user);
            setCurrentLocation(location);

            if (!user.username || !user.first_name || !user.last_name) {
                dispatch(
                    successToast(
                        "Account details missing. Please add them in your account settings!"
                    )
                );
            }

            if (!targetLocation) {
                history.push(`/setup`);
            } else {
                history.push(`${targetLocation}/boulder`);
            }
        } catch (error) {
            dispatch(toast("Error", extractErrorMessage(error), "danger"));
        }
    };

    return (
        <Fragment>
            <Meta title="Log in"/>

            <div className={layouts.side}>
                <div className={layouts.sideTitle}>
                    <h1 className={typography.alpha}>
                        Please sign in to access BoulderDB.
                    </h1>
                </div>

                <div className={layouts.sideContent}>
                    <form onSubmit={(event) => handleSubmit(event, onSubmit)}>
                        <FormRow>
                            {composeFormElement(
                                "username",
                                "Username / Email",
                                formData.username,
                                Input,
                                observeField,
                                {
                                    type: "text",
                                    required: true,
                                }
                            )}
                        </FormRow>

                        <FormRow>
                            {composeFormElement(
                                "password",
                                "Password",
                                formData.password,
                                Input,
                                observeField,
                                {
                                    type: "password",
                                    required: true,
                                }
                            )}
                        </FormRow>

                        <Button
                            type="submit"
                            loader={true}
                            loading={submitting}
                            disabled={submitting}
                        >
                            Login
                        </Button>
                    </form>

                    <div className={styles.extra}>
                        <Button variant="primary" size="small" asLink={true} to="/register">
                            Create Account
                        </Button>

                        <Button
                            variant="primary"
                            size="small"
                            asLink={true}
                            to="/password-reset/request"
                        >
                            Forgot Password
                        </Button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export {Index};
