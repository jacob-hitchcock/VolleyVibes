// src/components/AnimatedChartWrapper.js
import React from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const AnimatedChartWrapper = ({ children }) => {
    const [elementRef,isVisible] = useIntersectionObserver({
        threshold: 0.1, // Adjust the threshold as needed
    });

    return (
        <div ref={elementRef}>
            {React.cloneElement(children,{ animate: isVisible })}
        </div>
    );
};

export default AnimatedChartWrapper;