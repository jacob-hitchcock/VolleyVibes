import React,{ useState,useEffect } from 'react';
import useFilters from '../hooks/useFilters';
import useFetchData from '../hooks/useFetchData';
import { PieChart,Pie,Cell,Tooltip,Legend } from 'recharts';

const MatchupPredictor = () => {
    const { players,matches,loading,error } = useFetchData();
    const { aggregatedPlayerStats } = useFilters(matches,players);
    const [teamA,setTeamA] = useState([]);
    const [teamB,setTeamB] = useState([]);
    const [prediction,setPrediction] = useState(null);

    useEffect(() => {
        console.log('Aggregated Player Stats:',aggregatedPlayerStats);
    },[aggregatedPlayerStats]);

    const handleAddPlayerToTeam = (player,teamSetter,team) => {
        if(!team.includes(player)) {
            teamSetter([...team,player]);
        }
    };

    const normalizeValue = (value,maxValue) => value / maxValue;

    const calculateTeamStrength = (team) => {
        const teamStats = team.map(player => aggregatedPlayerStats.find(p => p._id === player._id));

        console.log('Team Stats:',teamStats);

        const totalGames = teamStats.reduce((acc,player) => acc + player.gamesPlayed,0);
        const totalWins = teamStats.reduce((acc,player) => acc + player.wins,0);
        const totalPointsFor = teamStats.reduce((acc,player) => acc + player.pointsFor,0);
        const totalPointsAgainst = teamStats.reduce((acc,player) => acc + player.pointsAgainst,0);

        console.log('Total Games:',totalGames);
        console.log('Total Wins:',totalWins);
        console.log('Total Points For:',totalPointsFor);
        console.log('Total Points Against:',totalPointsAgainst);

        const avgWinningPercentage = totalGames ? totalWins / totalGames : 0;
        const avgPointDifferential = totalGames ? (totalPointsFor - totalPointsAgainst) / totalGames : 0;

        console.log('Avg Winning Percentage:',avgWinningPercentage);
        console.log('Avg Point Differential:',avgPointDifferential);

        // Normalize the values to a common scale (0 to 1)
        const normalizedWinningPercentage = normalizeValue(avgWinningPercentage,1);  // Already normalized if expressed as a fraction
        const maxPointDifferential = 1;  // Assuming the point differential is also normalized between 0 and 1
        const normalizedPointDifferential = normalizeValue(avgPointDifferential,maxPointDifferential);

        console.log('Normalized Winning Percentage:',normalizedWinningPercentage);
        console.log('Normalized Point Differential:',normalizedPointDifferential);

        // Calculate base strength
        const baseStrength = (normalizedWinningPercentage + normalizedPointDifferential) / 2;  // Average them to keep within [0, 1]

        console.log('Base Strength:',baseStrength);

        return baseStrength;
    };

    const exponentialFunction = (strength,factor = 2) => Math.exp(factor * strength);

    const predictOutcome = (teamAStrength,teamBStrength) => {
        const expStrengthA = exponentialFunction(teamAStrength);
        const expStrengthB = exponentialFunction(teamBStrength);

        console.log('Exponential Strength A:',expStrengthA);
        console.log('Exponential Strength B:',expStrengthB);

        const totalExpStrength = expStrengthA + expStrengthB;
        let teamAProbability = totalExpStrength ? expStrengthA / totalExpStrength : 0;
        let teamBProbability = totalExpStrength ? expStrengthB / totalExpStrength : 0;

        console.log('Initial Team A Probability:',teamAProbability);
        console.log('Initial Team B Probability:',teamBProbability);

        // Ensure probabilities are within 0.01% to 99.9% range
        teamAProbability = Math.max(0.0001,Math.min(teamAProbability,0.999));
        teamBProbability = Math.max(0.0001,Math.min(teamBProbability,0.999));

        console.log('Clamped Team A Probability:',teamAProbability);
        console.log('Clamped Team B Probability:',teamBProbability);

        // Normalize probabilities to sum to 100%
        const normalizationFactor = teamAProbability + teamBProbability;
        teamAProbability /= normalizationFactor;
        teamBProbability /= normalizationFactor;

        console.log('Normalized Team A Probability:',teamAProbability);
        console.log('Normalized Team B Probability:',teamBProbability);

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
        <div>
            <h1>Matchup Predictor</h1>
            <div>
                <h2>Select Players</h2>
                {players.map(player => (
                    <div key={player._id}>
                        <button onClick={() => handleAddPlayerToTeam(player,setTeamA,teamA)}>
                            Add to Team A
                        </button>
                        <button onClick={() => handleAddPlayerToTeam(player,setTeamB,teamB)}>
                            Add to Team B
                        </button>
                        {player.name}
                    </div>
                ))}
            </div>
            <div>
                <h2>Team A</h2>
                {teamA.map(player => (
                    <div key={player._id}>{player.name}</div>
                ))}
            </div>
            <div>
                <h2>Team B</h2>
                {teamB.map(player => (
                    <div key={player._id}>{player.name}</div>
                ))}
            </div>
            <button onClick={handlePredictOutcome}>Predict Outcome</button>
            <button onClick={handleClearTeams}>Clear Teams</button>
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
        </div>
    );
};

export default MatchupPredictor;