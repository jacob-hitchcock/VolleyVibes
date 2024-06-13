import { useState,useEffect } from 'react';
import axiosInstance from '../axiosInstance'; // Use the custom axios instance

const useFetchData = () => {
    const [matches,setMatches] = useState([]);
    const [players,setPlayers] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const matchesResponse = await axiosInstance.get('/matches');
                const playersResponse = await axiosInstance.get('/players');
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
