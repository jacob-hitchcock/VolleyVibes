import React from 'react';
import useFetchData from '../hooks/useFetchData';
import useComboData from '../hooks/useComboData';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import PlayerCheckboxList from '../components/PlayerCheckboxList';
import MatchupList from '../components/MatchupList';
import ComboControls from '../components/ComboControls';
import Button from '@mui/material/Button';
import '../styles.css';

const Combos = () => {
    const { players,loading } = useFetchData();
    const {
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
    } = useComboData(players);

    const noop = () => { }; // No operation function for possible matchups

    return (
        <div>
            <NavBar />
            <div className="combos-page">
                <h2 className="leader-title">Combination Generator</h2>
                <h3>Select Players for Combos</h3>
                {loading ? (
                    <p>Loading players...</p>
                ) : (
                        <PlayerCheckboxList
                            players={players}
                            selectedPlayers={selectedPlayers}
                            handlePlayerSelect={handlePlayerSelect}
                        />
                    )}
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
                    onClick={handleGenerateCombos}>Generate Combos</Button>
                <ComboControls
                    numberOfCombos={numberOfCombos}
                    handleSelectNumberOfCombos={handleSelectNumberOfCombos}
                    handleGenerateSelectedCombos={handleGenerateSelectedCombos}
                    handleClearCombos={handleClearCombos}
                />
                {playerNumbers.length > 0 && (
                    <div>
                        <h3>Selected Players and their Numbers</h3>
                        <ul>
                            {playerNumbers
                                .sort((a,b) => a.number - b.number)
                                .map(player => (
                                    <li key={player.id}>
                                        {player.number}. {player.name}
                                    </li>
                                ))}
                        </ul>
                    </div>
                )}
                {generatedCombos.length === 0 && matchups.length > 0 && (
                    <div>
                        <h3 className="num-matchups">Total Possible Matchups: {matchups.length}</h3>
                        <MatchupList
                            matchups={matchups}
                            toggleCompleted={noop}
                            isGenerated={false}
                        />
                    </div>
                )}
                {generatedCombos.length > 0 && (
                    <div>
                        <h3>Selected Matchups</h3>
                        <MatchupList
                            matchups={generatedCombos}
                            toggleCompleted={toggleCompleted}
                            isGenerated={true}
                        />
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Combos;
