import React, {useContext} from 'react';
import {AppContext} from "../App";

const useContextualizedPath = (path) => {
    const {location} = useContext(AppContext);
    return `/${location.url}${path}`;
};

export default useContextualizedPath