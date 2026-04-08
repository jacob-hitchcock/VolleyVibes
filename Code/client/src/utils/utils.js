// Utility Functions

/**
 * Looks up a player's display name by their MongoDB ID.
 * @param {string} id - The player's _id string.
 * @param {Array<{_id: string, name: string}>} players - Full player list.
 * @returns {string} The player's name, or an empty string if not found.
 */
export const getPlayerName = (id,players) => {
    if(!players || players.length === 0) return '';
    const player = players.find(p => p._id === id);
    return player ? player.name : '';
};

/**
 * Returns the possessive form of a name (e.g. "James" → "James'", "Jacob" → "Jacob's").
 * @param {string} name
 * @returns {string}
 */
export const getPossessiveForm = (name) => {
    return name.endsWith('s') ? `${name}'` : `${name}'s`;
};

/**
 * Formats an ISO date string into a human-readable local date string (e.g. "April 7, 2026").
 * Adjusts for the local timezone offset so the displayed date matches the recorded date.
 * @param {string} dateString - ISO 8601 date string.
 * @returns {string}
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Shift by the timezone offset so the date displays as entered, not as UTC midnight.
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    const options = { year: 'numeric',month: 'long',day: 'numeric' };
    return date.toLocaleDateString(undefined,options);
};

/**
 * Returns a comma-separated string of the winning team's player names for a given match.
 * @param {Object} match - Match document with `scores` and `teams` arrays.
 * @param {Function} getPlayerName - Function to resolve player IDs to names.
 * @returns {string}
 */
export const getWinners = (match,getPlayerName) => {
    return parseInt(match.scores[0]) > parseInt(match.scores[1])
        ? match.teams[0].map(id => getPlayerName(id)).join(', ')
        : match.teams[1].map(id => getPlayerName(id)).join(', ');
};

/**
 * Returns a comma-separated string of the losing team's player names for a given match.
 * @param {Object} match - Match document with `scores` and `teams` arrays.
 * @param {Function} getPlayerName - Function to resolve player IDs to names.
 * @returns {string}
 */
export const getLosers = (match,getPlayerName) => {
    return parseInt(match.scores[0]) > parseInt(match.scores[1])
        ? match.teams[1].map(id => getPlayerName(id)).join(', ')
        : match.teams[0].map(id => getPlayerName(id)).join(', ');
};

/**
 * Returns true if Team A (index 0) won the match.
 * @param {Object} match - Match document with a `scores` array.
 * @returns {boolean}
 */
export const isTeamAWinner = (match) => parseInt(match.scores[0]) > parseInt(match.scores[1]);

/**
 * Returns true if a match date falls on the same calendar day as the given filter date.
 * Both dates are compared in UTC to avoid timezone-related off-by-one errors.
 * @param {Date} matchDate - The match's date as a Date object.
 * @param {string} filterDate - A date string to compare against (e.g. "2026-04-07").
 * @returns {boolean}
 */
export const doesDateMatchFilter = (matchDate,filterDate) => {
    const matchDateUTC = new Date(matchDate.toISOString().split('T')[0]);
    const filterDateUTC = new Date(filterDate);

    return (
        filterDateUTC.getFullYear() === matchDateUTC.getFullYear() &&
        filterDateUTC.getMonth() === matchDateUTC.getMonth() &&
        filterDateUTC.getDate() === matchDateUTC.getDate()
    );
};

/**
 * Groups an array of matches into an object keyed by their date string (YYYY-MM-DD).
 * Useful for iterating over a player's match history day by day.
 * @param {Array<Object>} matches - Array of match documents.
 * @returns {Object.<string, Array<Object>>} Map of date strings to arrays of matches.
 */
