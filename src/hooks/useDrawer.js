import React, {useState, useContext} from 'react';
import {AppContext} from "../App";

const useDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);

    const {disableContent} = useContext(AppContext);

    const open = () => {
        setIsOpen(true);
        // disableContent(true)
    };

    const close = () => {
        setIsOpen(false);
        setIsLoading(true);
    };

    return {
        isOpen: isOpen,
        isLoading: isLoading,
        setLoading: setIsLoading,
        setData: setData,
        data: data,
        open: open,
        close: close,
    }
};

export default useDrawer