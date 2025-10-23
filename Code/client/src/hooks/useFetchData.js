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
                const last10Response = await axiosInstance.get('/players/666673ac6bb8ee4ede1edbfb/last10');
                console.log(last10Response.data);
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
