import React,{ useState,useEffect } from 'react';
import useFilters from '../hooks/useFilters';
import useFetchData from '../hooks/useFetchData';
import { PieChart,Pie,Cell,Tooltip,Legend } from 'recharts';
import { Grid,Radio,FormControlLabel,RadioGroup,Button,FormControl,FormLabel } from '@mui/material';
import '../styles.css'; // Ensure you have your custom styles included
import NavBar from '../components/NavBar';
import * as ss from 'simple-statistics';

const MatchupPredictor = () => {
    const { players,matches,loading,error } = useFetchData();
    const { aggregatedPlayerStats } = useFilters(matches,players);
    const [teamA,setTeamA] = useState([]);
    const [teamB,setTeamB] = useState([]);
    const [prediction,setPrediction] = useState(null);
    const [accuracy,setAccuracy] = useState(null);

    useEffect(() => {
        console.log('matches:',matches);
        if(matches.length > 0 && aggregatedPlayerStats.length > 0) {
            trainAndEvaluateModel();
        }
    },[matches,aggregatedPlayerStats]);

    const handleAddPlayerToTeam = (player,teamSetter,otherTeamSetter,team,otherTeam) => {
        if(!team.includes(player)) {
            teamSetter([...team,player]);
            otherTeamSetter(otherTeam.filter(p => p._id !== player._id));
        }
    };

    const calculateTeamStats = (team) => {
        const teamStats = team.map(player => aggregatedPlayerStats.find(p => p._id === player._id));

        const totalGames = teamStats.reduce((acc,player) => acc + player.gamesPlayed,0);
        const totalWins = teamStats.reduce((acc,player) => acc + player.wins,0);
        const totalPointsFor = teamStats.reduce((acc,player) => acc + player.pointsFor,0);
        const totalPointsAgainst = teamStats.reduce((acc,player) => acc + player.pointsAgainst,0);

        const avgWinningPercentage = totalGames ? totalWins / totalGames : 0;
        const avgPointDifferential = totalGames ? (totalPointsFor - totalPointsAgainst) / totalGames : 0;

        return {
            avgWinningPercentage,
            avgPointDifferential,
        };
    };

    const logisticFunction = (z) => 1 / (1 + Math.exp(-z));

    const predictOutcome = (teamAStats,teamBStats) => {
        // Use coefficients from your logistic regression model
        const coefficients = {
            intercept: -1.5, // Example value
            winPercentage: 2.5, // Example value
            pointDifferential: 0.8, // Example value
        };

        const zA = coefficients.intercept
            + coefficients.winPercentage * teamAStats.avgWinningPercentage
            + coefficients.pointDifferential * teamAStats.avgPointDifferential;

        const zB = coefficients.intercept
            + coefficients.winPercentage * teamBStats.avgWinningPercentage
            + coefficients.pointDifferential * teamBStats.avgPointDifferential;

        const probA = logisticFunction(zA);
        const probB = logisticFunction(zB);

        const totalProb = probA + probB;

        return {
            teamAProbability: probA / totalProb,
            teamBProbability: probB / totalProb,
        };
    };

    const handlePredictOutcome = () => {
        if(aggregatedPlayerStats.length > 0) {
            const teamAStats = calculateTeamStats(teamA);
            const teamBStats = calculateTeamStats(teamB);
            const result = predictOutcome(teamAStats,teamBStats);
            setPrediction(result);
        }
    };

    const handleClearTeams = () => {
        setTeamA([]);
        setTeamB([]);
        setPrediction(null);
    };

    const normalizeData = (data) => {
        const features = data.map(d => d.features);
        const flatFeatures = features.flat();
        const mean = ss.mean(flatFeatures);
        const std = ss.standardDeviation(flatFeatures);

        return data.map(d => ({
            features: d.features.map(f => (f - mean) / std),
            label: d.label,
        }));
    };

    const trainAndEvaluateModel = () => {
        const data = matches.map(match => {
            const team1Stats = calculateTeamStats(match.teams[0].map(id => ({ _id: id })));
            const team2Stats = calculateTeamStats(match.teams[1].map(id => ({ _id: id })));
            const label = match.scores[0] > match.scores[1] ? 1 : 0;
            return {
                features: [
                    team1Stats.avgWinningPercentage,
                    team1Stats.avgPointDifferential,
                    team2Stats.avgWinningPercentage,
                    team2Stats.avgPointDifferential,
                ],
                label,
            };
        });

        const normalizedData = normalizeData(data);

        const splitIndex = Math.floor(normalizedData.length * 0.8);
        const trainingData = normalizedData.slice(0,splitIndex);
        const testData = normalizedData.slice(splitIndex);

        const features = trainingData.map(d => d.features);
        const labels = trainingData.map(d => d.label);

        // Train the logistic regression model
        const learningRate = 0.01;
        const iterations = 5000;
        const coeffs = new Array(5).fill(0); // Intercept + 4 features

        for(let i = 0;i < iterations;i++) {
            const gradients = new Array(5).fill(0);
            for(let j = 0;j < features.length;j++) {
                const x = features[j];
                const y = labels[j];
                const z = coeffs[0] + x.reduce((acc,xi,k) => acc + xi * coeffs[k + 1],0);
                const pred = logisticFunction(z);
                const error = pred - y;
                gradients[0] += error;
                for(let k = 0;k < x.length;k++) {
                    gradients[k + 1] += error * x[k];
                }
            }
            for(let k = 0;k < coeffs.length;k++) {
                coeffs[k] -= (learningRate / features.length) * gradients[k];
            }
        }

        // Evaluate the model
        const testFeatures = testData.map(d => d.features);
        const testLabels = testData.map(d => d.label);
        const predictions = testFeatures.map(f => {
            const z = coeffs[0] + f.reduce((acc,xi,k) => acc + xi * coeffs[k + 1],0);
            return logisticFunction(z) > 0.5 ? 1 : 0;
        });

        const accuracy = ss.mean(predictions.map((p,i) => (p === testLabels[i] ? 1 : 0)));
        setAccuracy(accuracy);
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
