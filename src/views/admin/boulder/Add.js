import React from 'react';
import useForm from 'react-hook-form';

//
// const GradeSelect = (props) => {
//
//     const options = Object.values(window.grades).map(grade => {
//         return {
//             value: grade.id,
//             label: grade.name
//         }
//     });
//
//     return (
//         <div className="form-row">
//             <label htmlFor={"grade"}>{props.label}:</label>
//             <Select
//                 required
//                 name={props.label}
//                 options={options}
//                 onChange={props.onChange}
//                 onBlur={props.onBlur}
//             />
//
//             {!!props.error && props.touched && (
//                 <div style={{color: 'red', marginTop: '.5rem'}}>
//                     {props.error}
//                 </div>
//             )}
//         </div>
//     )
// };
//
// const ColorSelect = (props) => {
//
//     const options = Object.values(window.colors).map(color => {
//         return {
//             value: color.id,
//             label: color.name
//         }
//     });
//
//     return (
//         <div className="form-row">
//             <label htmlFor={"color"}>{props.label}:</label>
//             <Select
//                 name={props.label}
//                 options={options}
//                 onChange={props.onChange}
//                 onBlur={props.onBlur}
//             />
//         </div>
//     )
// };
//
// const WallSelect = (props) => {
//     const options = Object.values(window.walls).map(wall => {
//         return {
//             value: wall.id,
//             label: wall.name
//         }
//     });
//
//     return (
//         <div className="form-row">
//             <label htmlFor={"color"}>{props.label}:</label>
//             <Select
//                 name={props.label}
//                 options={options}
//                 onChange={props.onChange}
//                 onBlur={props.onBlur}
//             />
//         </div>
//     )
// };
//
// const SetterSelect = (props) => {
//     const options = Object.values(window.setters).map(setter => {
//         return {
//             value: setter.id,
//             label: setter.username
//         }
//     });
//
//     return (
//         <div className="form-row">
//             <label htmlFor={props.label}>{props.label}:</label>
//             <Select
//                 name={props.label}
//                 options={options}
//                 isMulti="true"
//                 onChange={props.onChange}
//                 onBlur={props.onBlur}
//             />
//         </div>
//     )
// };
//
// const TagSelect = (props) => {
//     const options = Object.values(window.tags).map(tag => {
//         return {
//             value: tag.id,
//             label: tag.emoji
//         }
//     });
//
//     return (
//         <div className="form-row">
//             <label htmlFor="tags">{props.label}:</label>
//             <Select
//                 name={props.label}
//                 options={options}
//                 isMulti="true"
//                 onChange={props.onChange}
//                 onBlur={props.onBlur}
//             />
//         </div>
//     )
// };

const Form = (props) => {

    const {register, handleSubmit, errors} = useForm();
    const onSubmit = props.onSubmit;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                name="email"
                ref={register({
                    required: 'Required',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "invalid email address"
                    }
                })}
            />
            {errors.email && errors.email.message}

            <input
                name="username"
                ref={register({
                    validate: value => value !== "admin" || "Nice try!"
                })}
            />
            {errors.username && errors.username.message}

            <button type="submit">Submit</button>
        </form>
    );
};

class Add extends React.Component {

    handleSubmit(data) {
        console.log(data);
    }

    render() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit}/>
            </div>
        )
    }
}

export default Add;