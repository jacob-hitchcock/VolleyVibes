import { useState,useEffect } from 'react';
import { calculateMatchups,getSavedCombos,saveCombos } from '../utils/utils';

const useComboData = (players) => {
    const [selectedPlayers,setSelectedPlayers] = useState([]);
    const [matchups,setMatchups] = useState([]);
    const [numberOfCombos,setNumberOfCombos] = useState(1);
    const [generatedCombos,setGeneratedCombos] = useState([]);
    const [playerNumbers,setPlayerNumbers] = useState([]);

    useEffect(() => {
        const { savedMatchups,savedGeneratedCombos,savedNumberedPlayers } = getSavedCombos();
        if(savedMatchups.length > 0) {
            setMatchups(savedMatchups);
        }
        if(savedGeneratedCombos.length > 0) {
            setGeneratedCombos(savedGeneratedCombos);
        }
        if(savedNumberedPlayers.length > 0) {
            setPlayerNumbers(savedNumberedPlayers);
        }
    },[]);

    useEffect(() => {
        saveCombos(matchups,generatedCombos,playerNumbers);
    },[matchups,generatedCombos,playerNumbers]);

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
        const { matchups,numberedPlayers } = calculateMatchups(selectedPlayers,players);
        setMatchups(matchups);
        setPlayerNumbers(numberedPlayers);
        setGeneratedCombos([]);
    };

    const handleSelectNumberOfCombos = (e) => {
        const value = parseInt(e.target.value,10);
        setNumberOfCombos(value);
    };

    const handleGenerateSelectedCombos = () => {
        if(matchups.length > 0 && numberOfCombos > 0) {
            const totalPlayers = selectedPlayers.length;
            const selectedCombos = matchups
                .sort(() => 0.5 - Math.random())
                .slice(0,numberOfCombos)
                .map((combo) => {
                    // Only flip teams if the number of total players is even
                    if(totalPlayers % 2 === 0) {
                        const flipTeams = Math.random() > 0.5;
                        return flipTeams
                            ? { teamA: combo.teamB,teamB: combo.teamA,completed: combo.completed }
                            : combo;
                    }
                    return combo;
                });

            setGeneratedCombos(selectedCombos);
        }
    };

    const handleClearCombos = () => {
        setMatchups([]);
        setGeneratedCombos([]);
        setPlayerNumbers([]);
        localStorage.removeItem('matchups');
        localStorage.removeItem('generatedCombos');
        localStorage.removeItem('numberedPlayers');
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
        playerNumbers,
        handlePlayerSelect,
        handleGenerateCombos,
        handleSelectNumberOfCombos,
        handleGenerateSelectedCombos,
        handleClearCombos,
        toggleCompleted,
    };
};

export default useComboData;
