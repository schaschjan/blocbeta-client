export default (error, logOnly = false) => {

  if (!error.response) {
    console.error(error);
    return
  }

  if (error.response.data.code === 401 && error.response.data.message === "JWT Token not found") {
    window.location.pathname = "/login"
  }

  if (error.response.data.code === 401) {
    alert("Invalid credentials");
  }

  if (error.response.data.code === 404) {
    alert("Not found");
  }

  if (error.response.data.type === "formError") {
    alert(Object.values(error.response.data.errors).map(message => `⚠️ ${message}`).join('\n'));
  }

  alert(error.response.data.message);
};