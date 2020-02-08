import React, {useState, useEffect} from 'react';
import {Loader} from "../components/Loader/Loader";
import ApiClient from "../ApiClient";
import {useForm} from "react-hook-form";
import {getError} from "../Helpers";
import {toast} from "react-toastify";

const Account = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setSubmitting] = useState(false);

    const {register, handleSubmit, errors} = useForm();

    const onSubmit = (data) => {
        setSubmitting(true);
        console.log(data);

        ApiClient.updateMe(data).then(data => {
            setSubmitting(false);
            toast.success("Account updated");
        });
    };

    useEffect(() => {
        ApiClient.getMe().then(data => {
            setData(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <Loader/>;

    return (
        <div className="container">
            <h1>Account</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-row">
                    <label>Visible</label>
                    <input name="visible"
                           type="checkbox"
                           defaultChecked={data.visible}
                           ref={register()}/>
                </div>

                <div className="form-row">
                    <label>Username</label>
                    <input name="username" value={data.username} ref={register({required: true})} disabled/>
                </div>

                <div className="form-row">
                    <label>Email</label>
                    <input name="email"
                           defaultValue={data.email}
                           ref={register({
                               required: true
                           })}/>

                    <span className="form-error">{errors.email && getError(errors.email)}</span>
                </div>

                <div className="form-row">
                    <label>Arm span</label>
                    <input name="armSpan"
                           defaultValue={data.armSpan}
                           ref={register({
                               required: true,
                               min: {
                                   value: 120,
                                   message: "Minimal arm span is 120"
                               },
                               max: {
                                   value: 220,
                                   message: "Maximal arm span is 220"
                               }
                           })}
                           type="number"/>

                    <span className="form-error">{errors.armSpan && getError(errors.armSpan)}</span>
                </div>

                <div className="form-row">
                    <label>Height</label>
                    <input name="height"
                           defaultValue={data.height}
                           ref={register({
                               required: true,
                               min: {
                                   value: 120,
                                   message: "Minimal height is 120"
                               },
                               max: {
                                   value: 220,
                                   message: "Maximal height is 220"
                               }
                           })}
                           type="number"/>

                    <span className="form-error">{errors.height && getError(errors.height)}</span>
                </div>

                <div className="form-row">
                    <label>Weight</label>
                    <input name="weight"
                           defaultValue={data.weight}
                           ref={register({
                               required: true,
                               min: {
                                   value: 40,
                                   message: "Minimal weight is 40"
                               },
                               max: {
                                   value: 120,
                                   message: "Maximal weight is 120"
                               }
                           })}
                           type="number"/>

                    <span className="form-error">{errors.weight && getError(errors.weight)}</span>
                </div>

                <div className="form-row">
                    {isSubmitting ? (
                        <input type="submit" className="button button--disabled" value="Update"/>
                    ) : (
                        <input type="submit" className="button" value="Update"/>
                    )}
                </div>
            </form>
        </div>
    )
};

export default Account