// src/hooks/useInitialLoad.js
import { useState,useEffect } from 'react';

const useInitialLoad = (duration) => {
    const [initialLoad,setInitialLoad] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setInitialLoad(false),duration);
        return () => clearTimeout(timer);
    },[duration]);

    return initialLoad;
};

export default useInitialLoad;
