import { useMemo } from 'react';
import { groupMatchesByDate,formatDate } from '../utils/utils';

/**
 * Normalizes a location string for consistent keying (lowercase, no whitespace).
 * e.g. "Indoor Court" → "indoorcourt"
 * @param {string} location
 * @returns {string}
 */
const normalizeLocation = (location) => location.toLowerCase().replace(/\s+/g,'');

/**
 * Calculates the median of an array of numbers.
 * Used to compute the league-wide median winning percentage for VWAR calculation.
 * @param {number[]} values
 * @returns {number}
 */
const calculateMedian = (values) => {
    if(values.length === 0) return 0;
    values.sort((a,b) => a - b);
    const half = Math.floor(values.length / 2);
    if(values.length % 2) return values[half];
    return (values[half - 1] + values[half]) / 2.0;
};

/**
 * Computes a comprehensive performance profile for a single player by iterating
 * over their full match history chronologically.
 *
 * In a single pass over the player's matches (grouped by date), this hook builds:
 * - **performanceOverTime**: Win %, cumulative wins, and VWAR at each date played.
 * - **statsByLocation**: Win/loss record and point differential at grass, indoor, and beach.
 * - **milestones**: Notable events (win streaks, games-played milestones, VWAR thresholds,
 *   pair-based streaks with specific teammates or opponents).
 * - Summary totals: totalWins, totalLosses, pointsFor, pointsAgainst, etc.
 *
 * VWAR (Volleyball Wins Above Replacement) measures how many wins a player has accumulated
 * above what an average player would have with the same number of games, factoring in
 * point differential. The league median winning percentage at each date is used as the baseline.
 *
 * Returns null if required data is not yet available (playerId missing, empty matches/players).
 *
 * @param {string} playerId - The player's _id to compute stats for.
 * @param {Array<Object>} matches - All match documents (unfiltered).
 * @param {Function} didPlayerTeamWin - From useFilters — determines if a team won a match.
 * @param {Array<Object>} aggregatedPlayerStats - All players' computed stats (for VWAR baseline).
 * @param {Array<Object>} players - Full player list (for name lookups in milestones).
 * @returns {Object|null} Full performance profile, or null if data is unavailable.
 */
