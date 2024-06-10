import React,{ useState } from 'react';
import Dropdown from './Dropdown';
import '../styles.css';

const FilterBar = ({
    winners,
    losers,
    filterWinners,
    setFilterWinners,
    filterLosers,
    setFilterLosers,
    filterDate,
    setFilterDate,
    availableLocations,
    filterLocations,
    setFilterLocations,
    resetFilters,
}) => {
    const [openDropdown,setOpenDropdown] = useState(null);

    const hasActiveFilters = (filters) => filters.length > 0;
    const isDateFilterActive = filterDate !== '';

    const activeFilters = [
        ...filterWinners.map(id => winners.find(w => w._id === id)?.name),
        ...filterLosers.map(id => losers.find(l => l._id === id)?.name),
        ...(filterDate ? [`Date: ${filterDate}`] : []),
        ...filterLocations.map(location => location),
    ];

    const handleToggle = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    const closeAllDropdowns = () => {
        setOpenDropdown(null);
    };

    return (
        <div className="filter-bar">
            <div className="filter-group">
                <Dropdown
                    label="Winners"
                    items={winners}
                    selectedItems={filterWinners}
                    setSelectedItems={setFilterWinners}
                    isActive={hasActiveFilters(filterWinners)}
                    isOpen={openDropdown === 'winners'}
                    onToggle={() => handleToggle('winners')}
                />
                <Dropdown
                    label="Losers"
                    items={losers}
                    selectedItems={filterLosers}
                    setSelectedItems={setFilterLosers}
                    isActive={hasActiveFilters(filterLosers)}
                    isOpen={openDropdown === 'losers'}
                    onToggle={() => handleToggle('losers')}
                />
                <div className={'loco'}>
                    <Dropdown
                        label="Locations"
                        items={availableLocations.map(location => ({ _id: location,name: location }))}
                        selectedItems={filterLocations}
                        setSelectedItems={setFilterLocations}
                        isActive={hasActiveFilters(filterLocations)}
                        isOpen={openDropdown === 'locations'}
                        onToggle={() => handleToggle('locations')}
                    />
                </div>
                <div className={`filter-date ${isDateFilterActive ? 'active' : ''}`}>
                    <input
                        id="filter-date"
                        type="date"
                        className="date-input"
                        value={filterDate}
                        onChange={(e) => {
                            setFilterDate(e.target.value);
                            closeAllDropdowns();
                        }}
                    />
                </div>
            </div>
            <div className="filter-controls">
                <button className="reset-button" onClick={() => {
                    resetFilters();
                    closeAllDropdowns();
                }}>Reset Filters</button>
            </div>
        </div>
    );
};

export default FilterBar;
