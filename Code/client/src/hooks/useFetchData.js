import { useState,useEffect } from 'react';
import axios from 'axios';

const useFetchData = () => {
    const [matches,setMatches] = useState([]);
    const [players,setPlayers] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchPlayers = axios.get('/api/players');
        const fetchMatches = axios.get('/api/matches');

        Promise.all([fetchPlayers,fetchMatches])
            .then(([playersResponse,matchesResponse]) => {
                setPlayers(playersResponse.data);
                setMatches(matchesResponse.data);
            })
            .catch(error => console.error('Error fetching data:',error))
            .finally(() => setLoading(false));
    },[]);

    return { matches,players,loading,setMatches }; // Return setMatches as well
};

export default useFetchData;
