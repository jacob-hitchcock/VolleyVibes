// src/hooks/useToggle.js
import { useState } from 'react';

/**
 * Simple boolean toggle hook.
 * @param {boolean} [initialState=false]
 * @returns {[boolean, Function]} Current state and a function to flip it.
 */
const useToggle = (initialState = false) => {
    const [state,setState] = useState(initialState);

    const toggle = () => {
        setState(!state);
    };

    return [state,toggle];
};

export default useToggle;
