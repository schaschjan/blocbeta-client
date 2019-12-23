import React from "react";
import {RHFInput} from "react-hook-form-input";
import useForm from 'react-hook-form';
import {
    ColorSelect,
    GradeSelect,
    SetterSelect,
    StatusSelect,
    TagSelect,
    WallSelect
} from "../../../components/common/formHelpers";

export default function Form(props) {

    const {register, handleSubmit, errors, setValue} = useForm({
        defaultValues: props.values
    });

    return (
        <form onSubmit={handleSubmit(props.onSubmit)}>
            <div className="form-row">
                <input
                    name="name"
                    placeholder="Name"
                    className="form-field"
                    type="text"
                    ref={register({required: true, maxLength: 40})}/>

                {errors.name && errors.name.type === "required" &&
                <span className="form-error">Required</span>
                }
            </div>

            <div className="form-row">
                <RHFInput
                    as={ColorSelect()}
                    name="color"
                    register={register}
                    setValue={setValue}
                    rules={{required: true}}
                />

                {errors.color && errors.color.type === "required" &&
                <span className="form-error">Required</span>
                }
            </div>

            <div className="form-row">
                <RHFInput
                    as={GradeSelect()}
                    name="grade"
                    register={register}
                    setValue={setValue}
                    rules={{required: true}}
                />

                {errors.color && errors.color.type === "required" &&
                <span className="form-error">Required</span>
                }
            </div>

            <div className="form-row">
                <RHFInput
                    as={WallSelect({label: "Start", options: window.walls})}
                    name="startWall"
                    register={register}
                    setValue={setValue}
                    rules={{required: true}}
                />

                {errors.color && errors.color.type === "required" &&
                <span className="form-error">Required</span>
                }
            </div>

            <div className="form-row">
                <RHFInput
                    as={WallSelect({label: "End", options: window.walls})}
                    name="endWall"
                    register={register}
                    setValue={setValue}
                />
            </div>

            <div className="form-row">
                <RHFInput
                    as={SetterSelect()}
                    name="setters"
                    register={register}
                    setValue={setValue}
                    rules={{required: true}}
                />

                {errors.color && errors.color.type === "required" &&
                <span className="form-error">Required</span>
                }
            </div>

            <div className="form-row">
                <RHFInput
                    as={TagSelect()}
                    name="tags"
                    register={register}
                    setValue={setValue}
                />
            </div>

            <div className="form-row">
                <input
                    name="points"
                    placeholder="1000"
                    value="1000"
                    className="form-field"
                    type="number"
                    ref={register({required: true})}/>

                {errors.name && errors.name.type === "required" &&
                <span className="form-error">Required</span>
                }
            </div>

            <div className="form-row">
                <RHFInput
                    as={StatusSelect()}
                    name="status"
                    register={register}
                    setValue={setValue}
                />
            </div>

            <div className="form-row">
                <button type="submit" className="button">Submit</button>
            </div>
        </form>
    );
}