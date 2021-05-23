export const extractErrorMessage = (error) => {
  console.error(error);

  if (!error.response) {
    return null;
  }

  const { data } = error.response;

  if (data.type === "formError") {
    const errors = error.response.data.errors;
    const fields = Object.keys(errors);

    return fields.map((field) => `${field}: ⚠️ ${errors[field]}`);
  }

  return data.message;
};
