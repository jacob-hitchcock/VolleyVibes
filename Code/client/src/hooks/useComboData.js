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
            const playerNumberMap = {};
            const shuffledPlayers = [...selectedPlayers].sort(() => 0.5 - Math.random());

            shuffledPlayers.forEach((playerId,index) => {
                playerNumberMap[playerId] = index + 1;
            });

            const playerNumberList = shuffledPlayers.map(playerId => ({
                playerId,
                number: playerNumberMap[playerId]
            }));

            const selectedCombos = matchups
                .sort(() => 0.5 - Math.random())
                .slice(0,numberOfCombos)
                .map((combo) => {
                    const teamA = combo.teamA.map(playerId => ({
                        playerId,
                        number: playerNumberMap[playerId]
                    }));
                    const teamB = combo.teamB.map(playerId => ({
                        playerId,
                        number: playerNumberMap[playerId]
                    }));
                    return { teamA,teamB,completed: combo.completed };
                });

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
