import React from 'react';

const useClickOutside = (elementRef, callback) => {
    const callbackRef = React.useRef();
    callbackRef.current = callback;

    React.useEffect(() => {
        const handleClickOutside = event => {
            if (elementRef.current && !elementRef.current.contains(event.target) && callbackRef.current) {
                callbackRef.current(event)
            }
        };

        document.addEventListener('click', handleClickOutside, true);

        return () => {
            document.removeEventListener('click', handleClickOutside, true)
        }

    }, [callbackRef, elementRef]);
};

export default useClickOutside