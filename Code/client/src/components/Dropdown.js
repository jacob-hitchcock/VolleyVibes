import React from 'react';
import '../styles.css';

const Dropdown = ({ label,items = [],selectedItems = [],setSelectedItems,isActive,isOpen,onToggle }) => {
    const handleCheckboxChange = (e) => {
        const { value,checked } = e.target;
        setSelectedItems(prevItems =>
            checked ? [...prevItems,value] : prevItems.filter(item => item !== value)
        );
    };

    return (
        <div className={`dropdown ${isActive ? 'active' : ''} ${isOpen ? 'open' : ''}`}>
            <button onClick={onToggle} className="dropdown-button">
                {label} <span className="dropdown-icon">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
                <div className="dropdown-content">
                    {items.sort((a,b) => a.name.localeCompare(b.name)).map(item => (
                        <label key={item._id}>
                            <input
                                type="checkbox"
                                value={item._id}
                                checked={selectedItems.includes(item._id)}
                                onChange={handleCheckboxChange}
                            />
                            {item.name}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;