export const extractErrorMessage = (error) => {
  console.error(error);

  if (!error.response) {
    return null;
  }

  const { data } = error.response;

  console.log(data);
  // todo improve messages

  if (data.type === "formError") {
    return Object.values(error.response.data.errors)
      .map((message) => `⚠️ ${message}`)
      .join("\n");
  }

  return data.message;
};