const usePlayerPerformance = (playerId,matches,didPlayerTeamWin,aggregatedPlayerStats,players) => {
    const playerStats = useMemo(() => {
        if(!playerId || !matches.length || !players.length) return null;

        const playerNameMap = players.reduce((acc,player) => {
            acc[player._id] = player.name;
            return acc;
        },{});

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
        let milestones = [];
        let nextWinMilestone = 50;
        let nextMilestoneIncrement = 50;
        let nextVWARmilestone = 10;
        let currentStreak = 0;
        let currentStreakStartDate = null;

        const gamesPlayedTogetherCount = {};
        const nextGamesTogetherMilestone = {};
        const winStreaks = {};
        const loseStreaks = {};
        const loseStreaksAgainst = {}; // Track losing streaks against opponents

        const performanceOverTime = [];
        const statsByLocation = {
            grass: { wins: 0,losses: 0,pointDifferential: 0 },
            indoorcourt: { wins: 0,losses: 0,pointDifferential: 0 },
            beach: { wins: 0,losses: 0,pointDifferential: 0 },
        };

        Object.keys(matchesByDate).forEach(date => {
            const dailyMatches = matchesByDate[date];
            let dailyWins = 0;
            let dailyPointsFor = 0;
            let dailyPointsAgainst = 0;

            dailyMatches.forEach(match => {
                const playerTeamIndex = match.teams.findIndex(team => team.includes(playerId));
                const team = match.teams[playerTeamIndex];
                const didWin = didPlayerTeamWin(match,playerTeamIndex);
                const opponentTeam = match.teams[1 - playerTeamIndex];

                // Track games played together for each pair on the same team
                team.forEach(player1 => {
                    team.forEach(player2 => {
                        if(player1 !== player2 && player1 === playerId) { // Ensure a player is not counted with themselves and avoid duplicate playerId checks
                            const pairKey = [player1,player2].sort().join('-');

                            // Initialize streaks and counters if not already set
                            if(!winStreaks[pairKey]) {
                                winStreaks[pairKey] = 0;
                            }
                            if(!loseStreaks[pairKey]) {
                                loseStreaks[pairKey] = 0;
                            }
                            if(!gamesPlayedTogetherCount[pairKey]) {
                                gamesPlayedTogetherCount[pairKey] = 0;
                            }
                            if(!nextGamesTogetherMilestone[pairKey]) {
                                nextGamesTogetherMilestone[pairKey] = 50;
                            }

                            gamesPlayedTogetherCount[pairKey]++;

                            if(didWin) {
                                if(loseStreaks[pairKey] >= 10) {
                                    milestones.push({
                                        milestone: `& ${playerNameMap[player2]} Won Together For The First Time In ${loseStreaks[pairKey]} Games`,
                                        date: formatDate(match.date),
                                    });
                                }
                                winStreaks[pairKey]++;
                                loseStreaks[pairKey] = 0;
                            } else {
                                if(winStreaks[pairKey] >= 10) {
                                    milestones.push({
                                        milestone: `& ${playerNameMap[player2]} Lost Together For The First Time In ${winStreaks[pairKey]} Games`,
                                        date: formatDate(match.date),
                                    });
                                }
                                loseStreaks[pairKey]++;
                                winStreaks[pairKey] = 0;
                            }

                            if(gamesPlayedTogetherCount[pairKey] === nextGamesTogetherMilestone[pairKey]) {
                                milestones.push({
                                    milestone: `& ${playerNameMap[player2]} Played Their ${gamesPlayedTogetherCount[pairKey]}th Game Together`,
                                    date: formatDate(match.date),
                                });
                                nextGamesTogetherMilestone[pairKey] += 50;
                            }
                        }
                    });
                });

                // Track losing streaks against specific opponents
                opponentTeam.forEach(opponent => {
                    if(opponent !== playerId) {
                        const opponentKey = [playerId,opponent].sort().join('-');

                        // Initialize losing streaks against opponents if not already set
                        if(!loseStreaksAgainst[opponentKey]) {
                            loseStreaksAgainst[opponentKey] = 0;
                        }

                        if(didWin) {
                            if(loseStreaksAgainst[opponentKey] >= 10) {
                                milestones.push({
                                    milestone: `Defeated ${playerNameMap[opponent]} For The First Time In ${loseStreaksAgainst[opponentKey]} Games`,
                                    date: formatDate(match.date),
                                });
                            }
                            loseStreaksAgainst[opponentKey] = 0;
                        } else {
                            loseStreaksAgainst[opponentKey]++;
                        }
                    }
                });

                if(didWin) {
                    dailyWins++;
                    currentStreak++;
                    if(currentStreakStartDate === null) {
                        currentStreakStartDate = match.date;
                    }
                } else {
                    if(currentStreak >= 5) {
                        const startDate = formatDate(currentStreakStartDate);
                        const endDate = formatDate(match.date);
                        const streakDescription = startDate === endDate
                            ? `Had A ${currentStreak} Game Win Streak On ${startDate}`
                            : `Had A ${currentStreak} Game Win Streak From ${startDate} To ${endDate}`;
                        milestones.push({
                            milestone: streakDescription,
                            date: endDate,
                        });
                    }
                    currentStreak = 0;
                    currentStreakStartDate = null;
                }

                // Update location-based statistics
                const location = normalizeLocation(match.location);
                if(statsByLocation[location]) {
                    statsByLocation[location].wins += didWin ? 1 : 0;
                    statsByLocation[location].losses += didWin ? 0 : 1;
                    statsByLocation[location].pointDifferential += match.scores[playerTeamIndex] - match.scores[playerTeamIndex === 0 ? 1 : 0];
                }

                cumulativeGamesPlayed++;
                if(cumulativeGamesPlayed === 50 || cumulativeGamesPlayed % 100 === 0) {
                    milestones.push({
                        milestone: `Reached ${cumulativeGamesPlayed} Games Played`,
                        date: formatDate(match.date),
                    });
                }
            });

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
                VWAR: totalDatesPlayed > 1 ? VWAR : 'Not enough match data',
                cumulativeWins,
                cumulativeGamesPlayed,
                baseline,
            });

            while(cumulativeWins >= nextWinMilestone) {
                milestones.push({
                    milestone: `Reached ${nextWinMilestone} Wins`,
                    date: formatDate(date),
                });
                nextWinMilestone += nextMilestoneIncrement;
            }

            // Check VWAR milestones
            if(totalDatesPlayed > 1) {
                while(VWAR >= nextVWARmilestone) {
                    milestones.push({
                        milestone: `Reached ${nextVWARmilestone} VWAR`,
                        date: formatDate(date),
                    });
                    nextVWARmilestone += 10;
                }
            }
        });

        if(currentStreak >= 5) {
            const startDate = formatDate(currentStreakStartDate);
            const endDate = formatDate(playerMatches[playerMatches.length - 1].date);
            const streakDescription = startDate === endDate
                ? `Had A ${currentStreak} Game Win Streak On ${startDate}`
                : `Had A ${currentStreak} Game Win Streak From ${startDate} To ${endDate}`;
            milestones.push({
                milestone: streakDescription,
                date: endDate,
            });
        }

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
            milestones,
        };
    },[playerId,matches,didPlayerTeamWin,aggregatedPlayerStats,players]);

    return playerStats;
};

export default usePlayerPerformance;
