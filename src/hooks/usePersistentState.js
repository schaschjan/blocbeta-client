import React, {useEffect} from 'react';

const usePersistentState = (key, defaultValue) => {
    const [state, setState] = React.useState(
        JSON.parse(localStorage.getItem(key)) || defaultValue
    );

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
};

export default usePersistentState