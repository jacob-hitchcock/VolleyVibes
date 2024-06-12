// src/components/AddMatch.js
import React,{ useState,useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import TeamSelection from './TeamSelection';

const AddMatch = ({ matches,setMatches,players }) => {
    const [teamA,setTeamA] = useState([]);
    const [teamB,setTeamB] = useState([]);
    const [scoreA,setScoreA] = useState('');
    const [scoreB,setScoreB] = useState('');
    const [date,setDate] = useState('');
    const [location,setLocation] = useState('');
    const [confirmationMessage,setConfirmationMessage] = useState('');

    useEffect(() => {
        if(confirmationMessage) {
            const timer = setTimeout(() => {
                setConfirmationMessage('');
            },15000); // 15 seconds
            return () => clearTimeout(timer);
        }
    },[confirmationMessage]);

    const handlePlayerSelection = (e,team) => {
        const { value,checked } = e.target;
        if(team === 'A') {
            setTeamA(checked ? [...teamA,value] : teamA.filter(player => player !== value));
        } else {
            setTeamB(checked ? [...teamB,value] : teamB.filter(player => player !== value));
        }
    };

    const handleMatchSubmit = (e) => {
        e.preventDefault();
        // Adjust for local timezone offset
        const localDate = new Date(date);
        localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());

        const match = {
            teams: [teamA,teamB],
            scores: [scoreA,scoreB],
            date: localDate.toISOString(), // Convert adjusted date to UTC
            location,
        };

        axiosInstance.post('/matches',match)
            .then(response => {
                setMatches([...matches,response.data]);
                setTeamA([]);
                setTeamB([]);
                setScoreA('');
                setScoreB('');
                setDate('');
                setLocation('');
                setConfirmationMessage('Match added successfully.');
            })
            .catch(error => console.error('Error adding match:',error));
    };

    return (
        <div>
            <h3>Add Match</h3>
            <form onSubmit={handleMatchSubmit} className="bodycontent">
                <TeamSelection
                    teamA={teamA}
                    teamB={teamB}
                    players={players}
                    handlePlayerSelection={handlePlayerSelection}
                />
                <div className="match-details">
                    <input
                        type="number"
                        name="scoreA"
                        placeholder="Score Team A"
                        value={scoreA}
                        onChange={(e) => setScoreA(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        name="scoreB"
                        placeholder="Score Team B"
                        value={scoreB}
                        onChange={(e) => setScoreB(e.target.value)}
                        required
                    />
                    <select
                        name="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Location</option>
                        <option value="Grass">Grass</option>
                        <option value="Beach">Beach</option>
                        <option value="Indoor Court">Indoor Court</option>
                    </select>
                    <input
                        type="date"
                        name="date"
                        placeholder="Date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <button type="submit">Add Match</button>
                </div>
            </form>
            {confirmationMessage && (
                <p className="admin-confirm">{confirmationMessage}</p>
            )}
        </div>
    );
};

export default AddMatch;
