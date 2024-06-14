import React,{ useState } from 'react';
import Dropdown from './Dropdown';
import '../styles.css';

const FilterBar = ({
    context,
    winners = [],losers = [],
    filterWinners = [],setFilterWinners = () => { },
    filterLosers = [],setFilterLosers = () => { },
    filterMatchDate = '',setFilterMatchDate = () => { },
    // New location filter state
    filterLocations = [],setFilterLocations = () => { },
    filterDate = '',setFilterDate = () => { },
    filterPlayerDate = '',setFilterPlayerDate = () => { },
    filterPlayerLocations = [],setFilterPlayerLocations = () => { },
    availableLocations = [],
    resetFilters = () => { },
}) => {
    const [openDropdown,setOpenDropdown] = useState(null);

    const handleToggle = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    const closeAllDropdowns = () => {
        setOpenDropdown(null);
    };

    return (
        <div className="filter-bar">
            <div className="filter-group">
                {context === 'matches' && (
                    <>
                        <Dropdown
                            label="Winners"
                            items={winners}
                            selectedItems={filterWinners}
                            setSelectedItems={setFilterWinners}
                            isActive={filterWinners.length > 0}
                            isOpen={openDropdown === 'winners'}
                            onToggle={() => handleToggle('winners')}
                        />
                        <Dropdown
                            label="Losers"
                            items={losers}
                            selectedItems={filterLosers}
                            setSelectedItems={setFilterLosers}
                            isActive={filterLosers.length > 0}
                            isOpen={openDropdown === 'losers'}
                            onToggle={() => handleToggle('losers')}
                        />
                        {/* New Location Filter */}
                        <Dropdown
                            label="Locations"
                            items={availableLocations.map(location => ({ _id: location,name: location }))}
                            selectedItems={filterLocations}
                            setSelectedItems={setFilterLocations}
                            isActive={filterLocations.length > 0}
                            isOpen={openDropdown === 'locations'}
                            onToggle={() => handleToggle('locations')}
                        />
                        {/* New Date Filter */}
                        <div className="filter-date">
                            <input
                                id="filter-date"
                                type="date"
                                className="date-input"
                                value={filterDate}
                                onChange={(e) => {
                                    setFilterDate(e.target.value);
                                    closeAllDropdowns();
                                    console.log('Date selected:',e.target.value);
                                }}
                            />
                        </div>
                    </>
                )}
                {context === 'adminMatches' && (
                    <div className="filter-date">
                        <input
                            id="filter-date"
                            type="date"
                            className="date-input"
                            value={filterDate}
                            onChange={(e) => {
                                setFilterMatchDate(e.target.value);
                                closeAllDropdowns();
                                console.log('Admin date selected:',e.target.value);
                            }}
                        />
                    </div>
                )}
                {context === 'players' && (
                    <>
                        <Dropdown
                            label="Locations"
                            items={availableLocations.map(location => ({ _id: location,name: location }))}
                            selectedItems={filterPlayerLocations}
                            setSelectedItems={setFilterPlayerLocations}
                            isActive={filterPlayerLocations.length > 0}
                            isOpen={openDropdown === 'locations'}
                            onToggle={() => handleToggle('locations')}
                        />
                        <div className="filter-date">
                            <input
                                id="filter-date"
                                type="date"
                                className="date-input"
                                value={filterPlayerDate}
                                onChange={(e) => {
                                    setFilterPlayerDate(e.target.value);
                                    closeAllDropdowns();
                                    console.log('Player date selected:',e.target.value);
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
            <div className="filter-controls">
                <button className="reset-button" onClick={() => {
                    resetFilters();
                    closeAllDropdowns();
                    setFilterLocations([]); // Reset location filter
                    setFilterDate(''); // Reset date filter
                    console.log('Filters reset');
                }}>Reset Filters</button>
            </div>
        </div>
    );
};

export default FilterBar;
