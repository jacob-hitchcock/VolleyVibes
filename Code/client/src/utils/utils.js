// Utility Functions

export const getPlayerName = (id,players) => {
    if(!players || players.length === 0) return '';
    const player = players.find(p => p._id === id);
    return player ? player.name : '';
};

export const getPossessiveForm = (name) => {
    return name.endsWith('s') ? `${name}'` : `${name}'s`;
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Adjust for local timezone offset
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    const options = { year: 'numeric',month: 'long',day: 'numeric' };
    return date.toLocaleDateString(undefined,options);
};

export const getWinners = (match,getPlayerName) => {
    return parseInt(match.scores[0]) > parseInt(match.scores[1])
        ? match.teams[0].map(id => getPlayerName(id)).join(', ')
        : match.teams[1].map(id => getPlayerName(id)).join(', ');
};

export const getLosers = (match,getPlayerName) => {
    return parseInt(match.scores[0]) > parseInt(match.scores[1])
        ? match.teams[1].map(id => getPlayerName(id)).join(', ')
        : match.teams[0].map(id => getPlayerName(id)).join(', ');
};

export const isTeamAWinner = (match) => parseInt(match.scores[0]) > parseInt(match.scores[1]);

export const doesDateMatchFilter = (matchDate,filterDate) => {
    const matchDateUTC = new Date(matchDate.toISOString().split('T')[0]); // Convert to UTC and strip time
    const filterDateUTC = new Date(filterDate);

    return (
        filterDateUTC.getFullYear() === matchDateUTC.getFullYear() &&
        filterDateUTC.getMonth() === matchDateUTC.getMonth() &&
        filterDateUTC.getDate() === matchDateUTC.getDate()
    );
};

export const groupMatchesByDate = (matches) => {
    return matches.reduce((groups,match) => {
        const date = match.date.split('T')[0]; // Extract date part
        if(!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(match);
        return groups;
    },{});
};

// Validation Function
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

// New Utility Functions

// Function to generate random numbers for players
export const generateRandomNumbers = (players) => {
    const numbers = [...Array(players.length).keys()].map((i) => i + 1);
    for(let i = numbers.length - 1;i > 0;i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i],numbers[j]] = [numbers[j],numbers[i]];
    }
    return numbers;
};

// Function to calculate all possible matchups
export const calculateMatchups = (selectedPlayerIds,players) => {
    const numbers = generateRandomNumbers(selectedPlayerIds);
    const numberedPlayers = selectedPlayerIds.map((playerId,index) => {
        const player = players.find(p => p._id === playerId);
        if(!player) {
            console.error(`Player with ID ${playerId} not found in players list.`);
            return null;
        }
        return {
            id: playerId,
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
                teamA: combo.teamA.map(player => ({ number: player.number,name: player.name })),
                teamB: combo.teamB.map(player => ({ number: player.number,name: player.name })),
                completed: false
            });
            seen.add(matchupString);
        }
    });

    return { matchups: uniqueMatchups,numberedPlayers };
};

export const getSavedCombos = () => {
    try {
        const savedMatchups = JSON.parse(localStorage.getItem('matchups')) || [];
        const savedGeneratedCombos = JSON.parse(localStorage.getItem('generatedCombos')) || [];
        const savedNumberedPlayers = JSON.parse(localStorage.getItem('numberedPlayers')) || [];
        return { savedMatchups,savedGeneratedCombos,savedNumberedPlayers };
    } catch(error) {
        console.error('Error parsing saved combos from localStorage:',error);
        return { savedMatchups: [],savedGeneratedCombos: [],savedNumberedPlayers: [] };
    }
};

// Function to save combos to local storage
export const saveCombos = (matchups,generatedCombos,numberedPlayers) => {
    localStorage.setItem('matchups',JSON.stringify(matchups));
    localStorage.setItem('generatedCombos',JSON.stringify(generatedCombos));
    localStorage.setItem('numberedPlayers',JSON.stringify(numberedPlayers));
};

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


