// Utility Functions

export const getPlayerName = (id,players) => {
    if(!players || players.length === 0) return '';
    const player = players.find(p => p._id === id);
    return player ? player.name : '';
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
