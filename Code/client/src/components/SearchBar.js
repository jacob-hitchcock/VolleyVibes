// src/components/SearchBar.js
import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ search,handleSearchChange,toggleSearchVisibility,searchVisible }) => {
    return (
        <div className="search-bar">
            <button onClick={toggleSearchVisibility}>
                <FaSearch />
            </button>
            {searchVisible && (
                <input
                    type="text"
                    placeholder="Search players..."
                    value={search}
                    onChange={handleSearchChange}
                />
            )}
        </div>
    );
};

export default SearchBar;
