import React from 'react';

const SearchBar = ({ search,handleSearchChange }) => {
    return (
        <div className="search-bar-container">
            <div className="search-input-container">
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