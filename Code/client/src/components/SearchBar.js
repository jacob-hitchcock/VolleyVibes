import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ search,handleSearchChange }) => {
    return (
        <div className="search-bar-container">
            <div className="search-input-container">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search players..."
                    value={search}
                    onChange={handleSearchChange}
                />
            </div>
        </div>
    );
};

export default SearchBar;