export const groupMatchesByDate = (matches) => {
    return matches.reduce((groups,match) => {
        const date = match.date.split('T')[0];
        if(!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(match);
        return groups;
    },{});
};

// Validation Function

/**
 * Validates a player creation/edit form object.
 * Returns an errors object — if empty, the form is valid.
 * @param {{ name: string, age: number|string, gender: string }} form
 * @returns {Object.<string, string>} Map of field names to error messages.
 */
export const validatePlayerForm = (form) => {
    const errors = {};
    if(!form.name) {
        errors.name = 'Name is required';
    }
    if(form.age && (form.age < 0 || form.age > 120)) {
        errors.age = 'Age must be between 0 and 120';
    }
    if(!form.gender) {
        errors.gender = 'Gender is required';
    }
    return errors;
};

/**
 * Generates a randomly shuffled array of integers from 1 to players.length (inclusive).
 * Used to assign random jersey numbers to players before generating team combos.
 * Implements the Fisher-Yates shuffle algorithm.
 * @param {Array} players - Array of player objects (only the length is used).
 * @returns {number[]} Shuffled array of integers.
 */
export const generateRandomNumbers = (players) => {
    const numbers = [...Array(players.length).keys()].map((i) => i + 1);
    for(let i = numbers.length - 1;i > 0;i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i],numbers[j]] = [numbers[j],numbers[i]];
    }
    return numbers;
};

/**
 * Generates all unique team matchup combinations for the selected players.
 *
 * Steps:
 * 1. Assigns each selected player a random jersey number.
 * 2. Generates all combinations of players for Team A (size = floor(total / 2)).
 * 3. Deduplicates mirror matchups (A vs B == B vs A).
 *
 * @param {string[]} selectedPlayerIds - Array of player _id strings to include.
 * @param {Array<{_id: string, name: string}>} players - Full player list to look up names.
 * @returns {{ matchups: Array<Object>, numberedPlayers: Array<Object> }}
 */
export const calculateMatchups = (selectedPlayerIds,players) => {
    const numbers = generateRandomNumbers(selectedPlayerIds);
    const numberedPlayers = selectedPlayerIds.map((playerId,index) => {
        const player = players.find(p => p._id === playerId);
        if(!player) {
            console.error(`Player with ID ${playerId} not found in players list.`);
            return null;
        }
        return {
            _id: player._id,
            number: numbers[index],
            name: player.name
        };
    }).filter(player => player !== null);

    const totalPlayers = numberedPlayers.length;
    const teamSizeA = Math.floor(totalPlayers / 2);
    const teamSizeB = totalPlayers % 2 === 0 ? teamSizeA : teamSizeA + 1;

    const allCombos = [];

    const generateCombinations = (arr,size,start = 0,initial = []) => {
        if(size === 0) {
            const teamA = initial;
            const teamB = arr.filter(player => !teamA.includes(player));
            if(teamA.length === teamSizeA && teamB.length === teamSizeB) {
                allCombos.push({ teamA,teamB,completed: false });
            }
            return;
        }
        for(let i = start;i <= arr.length - size;i++) {
            generateCombinations(arr,size - 1,i + 1,[...initial,arr[i]]);
        }
    };

    generateCombinations(numberedPlayers,teamSizeA);

    const uniqueMatchups = [];
    const seen = new Set();

    allCombos.forEach(combo => {
        const teamA = combo.teamA.map(player => player.number).sort((a,b) => a - b);
        const teamB = combo.teamB.map(player => player.number).sort((a,b) => a - b);

        const matchupString = JSON.stringify([teamA,teamB].sort((a,b) => a[0] - b[0]));

        if(!seen.has(matchupString)) {
            uniqueMatchups.push({
                teamA: combo.teamA.map(player => ({ _id: player._id,number: player.number,name: player.name })),
                teamB: combo.teamB.map(player => ({ _id: player._id,number: player.number,name: player.name })),
                completed: false
            });
            seen.add(matchupString);
        }
    });

    return { matchups: uniqueMatchups,numberedPlayers };
};

/**
 * Reads all combo-related state from localStorage and returns it.
 * Used to restore the Combos page state between sessions.
 * Falls back to empty defaults if localStorage is unavailable or data is malformed.
 * @returns {{
 *   savedSelectedPlayers: string[],
 *   savedMatchups: Array,
 *   savedGeneratedCombos: Array,
 *   savedNumberedPlayers: Array,
 *   savedReferenceGrid: Array,
 *   savedTeamACounts: number[],
 *   savedTeamAStdDev: number
 * }}
 */
