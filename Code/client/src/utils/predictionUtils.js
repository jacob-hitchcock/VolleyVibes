// utils/predictionUtils.js
export const calculateTeamStats = (team,aggregatedPlayerStats) => {
    const teamStats = team
        .map(player => {
            const aggregatedPlayer = aggregatedPlayerStats.find(p => p && p._id === player._id);
            if(!aggregatedPlayer) {
            }
            return aggregatedPlayer;
        })
        .filter(player => player); // Filter out undefined values

    const totalGames = teamStats.reduce((acc,player) => acc + (player.gamesPlayed || 0),0);
    const totalWins = teamStats.reduce((acc,player) => acc + (player.wins || 0),0);
    const totalPointsFor = teamStats.reduce((acc,player) => acc + (player.pointsFor || 0),0);
    const totalPointsAgainst = teamStats.reduce((acc,player) => acc + (player.pointsAgainst || 0),0);

    const avgWinningPercentage = totalGames ? totalWins / totalGames : 0;
    const avgPointDifferential = totalGames ? (totalPointsFor - totalPointsAgainst) / totalGames : 0;

    return {
        avgWinningPercentage,
        avgPointDifferential,
    };
};


export const predictOutcome = (teamAStats,teamBStats) => {
    const coefficients = {
        intercept: -1.5, // Example value
        winPercentage: 2.5, // Example value
        pointDifferential: 0.8, // Example value
    };

    const logisticFunction = (z) => 1 / (1 + Math.exp(-z));

    const zA = coefficients.intercept
        + coefficients.winPercentage * teamAStats.avgWinningPercentage
        + coefficients.pointDifferential * teamAStats.avgPointDifferential;

    const zB = coefficients.intercept
        + coefficients.winPercentage * teamBStats.avgWinningPercentage
        + coefficients.pointDifferential * teamBStats.avgPointDifferential;

    const probA = logisticFunction(zA);
    const probB = logisticFunction(zB);

    const totalProb = probA + probB;

    const teamAProbability = probA / totalProb;
    const teamBProbability = probB / totalProb;

    const predictScore = (teamAProbability,teamBProbability) => {
        const scoreDifference = Math.abs(teamAProbability - teamBProbability) * 25; // Arbitrary scaling factor for difference
        const baseScore = 21;
        let teamAScore = baseScore;
        let teamBScore = baseScore;

        if(teamAProbability > teamBProbability) {
            teamAScore += Math.ceil(scoreDifference / 2);
            teamBScore -= Math.floor(scoreDifference / 2);
            if(teamAScore > 21) {
                teamAScore = 21;
            }
            if(teamAScore - teamBScore < 2) {
                teamAScore += 2 - (teamAScore - teamBScore);
            }
        } else {
            teamBScore += Math.ceil(scoreDifference / 2);
            teamAScore -= Math.floor(scoreDifference / 2);
            if(teamBScore > 21) {
                teamBScore = 21;
            }
            if(teamBScore - teamAScore < 2) {
                teamBScore += 2 - (teamBScore - teamAScore);
            }
        }

        return { teamAScore,teamBScore };
    };

    const { teamAScore,teamBScore } = predictScore(teamAProbability,teamBProbability);

    return {
        teamAProbability,
        teamBProbability,
        teamAScore,
        teamBScore,
    };
};
