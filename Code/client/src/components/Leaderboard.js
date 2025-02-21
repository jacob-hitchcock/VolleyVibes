import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import '../styles.css';

const capitalizeWords = (str) => {
    if(str === 'winningPercentage') return 'Winning %';
    return str
        .split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const Leaderboard = React.memo(({ players,sortConfig,requestSort,getSortIndicator,initialLoad,loading }) => (
    <Box className="leaderboard-table-wrapper">
        <Table className="leaderlist" sx={{ borderCollapse: 'collapse',border: '2px solid #E7552B' }}>
            <TableHead>
                <TableRow>
                    <TableCell
                        className={`sticky-column ${sortConfig.key === 'name' ? 'sorted' : ''}`}
                        onClick={() => requestSort('name')}
                        sx={{ height: 'auto',padding: '8px',fontFamily: 'coolvetica',border: '2px solid #E7552B' }}
                    >
                        <Box className="header-content">
                            <Typography className="header-text" sx={{ fontFamily: 'coolvetica',fontSize: '16px',paddingLeft: '5px' }}>Name</Typography>
                            {getSortIndicator('name')}
                        </Box>
                    </TableCell>
                    {['gamesPlayed','wins','losses','winningPercentage','pointsFor','pointsAgainst','pointDifferential'].map((key) => (
                        <TableCell
                            key={key}
                            className={sortConfig.key === key ? 'sorted' : ''}
                            onClick={() => requestSort(key)}
                            sx={{ height: 'auto',padding: '8px',paddingLeft: '10px',fontFamily: 'coolvetica',border: '2px solid #E7552B' }}
                        >
                            <Box className="header-content">
                                <Typography className="header-text" sx={{ fontFamily: 'coolvetica',lineHeight: 1,fontSize: '16px' }}>{capitalizeWords(key)}</Typography>
                                {getSortIndicator(key)}
                            </Box>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {players.map((player,index) => {
                    const winningPercentage = player.gamesPlayed ? (player.wins / player.gamesPlayed).toFixed(3) : '0.000';
                    return (
                        <TableRow
                            key={player._id}
                            className={initialLoad ? "flip-in" : ""}
                            style={initialLoad ? { animationDelay: `${index * 0.1}s` } : {}}
                        >
                            <TableCell className="sticky-column" sx={{ height: 'auto',padding: '8px',fontFamily: 'coolvetica',fontSize: '16px',border: '2px solid #E7552B' }}>
                                <Link component={RouterLink} to={`/profile/${player._id}`} className="name-link" sx={{ fontFamily: 'coolvetica',lineHeight: 1,color: 'black',textDecoration: 'underline' }}>
                                    {player.name}
                                </Link>
                            </TableCell>
                            <TableCell sx={{ height: 'auto',padding: '6px',fontFamily: 'coolvetica',lineHeight: 1,fontSize: '16px',paddingLeft: '10px',border: '2px solid #E7552B' }}>{player.gamesPlayed}</TableCell>
                            <TableCell sx={{ height: 'auto',padding: '6px',fontFamily: 'coolvetica',lineHeight: 1,fontSize: '16px',paddingLeft: '10px',border: '2px solid #E7552B' }}>{player.wins}</TableCell>
                            <TableCell sx={{ height: 'auto',padding: '6px',fontFamily: 'coolvetica',lineHeight: 1,fontSize: '16px',paddingLeft: '10px',border: '2px solid #E7552B' }}>{player.gamesPlayed - player.wins}</TableCell>
                            <TableCell sx={{ height: 'auto',padding: '6px',fontFamily: 'coolvetica',lineHeight: 1,fontSize: '16px',paddingLeft: '10px',border: '2px solid #E7552B' }}>{winningPercentage}</TableCell>
                            <TableCell sx={{ height: 'auto',padding: '6px',fontFamily: 'coolvetica',lineHeight: 1,fontSize: '16px',paddingLeft: '10px',border: '2px solid #E7552B' }}>{player.pointsFor}</TableCell>
                            <TableCell sx={{ height: 'auto',padding: '6px',fontFamily: 'coolvetica',lineHeight: 1,fontSize: '16px',paddingLeft: '10px',border: '2px solid #E7552B' }}>{player.pointsAgainst}</TableCell>
                            <TableCell sx={{ height: 'auto',padding: '6px',fontFamily: 'coolvetica',lineHeight: 1,fontSize: '16px',paddingLeft: '10px',border: '2px solid #E7552B' }}>{player.pointDifferential}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    </Box>
));

Leaderboard.propTypes = {
    players: PropTypes.array.isRequired,
    sortConfig: PropTypes.object.isRequired,
    requestSort: PropTypes.func.isRequired,
    getSortIndicator: PropTypes.func.isRequired,
    initialLoad: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default Leaderboard;
