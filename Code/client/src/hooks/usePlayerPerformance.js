import { useMemo } from 'react';
import { groupMatchesByDate,formatDate } from '../utils/utils'; // Import utility functions

const normalizeLocation = (location) => location.toLowerCase().replace(/\s+/g,'');

const calculateMedian = (values) => {
    if(values.length === 0) return 0;
    values.sort((a,b) => a - b);
    const half = Math.floor(values.length / 2);
    if(values.length % 2) return values[half];
    return (values[half - 1] + values[half]) / 2.0;
};

const usePlayerPerformance = (playerId,matches,didPlayerTeamWin,aggregatedPlayerStats) => {
    const playerStats = useMemo(() => {
        if(!playerId || !matches.length) return null;

        const playerMatches = matches
            .filter(match => match.teams.some(team => team.includes(playerId)))
            .sort((a,b) => new Date(a.date) - new Date(b.date)); // Sort matches by match date

        const matchesByDate = groupMatchesByDate(playerMatches);
        const totalDatesPlayed = Object.keys(matchesByDate).length;

        let cumulativeWins = 0;
        let cumulativeGamesPlayed = 0;
        let cumulativePointsFor = 0;
        let cumulativePointsAgainst = 0;
        let baseline = 0;

        const performanceOverTime = [];
        const statsByLocation = {
            grass: { wins: 0,losses: 0,pointDifferential: 0 },
            indoorcourt: { wins: 0,losses: 0,pointDifferential: 0 },
            beach: { wins: 0,losses: 0,pointDifferential: 0 },
        };

        Object.keys(matchesByDate).forEach(date => {
            const dailyMatches = matchesByDate[date];
            let dailyWins = 0;
            let dailyGamesPlayed = 0;
            let dailyPointsFor = 0;
            let dailyPointsAgainst = 0;

            dailyMatches.forEach(match => {
                dailyGamesPlayed++;
                const playerTeamIndex = match.teams.findIndex(team => team.includes(playerId));
                if(didPlayerTeamWin(match,playerTeamIndex)) dailyWins++;

                // Update location-based statistics
                const location = normalizeLocation(match.location);
                if(statsByLocation[location]) {
                    statsByLocation[location].wins += didPlayerTeamWin(match,playerTeamIndex) ? 1 : 0;
                    statsByLocation[location].losses += didPlayerTeamWin(match,playerTeamIndex) ? 0 : 1;
                    statsByLocation[location].pointDifferential += match.scores[playerTeamIndex] - match.scores[playerTeamIndex === 0 ? 1 : 0];
                }

                if(totalDatesPlayed <= 2) {
                    cumulativeGamesPlayed++;
                    cumulativeWins += didPlayerTeamWin(match,playerTeamIndex) ? 1 : 0;
                    cumulativePointsFor += match.scores[playerTeamIndex];
                    cumulativePointsAgainst += match.scores[playerTeamIndex === 0 ? 1 : 0];
                    const winningPercentage = (cumulativeWins / cumulativeGamesPlayed) * 100;
                    const pointDifferential = cumulativePointsFor - cumulativePointsAgainst;
                    const VWAR = ((winningPercentage / 100 - 0.4) * cumulativeGamesPlayed + 0.5 * (pointDifferential / cumulativeGamesPlayed)).toFixed(2);
                    baseline = (cumulativeGamesPlayed * 0.35).toFixed(0);
                    performanceOverTime.push({
                        date: formatDate(match.date),
                        winningPercentage: winningPercentage.toFixed(2),
                        VWAR: 'Not enough match data',
                        cumulativeWins,
                        baseline: [],
                    });
                }
            });

            if(totalDatesPlayed > 2) {
                cumulativeGamesPlayed += dailyGamesPlayed;
                cumulativeWins += dailyWins;
                cumulativePointsFor += dailyPointsFor;
                cumulativePointsAgainst += dailyPointsAgainst;
                const pointDifferential = cumulativePointsFor - cumulativePointsAgainst;
                const winningPercentage = (cumulativeWins / cumulativeGamesPlayed) * 100;
                const currentPlayerStats = aggregatedPlayerStats
                    .map(player => {
                        const playerMatches = matches.filter(match =>
                            Array.isArray(match.teams) &&
                            match.teams.some(team => team.includes(player._id)) &&
                            new Date(match.date) <= new Date(date)
                        );
                        const gamesPlayed = playerMatches.length;
                        const wins = playerMatches.filter(match => {
                            const playerTeamIndex = match.teams.findIndex(team => team.includes(player._id));
                            return didPlayerTeamWin(match,playerTeamIndex);
                        }).length;
                        return gamesPlayed ? (wins / gamesPlayed) : null;
                    })
                    .filter(winningPercentage => winningPercentage !== null);

                const medianWinningPercentage = calculateMedian(currentPlayerStats);
                const VWAR = ((winningPercentage / 100 - medianWinningPercentage) * cumulativeGamesPlayed + 0.5 * (pointDifferential / cumulativeGamesPlayed)).toFixed(2);
                baseline = (cumulativeGamesPlayed * medianWinningPercentage).toFixed(0);
                performanceOverTime.push({
                    date: formatDate(date),
                    winningPercentage: winningPercentage.toFixed(2),
                    VWAR: VWAR,
                    cumulativeWins,
                    baseline,
                });
            }
        });

        const totalGamesPlayed = playerMatches.length;
        const totalWins = playerMatches.filter(match => {
            const playerTeamIndex = match.teams.findIndex(team => team.includes(playerId));
            return didPlayerTeamWin(match,playerTeamIndex);
        }).length;

        const totalLosses = totalGamesPlayed - totalWins;
        const pointsFor = playerMatches.reduce((acc,match) => {
            const playerTeamIndex = match.teams.findIndex(team => team.includes(playerId));
            return acc + match.scores[playerTeamIndex];
        },0);

        const pointsAgainst = playerMatches.reduce((acc,match) => {
            const playerTeamIndex = match.teams.findIndex(team => team.includes(playerId));
            const opponentTeamIndex = playerTeamIndex === 0 ? 1 : 0;
            return acc + match.scores[opponentTeamIndex];
        },0);

        const pointDifferential = pointsFor - pointsAgainst;
        const winningPercentage = totalGamesPlayed ? ((totalWins / totalGamesPlayed) * 100).toFixed(2) : '0.00';

        return {
            totalGamesPlayed,
            totalWins,
            totalLosses,
            pointsFor,
            pointsAgainst,
            pointDifferential,
            winningPercentage,
            performanceOverTime,
            statsByLocation, // Include the location-based statistics
        };
    },[playerId,matches,didPlayerTeamWin]);

    return playerStats;
};

export default usePlayerPerformance;
