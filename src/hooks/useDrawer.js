import React, {useState} from 'react';

const useDrawer = (defaultPage) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [activePage, setActivePage] = useState(defaultPage);

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        setIsLoading(true);
        setActivePage(defaultPage);
    };

    return {
        isOpen: isOpen,
        isLoading: isLoading,
        setLoading: setIsLoading,
        setData: setData,
        setActivePage: setActivePage,
        activePage: activePage,
        data: data,
        open: open,
        close: close,
    }
};

export default useDrawer