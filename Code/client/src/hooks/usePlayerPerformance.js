// src/hooks/usePlayerPerformance.js

import { useMemo } from 'react';
import { groupMatchesByDate,formatDate } from '../utils/utils'; // Import utility functions

const usePlayerPerformance = (playerId,matches,didPlayerTeamWin) => {
    const playerStats = useMemo(() => {
        if(!playerId || !matches.length) return null;

        const playerMatches = matches
            .filter(match => match.teams.some(team => team.includes(playerId)))
            .sort((a,b) => new Date(a.date) - new Date(b.date)); // Sort matches by match date

        const matchesByDate = groupMatchesByDate(playerMatches);
        const totalDatesPlayed = Object.keys(matchesByDate).length;

        let cumulativeWins = 0;
        let cumulativeGamesPlayed = 0;
        const performanceOverTime = [];

        Object.keys(matchesByDate).forEach(date => {
            const dailyMatches = matchesByDate[date];
            let dailyWins = 0;
            let dailyGamesPlayed = 0;

            dailyMatches.forEach(match => {
                dailyGamesPlayed++;
                const playerTeamIndex = match.teams.findIndex(team => team.includes(playerId));
                if(didPlayerTeamWin(match,playerTeamIndex)) dailyWins++;

                if(totalDatesPlayed <= 2) {
                    cumulativeGamesPlayed++;
                    cumulativeWins += didPlayerTeamWin(match,playerTeamIndex) ? 1 : 0;
                    const winningPercentage = (cumulativeWins / cumulativeGamesPlayed) * 100;
                    performanceOverTime.push({
                        date: formatDate(match.date),
                        winningPercentage: winningPercentage.toFixed(2),
                    });
                }
            });

            if(totalDatesPlayed > 2) {
                cumulativeGamesPlayed += dailyGamesPlayed;
                cumulativeWins += dailyWins;
                const winningPercentage = (cumulativeWins / cumulativeGamesPlayed) * 100;
                performanceOverTime.push({
                    date: formatDate(date),
                    winningPercentage: winningPercentage.toFixed(2),
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
        };
    },[playerId,matches,didPlayerTeamWin]);

    return playerStats;
};

export default usePlayerPerformance;