export const getSavedCombos = () => {
    try {
        const savedSelectedPlayers = JSON.parse(localStorage.getItem('selectedPlayers')) || [];
        const savedMatchups = JSON.parse(localStorage.getItem('matchups')) || [];
        const savedGeneratedCombos = JSON.parse(localStorage.getItem('generatedCombos')) || [];
        const savedNumberedPlayers = JSON.parse(localStorage.getItem('numberedPlayers')) || [];
        const savedReferenceGrid = JSON.parse(localStorage.getItem('referenceGrid')) || [];
        const savedTeamACounts = JSON.parse(localStorage.getItem('teamACounts')) || [];
        const savedTeamAStdDev = parseFloat(localStorage.getItem('teamAStdDev')) || 0;
        return {
            savedSelectedPlayers,
            savedMatchups,
            savedGeneratedCombos,
            savedNumberedPlayers,
            savedReferenceGrid,
            savedTeamACounts,
            savedTeamAStdDev,
        };
    } catch(error) {
        console.error('Error parsing saved combos from localStorage:',error);
        return {
            savedSelectedPlayers: [],
            savedMatchups: [],
            savedGeneratedCombos: [],
            savedNumberedPlayers: [],
            savedReferenceGrid: [],
            savedTeamACounts: [],
            savedTeamAStdDev: 0,
        };
    }
};

/**
 * Persists all combo-related state to localStorage so it survives page refreshes.
 * Called automatically whenever combo state changes in useComboData.
 * @param {string[]} selectedPlayers
 * @param {Array} matchups
 * @param {Array} generatedCombos
 * @param {Array} numberedPlayers
 * @param {Array} referenceGrid
 * @param {number[]} teamACounts
 * @param {number} teamAStdDev
 */
export const saveCombos = (selectedPlayers,matchups,generatedCombos,numberedPlayers,referenceGrid,teamACounts,teamAStdDev) => {
    localStorage.setItem('selectedPlayers',JSON.stringify(selectedPlayers));
    localStorage.setItem('matchups',JSON.stringify(matchups));
    localStorage.setItem('generatedCombos',JSON.stringify(generatedCombos));
    localStorage.setItem('numberedPlayers',JSON.stringify(numberedPlayers));
    localStorage.setItem('referenceGrid',JSON.stringify(referenceGrid));
    localStorage.setItem('teamACounts',JSON.stringify(teamACounts));
    localStorage.setItem('teamAStdDev',teamAStdDev.toString());
};

/**
 * Finds the teammate a given player has shared the most matches with.
 * @param {string} playerId - The focal player's _id.
 * @param {Array<Object>} matches - All match documents.
 * @param {Array<{_id: string, name: string}>} players - Full player list.
 * @returns {{ name: string|null, gamesPlayed: number }}
 */
export const getMostPlayedWithPlayer = (playerId,matches,players) => {
    const teammateCount = {};

    matches.forEach(match => {
        const playerInMatch = match.teams.flat().includes(playerId);

        if(playerInMatch) {
            match.teams.forEach(team => {
                if(team.includes(playerId)) {
                    team.forEach(teammateId => {
                        if(teammateId !== playerId) {
                            if(!teammateCount[teammateId]) {
                                teammateCount[teammateId] = 0;
                            }
                            teammateCount[teammateId]++;
                        }
                    });
                }
            });
        }
    });

    const mostPlayedWithPlayerId = Object.keys(teammateCount).reduce((a,b) => teammateCount[a] > teammateCount[b] ? a : b,null);

    if(mostPlayedWithPlayerId) {
        const mostPlayedWithPlayer = players.find(player => player._id === mostPlayedWithPlayerId);
        return {
            name: mostPlayedWithPlayer ? mostPlayedWithPlayer.name : null,
            gamesPlayed: teammateCount[mostPlayedWithPlayerId] || 0,
        };
    }

    return { name: null,gamesPlayed: 0 };
};

