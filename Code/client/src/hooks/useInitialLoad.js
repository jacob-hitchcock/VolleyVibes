// src/hooks/useInitialLoad.js
import { useState,useEffect } from 'react';

/**
 * Returns true for a fixed duration after mount, then false.
 * Used to show skeleton loaders for a minimum display time before revealing content,
 * preventing a flash of unstyled content on fast loads.
 *
 * @param {number} duration - Duration in milliseconds to stay in the "loading" state.
 * @returns {boolean} True while the initial load period is active.
 */
const useInitialLoad = (duration) => {
    const [initialLoad,setInitialLoad] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setInitialLoad(false),duration);
        return () => clearTimeout(timer);
    },[duration]);

    return initialLoad;
};

export default useInitialLoad;
