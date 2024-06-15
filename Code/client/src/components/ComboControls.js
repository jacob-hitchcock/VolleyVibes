import React from 'react';
import Button from '@mui/material/Button';

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
        <Button sx={{
            backgroundColor: '#E7552B',
            color: '#fff5d6',
            border: 'none',
            fontFamily: 'Coolvetica',
            textTransform: 'none',
            height: '50px',
            borderRadius: '10px',
            fontSize: '14px',
            cursor: 'pointer',
            margin: '10px 0',
            '&:hover': {
                backgroundColor: '#e03e00',
            },
        }}
            onClick={handleGenerateSelectedCombos}>Generate Selected Combos</Button>
        <Button sx={{
            backgroundColor: '#E7552B',
            color: '#fff5d6',
            border: 'none',
            fontFamily: 'Coolvetica',
            textTransform: 'none',
            height: '50px',
            borderRadius: '10px',
            fontSize: '14px',
            cursor: 'pointer',
            margin: '10px 0',
            '&:hover': {
                backgroundColor: '#e03e00',
            },
        }}
            onClick={handleClearCombos}>Clear Combos</Button>
    </div>
);

export default ComboControls;