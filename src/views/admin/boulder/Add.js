import React from 'react';
import useForm from 'react-hook-form';
import {RHFInput} from "react-hook-form-input";
import {
    ColorSelect,
    GradeSelect,
    SetterSelect,
    TagSelect,
    WallSelect,
    StatusSelect
} from "../../../components/common/formHelpers";

export const BoulderForm = (props) => {
    const {register, handleSubmit, errors, setValue} = useForm();

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
                    register={register}
                    setValue={setValue}
                />
            </div>

            <div className="form-row">
                <button type="submit" className="button">Submit</button>
            </div>
        </form>
    );
};

class Add extends React.Component {

    handleSubmit(data) {
        // normalize select values
        data.grade = data.grade.value;
        data.color = data.color.value;
        data.startWall = data.startWall.value;
        data.endWall = data.endWall.value;

        fetch("/boulder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)

        }).then(function (response) {

        });

    }

    render() {
        return (
            <div>
                <BoulderForm onSubmit={this.handleSubmit}/>
            </div>
        )
    }
}

export default Add;