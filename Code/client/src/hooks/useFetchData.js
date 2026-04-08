import { useState,useEffect } from 'react';
import axiosInstance from '../axiosInstance';

/**
 * Fetches all core application data (matches, players, and each player's last-10 record)
 * on mount. Exposes loading and error states so consumers can handle both cases explicitly.
 *
 * @returns {{
 *   matches: Array,
 *   setMatches: Function,
 *   players: Array,
 *   setPlayers: Function,
 *   playerStats: Array,
 *   loading: boolean,
 *   error: string|null
 * }}
 */
const useFetchData = () => {
    const [matches,setMatches] = useState([]);
    const [players,setPlayers] = useState([]);
    const [playerStats,setPlayerStats] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const matchesResponse = await axiosInstance.get('/matches');
                const playersResponse = await axiosInstance.get('/players');
                const players = playersResponse.data;

                // Fetch each player's last-10 win/loss record in parallel.
                // Individual failures fall back to an empty record so one bad player
                // doesn't block the rest of the data from loading.
                const playerStats = await Promise.all(
                    players.map(async (p) => {
                        try {
                            const res = await axiosInstance.get(`/players/${p._id}/last10`);
                            return { ...p, last10: res.data };
                        } catch {
                            return { ...p, last10: [] };
                        }
                    })
                );
                setMatches(matchesResponse.data);
                setPlayers(playersResponse.data);
                setPlayerStats(playerStats);
            } catch(err) {
                console.error('Error fetching data:',err);
                setError(err.message || 'Failed to load data. Please refresh.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    },[]);

    return { matches,setMatches,players,setPlayers,loading,error,playerStats };
};

export default useFetchData;
