import Context from "../Context";
import {useHistory} from "react-router-dom";

export const handleLogout = (event) => {
    event.preventDefault();
    Context.storage.clear();

    alert();
};
