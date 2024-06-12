import { useState,useEffect } from 'react';
import axios from 'axios';

const useFetchData = () => {
    const [matches,setMatches] = useState([]);
    const [players,setPlayers] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const matchesResponse = await axios.get('/api/matches');
                const playersResponse = await axios.get('/api/players');
                setMatches(matchesResponse.data);
                setPlayers(playersResponse.data);
                setLoading(false);
            } catch(error) {
                console.error('Error fetching data:',error);
                setLoading(false);
            }
        };

        fetchData();
    },[]);

    return { matches,setMatches,players,setPlayers,loading };
};

export default useFetchData;