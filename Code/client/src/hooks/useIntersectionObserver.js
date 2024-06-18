// src/hooks/useIntersectionObserver.js
import { useState,useEffect,useRef } from 'react';

const useIntersectionObserver = (options) => {
    const [isVisible,setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            setIsVisible(entry.isIntersecting);
        },options);

        if(elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if(elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    },[options]);

    return [elementRef,isVisible];
};

export default useIntersectionObserver;