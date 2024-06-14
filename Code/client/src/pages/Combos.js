import React,{ useEffect } from 'react';
import useFetchData from '../hooks/useFetchData';
import useComboData from '../hooks/useComboData';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import PlayerCheckboxList from '../components/PlayerCheckboxList';
import MatchupList from '../components/MatchupList';
import ComboControls from '../components/ComboControls';
import '../styles.css';

const Combos = () => {
    const { players,loading } = useFetchData();
    const {
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
                <button onClick={handleGenerateCombos}>Generate Combos</button>
                <ComboControls
                    numberOfCombos={numberOfCombos}
                    handleSelectNumberOfCombos={handleSelectNumberOfCombos}
                    handleGenerateSelectedCombos={handleGenerateSelectedCombos}
                    handleClearCombos={handleClearCombos}
                />
                {playerNumberList.length > 0 && (
                    <div>
                        <h3>Player Number Assignments</h3>
                        <ul>
                            {playerNumberList.map(({ playerId,number }) => {
                                const player = players.find(player => player._id === playerId);
                                return (
                                    <li key={playerId}>
                                        {player ? `${player.name}: ${number}` : `Unknown Player (ID: ${playerId}): ${number}`}
                                    </li>
                                );
                            })}
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
