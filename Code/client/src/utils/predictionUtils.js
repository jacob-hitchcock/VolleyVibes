// utils/predictionUtils.js

/**
 * Aggregates team-level stats from individual player records for use in match prediction.
 * Stats are averaged across all team members who have existing records.
 *
 * @param {Array<{_id: string}>} team - Array of player objects on the team.
 * @param {Array<Object>} aggregatedPlayerStats - Full player stat records (from useFilters).
 * @returns {{ avgWinningPercentage: number, avgPointDifferential: number }}
 */
export const calculateTeamStats = (team,aggregatedPlayerStats) => {
    const teamStats = team
        .map(player => {
            const aggregatedPlayer = aggregatedPlayerStats.find(p => p && p._id === player._id);
            return aggregatedPlayer;
        })
        .filter(player => player);

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

/**
 * Predicts match outcome probabilities and an estimated score using a logistic regression model.
 *
 * ⚠️ PLACEHOLDER COEFFICIENTS: The values below are hand-tuned estimates, NOT trained on
 * real match data. Predictions will improve significantly once the model is trained on
 * historical VolleyVibes match results. See Phase 3 of the project roadmap.
 *
 * The logistic function maps each team's combined stats to a probability score. Those
 * raw probabilities are then normalized so they sum to 1. Estimated scores are derived
 * by scaling the probability difference to a point spread around a base score of 21.
 *
 * @param {{ avgWinningPercentage: number, avgPointDifferential: number }} teamAStats
 * @param {{ avgWinningPercentage: number, avgPointDifferential: number }} teamBStats
 * @returns {{
 *   teamAProbability: number,
 *   teamBProbability: number,
 *   teamAScore: number,
 *   teamBScore: number
 * }}
 */
export const predictOutcome = (teamAStats,teamBStats) => {
    // PLACEHOLDER: These coefficients are illustrative values, not trained.
    const coefficients = {
        intercept: -1.5,
        winPercentage: 2.5,
        pointDifferential: 0.8,
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
        const scoreDifference = Math.abs(teamAProbability - teamBProbability) * 25;
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
