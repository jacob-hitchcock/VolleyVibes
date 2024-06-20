import React,{ useState,useEffect } from 'react';
import useFilters from '../hooks/useFilters';
import useFetchData from '../hooks/useFetchData';
import { PieChart,Pie,Cell,Tooltip,Legend } from 'recharts';
import { Grid,Radio,FormControlLabel,RadioGroup,Button,FormControl,FormLabel } from '@mui/material';
import '../styles.css'; // Ensure you have your custom styles included
import NavBar from '../components/NavBar';

const MatchupPredictor = () => {
    const { players,matches,loading,error } = useFetchData();
    const { aggregatedPlayerStats } = useFilters(matches,players);
    const [teamA,setTeamA] = useState([]);
    const [teamB,setTeamB] = useState([]);
    const [prediction,setPrediction] = useState(null);

    useEffect(() => {
        console.log('Aggregated Player Stats:',aggregatedPlayerStats);
    },[aggregatedPlayerStats]);

    const handleAddPlayerToTeam = (player,teamSetter,otherTeamSetter,team,otherTeam) => {
        if(!team.includes(player)) {
            teamSetter([...team,player]);
            otherTeamSetter(otherTeam.filter(p => p._id !== player._id));
        }
    };

    const normalizeValue = (value,maxValue) => value / maxValue;

    const calculateTeamStrength = (team) => {
        const teamStats = team.map(player => aggregatedPlayerStats.find(p => p._id === player._id));

        const totalGames = teamStats.reduce((acc,player) => acc + player.gamesPlayed,0);
        const totalWins = teamStats.reduce((acc,player) => acc + player.wins,0);
        const totalPointsFor = teamStats.reduce((acc,player) => acc + player.pointsFor,0);
        const totalPointsAgainst = teamStats.reduce((acc,player) => acc + player.pointsAgainst,0);

        const avgWinningPercentage = totalGames ? totalWins / totalGames : 0;
        const avgPointDifferential = totalGames ? (totalPointsFor - totalPointsAgainst) / totalGames : 0;

        const normalizedWinningPercentage = normalizeValue(avgWinningPercentage,1);  // Already normalized if expressed as a fraction
        const maxPointDifferential = 1;  // Assuming the point differential is also normalized between 0 and 1
        const normalizedPointDifferential = normalizeValue(avgPointDifferential,maxPointDifferential);

        const baseStrength = (normalizedWinningPercentage + normalizedPointDifferential) / 2;  // Average them to keep within [0, 1]

        return baseStrength;
    };

    const exponentialFunction = (strength,factor = 2) => Math.exp(factor * strength);

    const predictOutcome = (teamAStrength,teamBStrength) => {
        const expStrengthA = exponentialFunction(teamAStrength);
        const expStrengthB = exponentialFunction(teamBStrength);

        const totalExpStrength = expStrengthA + expStrengthB;
        let teamAProbability = totalExpStrength ? expStrengthA / totalExpStrength : 0;
        let teamBProbability = totalExpStrength ? expStrengthB / totalExpStrength : 0;

        teamAProbability = Math.max(0.0001,Math.min(teamAProbability,0.999));
        teamBProbability = Math.max(0.0001,Math.min(teamBProbability,0.999));

        const normalizationFactor = teamAProbability + teamBProbability;
        teamAProbability /= normalizationFactor;
        teamBProbability /= normalizationFactor;

        return {
            teamAProbability,
            teamBProbability,
        };
    };

    const handlePredictOutcome = () => {
        if(aggregatedPlayerStats.length > 0) {
            const teamAStrength = calculateTeamStrength(teamA);
            const teamBStrength = calculateTeamStrength(teamB);
            const result = predictOutcome(teamAStrength,teamBStrength);
            setPrediction(result);
        }
    };

    const handleClearTeams = () => {
        setTeamA([]);
        setTeamB([]);
        setPrediction(null);
    };

    if(loading) return <div>Loading...</div>;
    if(error) return <div>Error loading data.</div>;

    const data = prediction ? [
        { name: 'Team A',value: prediction.teamAProbability * 100 },
        { name: 'Team B',value: prediction.teamBProbability * 100 },
    ] : [];

    const COLORS = ['#0088FE','#FF8042'];

    return (
        <div className="matchup-predictor">
            <NavBar />
            <h1>Matchup Predictor</h1>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <h2>Select Players</h2>
                    {players.map(player => (
                        <div key={player._id} className="player-selection">
                            <FormControl component="fieldset">
                                <FormLabel component="legend">{player.name}</FormLabel>
                                <RadioGroup row>
                                    <FormControlLabel
                                        control={
                                            <Radio
                                                checked={teamA.includes(player)}
                                                onChange={() => handleAddPlayerToTeam(player,setTeamA,setTeamB,teamA,teamB)}
                                                value="teamA"
                                            />
                                        }
                                        label="Team A"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Radio
                                                checked={teamB.includes(player)}
                                                onChange={() => handleAddPlayerToTeam(player,setTeamB,setTeamA,teamB,teamA)}
                                                value="teamB"
                                            />
                                        }
                                        label="Team B"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    ))}
                </Grid>
                <Grid item xs={12} md={4}>
                    <h2>Teams</h2>
                    <div className="team-container">
                        <div>
                            <h3>Team A</h3>
                            {teamA.map(player => (
                                <div key={player._id}>{player.name}</div>
                            ))}
                        </div>
                        <div>
                            <h3>Team B</h3>
                            {teamB.map(player => (
                                <div key={player._id}>{player.name}</div>
                            ))}
                        </div>
                    </div>
                    <Button variant="contained" color="primary" onClick={handlePredictOutcome}>
                        Predict Outcome
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleClearTeams} style={{ marginLeft: '10px' }}>
                        Clear Teams
                    </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                    {prediction && (
                        <div>
                            <h2>Prediction</h2>
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={data}
                                    cx={200}
                                    cy={200}
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry,index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                                <Legend />
                            </PieChart>
                        </div>
                    )}
                </Grid>
            </Grid>
        </div>
    );
};

export default MatchupPredictor;
