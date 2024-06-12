import { useState,useEffect } from 'react';
import { calculateMatchups,getSavedCombos,saveCombos } from '../utils/utils';

const useComboData = (players) => {
    const [selectedPlayers,setSelectedPlayers] = useState([]);
    const [matchups,setMatchups] = useState([]);
    const [numberOfCombos,setNumberOfCombos] = useState(0);
    const [generatedCombos,setGeneratedCombos] = useState([]);

    useEffect(() => {
        const { savedMatchups,savedGeneratedCombos } = getSavedCombos();
        if(savedMatchups.length > 0) {
            setMatchups(savedMatchups);
        }
        if(savedGeneratedCombos.length > 0) {
            setGeneratedCombos(savedGeneratedCombos);
        }
    },[]);

    useEffect(() => {
        saveCombos(matchups,generatedCombos);
    },[matchups,generatedCombos]);

    const handlePlayerSelect = (playerId) => {
        setSelectedPlayers((prevSelected) =>
            prevSelected.includes(playerId)
                ? prevSelected.filter((id) => id !== playerId)
                : [...prevSelected,playerId]
        );
    };

    const handleGenerateCombos = () => {
        if(!players || players.length === 0) {
            console.error('No players available for generating combos.');
            return;
        }
        const combos = calculateMatchups(selectedPlayers,players);
        setMatchups(combos);
        setGeneratedCombos([]);
    };

    const handleSelectNumberOfCombos = (e) => {
        const value = parseInt(e.target.value,10);
        setNumberOfCombos(value);
    };

    const handleGenerateSelectedCombos = () => {
        if(matchups.length > 0 && numberOfCombos > 0) {
            const selectedCombos = matchups.sort(() => 0.5 - Math.random()).slice(0,numberOfCombos);
            setGeneratedCombos(selectedCombos);
        }
    };

    const handleClearCombos = () => {
        setMatchups([]);
        setGeneratedCombos([]);
        localStorage.removeItem('matchups');
        localStorage.removeItem('generatedCombos');
    };

    const toggleCompleted = (index) => {
        const updatedCombos = [...generatedCombos];
        updatedCombos[index].completed = !updatedCombos[index].completed;
        setGeneratedCombos(updatedCombos);
    };

    return {
        selectedPlayers,
        matchups,
        numberOfCombos,
        generatedCombos,
        handlePlayerSelect,
        handleGenerateCombos,
        handleSelectNumberOfCombos,
        handleGenerateSelectedCombos,
        handleClearCombos,
        toggleCompleted,
    };
};

export default useComboData;