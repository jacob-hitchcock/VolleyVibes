import { useState,useEffect } from 'react';
import axiosInstance from '../axiosInstance';

/**
 * Fetches matches and players on mount. Exposes loading and error states so
 * consumers can handle both cases explicitly. last10 records are computed
 * client-side in useFilters from the already-loaded match data.
 *
 * @returns {{ matches: Array, setMatches: Function, players: Array, setPlayers: Function, loading: boolean, error: string|null }}
 */
const useFetchData = () => {
    const [matches,setMatches] = useState([]);
    const [players,setPlayers] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [matchesResponse,playersResponse] = await Promise.all([
                    axiosInstance.get('/matches'),
                    axiosInstance.get('/players'),
                ]);
                setMatches(matchesResponse.data);
                setPlayers(playersResponse.data);
            } catch(err) {
                console.error('Error fetching data:',err);
                setError(err.message || 'Failed to load data. Please refresh.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    },[]);

    return { matches,setMatches,players,setPlayers,loading,error };
};

export default useFetchData;
