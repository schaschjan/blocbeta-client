import {useLocation} from "react-router-dom";

const useQueryParameters = () => {
  return new URLSearchParams(useLocation().search);
};

export default useQueryParameters;
