import React,{ useState,useEffect } from 'react';
import useFetchData from '../hooks/useFetchData';
import useComboData from '../hooks/useComboData';
import useFilters from '../hooks/useFilters';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import PlayerCheckboxList from '../components/PlayerCheckboxList';
import SkeletonPlayerCheckboxList from '../components/SkeletonPlayerCheckboxList';
import MatchupList from '../components/MatchupList';
import ComboControls from '../components/ComboControls';
import CrossReferenceGrid from '../components/CrossReferenceGrid';
import PlayerNumberList from '../components/PlayerNumberList';
import Button from '@mui/material/Button';
import '../styles.css';
import { calculateTeamStats,predictOutcome } from '../utils/predictionUtils'; // Ensure the correct path

const Combos = () => {
    const { players,matches,loading,error } = useFetchData();
    const {
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
    } = useComboData(players);
    const { aggregatedPlayerStats } = useFilters(matches,players);
    const [generatingCombos,setGeneratingCombos] = useState(false);
    const [predictions,setPredictions] = useState([]);

    const noop = () => { }; // No operation function for possible matchups

    const isOddPlayers = selectedPlayers.length % 2 !== 0;

    const handleGenerateCombosWithLoading = async () => {
        setGeneratingCombos(true);
        await handleGenerateCombos();
        setGeneratingCombos(false);
    };

    const getMatchupPredictions = () => {
        return generatedCombos.map((matchup,index) => {

            const teamAStats = calculateTeamStats(matchup.teamA,aggregatedPlayerStats);
            const teamBStats = calculateTeamStats(matchup.teamB,aggregatedPlayerStats);

            return predictOutcome(teamAStats,teamBStats);
        });
    };


    useEffect(() => {
        if(generatedCombos.length > 0 && aggregatedPlayerStats.length > 0) {
            const newPredictions = getMatchupPredictions();
            setPredictions(newPredictions);
        }
    },[generatedCombos,aggregatedPlayerStats]);

    if(error) {
        return <div className="error-message">Error loading players. Please try again later.</div>;
    }

    return (
        <div>
            <NavBar />
            <div className="combos-page">
                <h2 className="leader-title">Combination Generator</h2>
                <h3>Select Players for Combos</h3>
                {loading ? (
                    <SkeletonPlayerCheckboxList />
                ) : (
                        <PlayerCheckboxList
                            players={players}
                            selectedPlayers={selectedPlayers}
                            handlePlayerSelect={handlePlayerSelect}
                        />
                    )}
                <Button
                    sx={{
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
                    onClick={handleGenerateCombosWithLoading}
                    disabled={loading || generatingCombos || selectedPlayers.length < 2}
                >
                    {generatingCombos ? 'Generating...' : 'Generate Combos'}
                </Button>
                <ComboControls
                    numberOfCombos={numberOfCombos}
                    handleSelectNumberOfCombos={handleSelectNumberOfCombos}
                    handleGenerateSelectedCombos={handleGenerateSelectedCombos}
                    handleClearCombos={handleClearCombos}
                />
                <div className="combo-results">
                    <PlayerNumberList playerNumbers={playerNumbers} />
                    <CrossReferenceGrid
                        playerNumbers={playerNumbers}
                        crossReferenceGrid={crossReferenceGrid}
                        cvArray={cvArray}
                        overallCV={overallCV}
                        teamACounts={teamACounts}
                        teamAStdDev={teamAStdDev}
                        isOddPlayers={isOddPlayers}
                    />
                </div>
                {generatedCombos.length === 0 && matchups.length > 0 && (
                    <div>
                        <h3 className="num-matchups">Total Possible Matchups: {matchups.length}</h3>
                        <MatchupList matchups={matchups} toggleCompleted={noop} isGenerated={false} />
                    </div>
                )}
                {generatedCombos.length > 0 && (
                    <div>
                        <h3>Selected Matchups</h3>
                        <MatchupList
                            matchups={generatedCombos}
                            toggleCompleted={toggleCompleted}
                            isGenerated={true}
                            predictions={predictions} // Pass predictions to MatchupList
                        />
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Combos;
