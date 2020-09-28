import {useLocation} from "react-router-dom";

export const serialize = (object) => Object.keys(object)
  .map(key => `${key}=${object[key]}`)
  .join('&');

const useQueryParameters = () => {
  return new URLSearchParams(useLocation().search);
};

export default useQueryParameters;
