import React, { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Link
} from '@mui/material';
import '../styles.css';

const capitalizeWords = (str) => {
  if (str === 'winningPercentage') return 'Winning %';
  return str
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const Leaderboard = React.memo(
  ({ players, last10, sortConfig, requestSort, getSortIndicator, initialLoad, loading }) => {
    // ✅ Map last10 data by player ID
    const last10Map = useMemo(() => {
      const map = {};
      if (Array.isArray(last10)) {
        last10.forEach((p) => {
          if (p && p._id && p.last10) map[p._id] = p.last10;
        });
      }
      return map;
    }, [last10]);

    const cellStyle = {
      height: 'auto',
      padding: '6px',
      fontFamily: 'coolvetica',
      lineHeight: 1,
      fontSize: '16px',
      paddingLeft: '10px',
      border: '2px solid #E7552B'
    };

    // ✅ Local sort handler that also supports "last10Record"
    const handleSort = (key) => {
      if (key === 'last10Record') {
        // Custom sort by last10 winning %
        requestSort('last10Record');
      } else {
        requestSort(key);
      }
    };

    // ✅ Sort players locally if sorting by last10Record
    const sortedPlayers = useMemo(() => {
      if (sortConfig.key !== 'last10Record') return players;

      const sorted = [...players].sort((a, b) => {
        const aRec = last10Map[a._id]?.record || '0-0';
        const bRec = last10Map[b._id]?.record || '0-0';

        const aWins = parseInt(aRec.split('-')[0]) || 0;
        const bWins = parseInt(bRec.split('-')[0]) || 0;

        const aPct = aWins / 10;
        const bPct = bWins / 10;

        if (aPct < bPct) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aPct > bPct) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });

      return sorted;
    }, [players, last10Map, sortConfig]);

    return (
      <Box className="leaderboard-table-wrapper">
        <Table
          className="leaderlist"
          sx={{ borderCollapse: 'collapse', border: '2px solid #E7552B' }}
        >
          <TableHead>
            <TableRow>
              {/* Name */}
              <TableCell
                className={`sticky-column ${sortConfig.key === 'name' ? 'sorted' : ''}`}
                onClick={() => handleSort('name')}
                sx={{
                  height: 'auto',
                  padding: '8px',
                  fontFamily: 'coolvetica',
                  border: '2px solid #E7552B'
                }}
              >
                <Box className="header-content">
                  <Typography
                    className="header-text"
                    sx={{ fontFamily: 'coolvetica', fontSize: '16px', paddingLeft: '5px' }}
                  >
                    Name
                  </Typography>
                  {getSortIndicator('name')}
                </Box>
              </TableCell>

              {/* Stat Headers */}
              {[
                'gamesPlayed',
                'wins',
                'losses',
                'winningPercentage',
                'pointsFor',
                'pointsAgainst',
                'pointDifferential',
                'last10Record'
              ].map((key) => (
                <TableCell
                  key={key}
                  className={sortConfig.key === key ? 'sorted' : ''}
                  onClick={() => handleSort(key)}
                  sx={{
                    height: 'auto',
                    padding: '8px',
                    paddingLeft: '10px',
                    fontFamily: 'coolvetica',
                    border: '2px solid #E7552B'
                  }}
                >
                  <Box className="header-content">
                    <Typography
                      className="header-text"
                      sx={{ fontFamily: 'coolvetica', lineHeight: 1, fontSize: '16px' }}
                    >
                      {key === 'last10Record' ? 'Last 10' : capitalizeWords(key)}
                    </Typography>
                    {getSortIndicator(key)}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedPlayers.map((player, index) => {
              const winningPercentage = player.gamesPlayed
                ? (player.wins / player.gamesPlayed) * 100
                : 0;

              const playerLast10 = last10Map[player._id];

              return (
                <TableRow
                  key={player._id}
                  className={initialLoad ? 'flip-in' : ''}
                  style={initialLoad ? { animationDelay: `${index * 0.1}s` } : {}}
                >
                  <TableCell
                    className="sticky-column"
                    sx={{
                      height: 'auto',
                      padding: '8px',
                      fontFamily: 'coolvetica',
                      fontSize: '16px',
                      border: '2px solid #E7552B'
                    }}
                  >
                    <Link
                      component={RouterLink}
                      to={`/profile/${player._id}`}
                      className="name-link"
                      sx={{
                        fontFamily: 'coolvetica',
                        lineHeight: 1,
                        color: 'black',
                        textDecoration: 'underline'
                      }}
                    >
                      {player.name}
                    </Link>
                  </TableCell>

                  <TableCell sx={cellStyle}>{player.gamesPlayed}</TableCell>
                  <TableCell sx={cellStyle}>{player.wins}</TableCell>
                  <TableCell sx={cellStyle}>{player.gamesPlayed - player.wins}</TableCell>
                  <TableCell sx={cellStyle}>{winningPercentage.toFixed(2)}%</TableCell>
                  <TableCell sx={cellStyle}>{player.pointsFor}</TableCell>
                  <TableCell sx={cellStyle}>{player.pointsAgainst}</TableCell>
                  <TableCell sx={cellStyle}>{player.pointDifferential}</TableCell>
                  <TableCell sx={cellStyle}>
                    {playerLast10 ? playerLast10.record : 'N/A'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    );
  }
);

Leaderboard.propTypes = {
  players: PropTypes.array.isRequired,
  last10: PropTypes.array.isRequired,
  sortConfig: PropTypes.object.isRequired,
  requestSort: PropTypes.func.isRequired,
  getSortIndicator: PropTypes.func.isRequired,
  initialLoad: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired
};

export default Leaderboard;
