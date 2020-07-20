import { useState } from "react";

const useForm = (initialData = {}) => {
  const [data, setData] = useState(initialData);

  const handleSubmit = (event, callback) => {
    event.preventDefault();

    const data = {};

    for (let [key, value] of new FormData(event.target).entries()) {
      data[key] = value;
    }

    setData(data);
    callback(data);
  };

  return { data, handleSubmit };
};

export default useForm;
