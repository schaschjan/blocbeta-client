import useForm from 'react-hook-form';
import Select from "react-select";
import React, {useState, useEffect} from 'react';

export default function Index() {
    const {register, handleSubmit, setValue} = useForm();
    const onSubmit = data => console.log(data);
    const [values, setReactSelectValue] = useState({selectedOption: [{
            label: 'test',
            value: 'test'
        }]});

    const handleMultiChange = selectedOption => {
        setValue("reactSelect", selectedOption);
        setReactSelectValue({selectedOption});
    }

    const handleChange = (e) => {
        setValue("AntdInput", e.target.value);
    }

    const options = [
        {
            label: 'test',
            value: 'test'
        },
        {
            label: 'test1',
            value: 'test1'
        },
        {
            label: 'test2',
            value: 'test2'
        }
    ];

    useEffect(() => {
        register({name: "reactSelect"}); // custom register react-select
        register({name: "AntdInput"}); // custom register antd input
    }, [register])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Select
                value={values.selectedOption}
                options={options}
                onChange={handleMultiChange}
                isMulti
            />
            <input type="submit"/>
        </form>
    );
}