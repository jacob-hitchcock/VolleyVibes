import React,{ useState,useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import '../styles.css'; // Ensure you import your styles

const ReturnToTop = () => {
    const [isVisible,setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if(window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll',toggleVisibility);
        return () => {
            window.removeEventListener('scroll',toggleVisibility);
        };
    },[]);

    return (
        <div className="return-to-top">
            {isVisible && (
                <div onClick={scrollToTop}>
                    <FaArrowUp className="return-to-top-icon" />
                </div>
            )}
        </div>
    );
};

export default ReturnToTop;