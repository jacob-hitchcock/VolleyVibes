// src/hooks/useIntersectionObserver.js
import { useState,useEffect,useRef } from 'react';

const useIntersectionObserver = (options) => {
    const [isVisible,setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
    const element = elementRef.current;
    const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
    },options);
    if(element) {
        observer.observe(element);
    }
    return () => {
        if(element) {
            observer.unobserve(element);
        }
    };
},[options]);

    return [elementRef,isVisible];
};

export default useIntersectionObserver;
