import React from 'react';

const ComboControls = ({
    numberOfCombos,
    handleSelectNumberOfCombos,
    handleGenerateSelectedCombos,
    handleClearCombos,
}) => (
    <div>
        <label>
            Number of Combos:
            <input type="number" value={numberOfCombos} onChange={handleSelectNumberOfCombos} />
        </label>
        <button onClick={handleGenerateSelectedCombos}>Generate Selected Combos</button>
        <button style={{ marginLeft: 10 }} onClick={handleClearCombos}>Clear Combos</button>
    </div>
);

export default ComboControls;