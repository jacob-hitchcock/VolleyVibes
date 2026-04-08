// src/hooks/useIntersectionObserver.js
import { useState,useEffect,useRef } from 'react';

/**
 * Tracks whether a DOM element is currently visible within the viewport.
 * Uses the IntersectionObserver API to avoid scroll event listeners.
 *
 * Usage:
 *   const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
 *   return <div ref={ref}>{isVisible ? 'Visible' : 'Hidden'}</div>;
 *
 * IMPORTANT: `elementRef` must be attached to a DOM element via the `ref` prop —
 * the hook will not observe anything until that ref is populated.
 *
 * @param {IntersectionObserverInit} [options] - Options passed to IntersectionObserver.
 * @returns {[React.RefObject, boolean]} A ref to attach to the target element, and its visibility state.
 */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
},[options]);

    return [elementRef,isVisible];
};

export default useIntersectionObserver;