/**
 * Finds the teammate a given player has shared the fewest matches with.
 * @param {string} playerId - The focal player's _id.
 * @param {Array<Object>} matches - All match documents.
 * @param {Array<{_id: string, name: string}>} players - Full player list.
 * @returns {{ name: string|null, gamesPlayed: number }}
 */
export const getLeastPlayedWithPlayer = (playerId,matches,players) => {
    const teammateCount = {};

    matches.forEach(match => {
        const playerInMatch = match.teams.flat().includes(playerId);

        if(playerInMatch) {
            match.teams.forEach(team => {
                if(team.includes(playerId)) {
                    team.forEach(teammateId => {
                        if(teammateId !== playerId) {
                            if(!teammateCount[teammateId]) {
                                teammateCount[teammateId] = 0;
                            }
                            teammateCount[teammateId]++;
                        }
                    });
                }
            });
        }
    });

    const leastPlayedWithPlayerId = Object.keys(teammateCount).reduce((a,b) => teammateCount[a] < teammateCount[b] ? a : b,null);

    if(leastPlayedWithPlayerId) {
        const leastPlayedWithPlayer = players.find(player => player._id === leastPlayedWithPlayerId);
        return {
            name: leastPlayedWithPlayer ? leastPlayedWithPlayer.name : null,
            gamesPlayed: teammateCount[leastPlayedWithPlayerId] || 0,
        };
    }

    return { name: null,gamesPlayed: 0 };
};

/**
 * Computes four teammate-impact statistics for a given player across all their matches:
 *
 * - **highestWinningPercentageTeammate**: The teammate they win with most often.
 * - **lowestWinningPercentageTeammate**: The teammate they win with least often.
 * - **highestContributingTeammate**: The teammate who appears in the most of their wins.
 * - **leastImpactfulTeammate**: The teammate who appears in the most of their losses.
 *
 * Teammates with fewer than MIN_GAMES_THRESHOLD shared games are excluded from
 * percentage-based rankings when the player has enough games (avoids small-sample noise).
 *
 * @param {string} playerId
 * @param {Array<Object>} matches
 * @param {Array<{_id: string, name: string}>} players
 * @returns {{
 *   highestWinningPercentageTeammate: Object,
 *   lowestWinningPercentageTeammate: Object,
 *   highestContributingTeammate: Object,
 *   leastImpactfulTeammate: Object
 * }}
 */
