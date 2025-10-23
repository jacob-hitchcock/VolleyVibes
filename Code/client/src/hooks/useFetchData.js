import { useState,useEffect } from 'react';
import axiosInstance from '../axiosInstance'; // Use the custom axios instance

const useFetchData = () => {
    const [matches,setMatches] = useState([]);
    const [players,setPlayers] = useState([]);
    const [playerStats,setPlayerStats] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const matchesResponse = await axiosInstance.get('/matches');
                const playersResponse = await axiosInstance.get('/players');
                const players = playersResponse.data;

                // Fetch last 10 matches for debugging
                const playerStats = await Promise.all(
                    players.map(async (p) => {
                        try {
                            const res = await axiosInstance.get(`/players/${p._id}/last10`);
                            return { ...p, last10: res.data };
                        } catch {
                            return { ...p, last10: [] };
                        }
                    })
                )
                setMatches(matchesResponse.data);
                setPlayers(playersResponse.data);
                setPlayerStats(playerStats);
                setLoading(false);
            } catch(error) {
                console.error('Error fetching data:',error);
                setLoading(false);
            }
        };

        fetchData();
    },[]);

    return { matches,setMatches,players,setPlayers,loading,playerStats };
};

export default useFetchData;
