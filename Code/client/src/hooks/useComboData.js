import { useState,useEffect } from 'react';
import { calculateMatchups,getSavedCombos,saveCombos } from '../utils/utils';

const useComboData = (players) => {
    const [selectedPlayers,setSelectedPlayers] = useState([]);
    const [matchups,setMatchups] = useState([]);
    const [numberOfCombos,setNumberOfCombos] = useState(0);
    const [generatedCombos,setGeneratedCombos] = useState([]);
    const [playerNumberList,setPlayerNumberList] = useState([]);

    useEffect(() => {
        const { savedMatchups,savedGeneratedCombos,savedPlayerNumberList } = getSavedCombos();
        if(savedMatchups.length > 0) {
            setMatchups(savedMatchups);
        }
        if(savedGeneratedCombos.length > 0) {
            setGeneratedCombos(savedGeneratedCombos);
        }
        if(savedPlayerNumberList.length > 0) {
            setPlayerNumberList(savedPlayerNumberList);
        }
    },[]);

    useEffect(() => {
        saveCombos(matchups,generatedCombos,playerNumberList);
    },[matchups,generatedCombos,playerNumberList]);

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
        setPlayerNumberList([]);
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

            const playerNumberMap = selectedPlayers.reduce((acc,playerId,index) => {
                acc[playerId] = index + 1;
                return acc;
            },{});

            const playerNumberList = selectedPlayers.map(playerId => ({
                playerId,
                number: playerNumberMap[playerId]
            }));

            setGeneratedCombos(selectedCombos);
            setPlayerNumberList(playerNumberList);
        }
    };

    const handleClearCombos = () => {
        setMatchups([]);
        setGeneratedCombos([]);
        setPlayerNumberList([]);
        localStorage.removeItem('matchups');
        localStorage.removeItem('generatedCombos');
        localStorage.removeItem('playerNumberList');
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
        playerNumberList,
        handlePlayerSelect,
        handleGenerateCombos,
        handleSelectNumberOfCombos,
        handleGenerateSelectedCombos,
        handleClearCombos,
        toggleCompleted,
    };
};

export default useComboData;
