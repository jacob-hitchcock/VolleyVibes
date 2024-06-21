import { useState,useEffect } from 'react';
import { calculateMatchups,getSavedCombos,saveCombos } from '../utils/utils';

const useComboData = (players) => {
    const [selectedPlayers,setSelectedPlayers] = useState([]);
    const [matchups,setMatchups] = useState([]);
    const [numberOfCombos,setNumberOfCombos] = useState(1);
    const [generatedCombos,setGeneratedCombos] = useState([]);
    const [playerNumbers,setPlayerNumbers] = useState([]);
    const [crossReferenceGrid,setCrossReferenceGrid] = useState([]);
    const [cvArray,setCvArray] = useState([]);
    const [overallCV,setOverallCV] = useState(0);
    const [teamACounts,setTeamACounts] = useState([]);
    const [teamAStdDev,setTeamAStdDev] = useState(0);

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
        saveCombos(matchups,generatedCombos,playerNumbers,crossReferenceGrid);
    },[matchups,generatedCombos,playerNumbers]);

    useEffect(() => {
        if(generatedCombos.length > 0) {
            calculateCrossReferenceGrid();
        }
    },[generatedCombos]);

    const handlePlayerSelect = (playerId) => {
        setSelectedPlayers((prevSelected) =>
            prevSelected.includes(playerId)
                ? prevSelected.filter((id) => id !== playerId)
                : [...prevSelected,playerId]
        );
        setCrossReferenceGrid([]);
        setCvArray([]);
        setOverallCV([]);
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
        setCrossReferenceGrid([]);
        setCvArray([]);
        setOverallCV([]);
        setTeamACounts([]);
        setTeamAStdDev(0);
        localStorage.removeItem('matchups');
        localStorage.removeItem('generatedCombos');
        localStorage.removeItem('numberedPlayers');
        localStorage.removeItem('cvArray');
        localStorage.removeItem('overallCV');
    };

    const toggleCompleted = (index) => {
        const updatedCombos = [...generatedCombos];
        updatedCombos[index].completed = !updatedCombos[index].completed;
        setGeneratedCombos(updatedCombos);
    };

    const calculateCrossReferenceGrid = () => {
        const grid = Array(playerNumbers.length)
            .fill(null)
            .map(() => Array(playerNumbers.length).fill(0));

        const teamACounts = Array(playerNumbers.length).fill(0);

        generatedCombos.forEach((combo) => {
            const teamA = combo.teamA;
            const teamB = combo.teamB;

            teamA.forEach((playerA) => {
                teamA.forEach((playerB) => {
                    if(playerA !== playerB) {
                        grid[playerA.number - 1][playerB.number - 1]++;
                    }
                });
            });

            teamB.forEach((playerA) => {
                teamB.forEach((playerB) => {
                    if(playerA !== playerB) {
                        grid[playerA.number - 1][playerB.number - 1]++;
                    }
                });
            });

            if(teamA.length !== teamB.length) {
                teamA.forEach((player) => {
                    teamACounts[player.number - 1]++;
                });
            }
        });

        const cvArray = grid.map((counts,index) => {
            const filteredCounts = counts.filter((_,i) => i !== index);
            const mean = filteredCounts.reduce((sum,count) => sum + count,0) / filteredCounts.length;
            const variance = filteredCounts.reduce((sum,count) => sum + Math.pow(count - mean,2),0) / filteredCounts.length;
            const standardDeviation = Math.sqrt(variance);
            const cv = mean === 0 ? 0 : (standardDeviation / mean) * 10;
            return cv;
        });

        const allCounts = grid.flat().filter((count,index) => {
            const row = Math.floor(index / playerNumbers.length);
            const col = index % playerNumbers.length;
            return row !== col;
        });
        const overallMean = allCounts.reduce((sum,count) => sum + count,0) / allCounts.length;
        const overallVariance = allCounts.reduce((sum,count) => sum + Math.pow(count - overallMean,2),0) / allCounts.length;
        const overallStandardDeviation = Math.sqrt(overallVariance);
        const overallCV = overallMean === 0 ? 0 : (overallStandardDeviation / overallMean) * 10;

        const teamAMean = teamACounts.reduce((sum,count) => sum + count,0) / teamACounts.length;
        const teamAVariance = teamACounts.reduce((sum,count) => sum + Math.pow(count - teamAMean,2),0) / teamACounts.length;
        const teamAStdDev = Math.sqrt(teamAVariance);

        setCrossReferenceGrid(grid);
        setCvArray(cvArray);
        setOverallCV(overallCV);
        setTeamACounts(teamACounts);
        setTeamAStdDev(teamAStdDev);
    };

    return {
        selectedPlayers,
        matchups,
        numberOfCombos,
        generatedCombos,
        playerNumbers,
        crossReferenceGrid,
        cvArray,
        overallCV,
        teamACounts,
        teamAStdDev,
        handlePlayerSelect,
        handleGenerateCombos,
        handleSelectNumberOfCombos,
        handleGenerateSelectedCombos,
        handleClearCombos,
        toggleCompleted,
    };
};

export default useComboData;