export const getWinningPercentageTeammates = (playerId,matches,players) => {
    const MIN_GAMES_THRESHOLD = 7;
    const teammateStats = {};
    let totalWins = 0;
    let totalLosses = 0;

    matches.forEach(match => {
        const playerInMatch = match.teams.flat().includes(playerId);

        if(playerInMatch) {
            const playerTeamIndex = match.teams.findIndex(team => team.includes(playerId));
            const playerTeam = match.teams[playerTeamIndex];
            const isWin = didPlayerTeamWin(match,playerTeamIndex);

            if(isWin) {
                totalWins++;
            } else {
                totalLosses++;
            }

            playerTeam.forEach(teammateId => {
                if(teammateId !== playerId) {
                    if(!teammateStats[teammateId]) {
                        teammateStats[teammateId] = { wins: 0,losses: 0,games: 0 };
                    }
                    teammateStats[teammateId].games += 1;
                    if(isWin) {
                        teammateStats[teammateId].wins += 1;
                    } else {
                        teammateStats[teammateId].losses += 1;
                    }
                }
            });
        }
    });

    if(Object.keys(teammateStats).length === 0) {
        return {
            highestWinningPercentageTeammate: { name: null,winningPercentage: 0 },
            lowestWinningPercentageTeammate: { name: null,winningPercentage: 0 },
            highestContributingTeammate: { name: null,contributionPercentage: 0 },
            leastImpactfulTeammate: { name: null,lossPercentage: 0,gamesPlayed: 0 }
        };
    }
    const totalGamesPlayed = matches.length;

    const highestWinningPercentageTeammateId = Object.keys(teammateStats).reduce((a,b) => {

        const aStats = teammateStats[a];
        const bStats = teammateStats[b];
        const aPercentage = aStats.wins / aStats.games;
        const bPercentage = bStats.wins / bStats.games;

        if(totalGamesPlayed >= MIN_GAMES_THRESHOLD) {
            if(aStats.games < MIN_GAMES_THRESHOLD && bStats.games >= MIN_GAMES_THRESHOLD) {
                return b;
            }
            if(bStats.games < MIN_GAMES_THRESHOLD && aStats.games >= MIN_GAMES_THRESHOLD) {
                return a;
            }
        }

        if(aPercentage === bPercentage) {
            return aStats.games > bStats.games ? a : b;
        }

        return aPercentage > bPercentage ? a : b;
    });

    const lowestWinningPercentageTeammateId = Object.keys(teammateStats).reduce((a,b) => {
        const aStats = teammateStats[a];
        const bStats = teammateStats[b];
        const aPercentage = aStats.wins / aStats.games;
        const bPercentage = bStats.wins / bStats.games;

        if(totalGamesPlayed >= MIN_GAMES_THRESHOLD) {
            if(aStats.games < MIN_GAMES_THRESHOLD && bStats.games >= MIN_GAMES_THRESHOLD) {
                return b;
            }
            if(bStats.games < MIN_GAMES_THRESHOLD && aStats.games >= MIN_GAMES_THRESHOLD) {
                return a;
            }
        }

        if(aPercentage === bPercentage) {
            return aStats.games > bStats.games ? a : b;
        }

        return aPercentage < bPercentage ? a : b;
    });

    const highestContributingTeammateId = Object.keys(teammateStats).reduce((a,b) => {
        const aStats = teammateStats[a];
        const bStats = teammateStats[b];
        const aContribution = aStats.wins / totalWins;
        const bContribution = bStats.wins / totalWins;

        if(aContribution === bContribution) {
            return aStats.games > bStats.games ? a : b;
        }
        return aContribution > bContribution ? a : b;
    });

    const leastImpactfulTeammateId = Object.keys(teammateStats).reduce((a,b) => {
        const aStats = teammateStats[a];
        const bStats = teammateStats[b];
        const aLossPercentage = aStats.losses / totalLosses;
        const bLossPercentage = bStats.losses / totalLosses;

        if(aLossPercentage === bLossPercentage) {
            return aStats.games > bStats.games ? a : b;
        }
        return aLossPercentage > bLossPercentage ? a : b;
    });

    const getTeammateDetails = (teammateId) => {
        if(teammateId) {
            const teammate = players.find(player => player._id === teammateId);
            const stats = teammateStats[teammateId];
            const winningPercentage = (stats.wins / stats.games) * 100;
            const contributionPercentage = (stats.wins / totalWins) * 100;
            const lossPercentage = (stats.losses / totalLosses) * 100;
            return {
                name: teammate ? teammate.name : null,
                winningPercentage: winningPercentage.toFixed(2),
                contributionPercentage: contributionPercentage.toFixed(2),
                lossPercentage: lossPercentage.toFixed(2),
                gamesPlayed: stats.games,
            };
        }
        return { name: null,winningPercentage: 0,contributionPercentage: 0,lossPercentage: 0,gamesPlayed: 0 };
    };

    const highestWinningPercentageTeammate = getTeammateDetails(highestWinningPercentageTeammateId);
    const lowestWinningPercentageTeammate = getTeammateDetails(lowestWinningPercentageTeammateId);
    const highestContributingTeammate = getTeammateDetails(highestContributingTeammateId);
    const leastImpactfulTeammate = getTeammateDetails(leastImpactfulTeammateId);

    return { highestWinningPercentageTeammate,lowestWinningPercentageTeammate,highestContributingTeammate,leastImpactfulTeammate };
};

/**
 * Returns true if the player's team won the given match.
 * @param {Object} match - Match document with `scores` array.
 * @param {number} playerTeamIndex - Index (0 or 1) of the team the player is on.
 * @returns {boolean}
 */
const didPlayerTeamWin = (match,playerTeamIndex) => {
    const teamScore = Number(match.scores[playerTeamIndex]);
    const opponentScore = Number(match.scores[playerTeamIndex === 0 ? 1 : 0]);
    return teamScore > opponentScore;
};
