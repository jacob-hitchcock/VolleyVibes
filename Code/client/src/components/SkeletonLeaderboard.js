import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import '../styles.css';

const SkeletonLeaderboard = () => {
    const rows = Array.from(new Array(10)); // Assume 10 rows of data
    return (
        <div className="leaderboard-table-wrapper">
            <table className="leaderlist">
                <thead>
                    <tr>
                        <th><Skeleton variant="text" width={100} /></th>
                        <th><Skeleton variant="text" width={100} /></th>
                        <th><Skeleton variant="text" width={100} /></th>
                        <th><Skeleton variant="text" width={100} /></th>
                        <th><Skeleton variant="text" width={100} /></th>
                        <th><Skeleton variant="text" width={100} /></th>
                        <th><Skeleton variant="text" width={100} /></th>
                        <th><Skeleton variant="text" width={100} /></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((_,index) => (
                        <tr key={index}>
                            <td><Skeleton variant="text" width={100} /></td>
                            <td><Skeleton variant="text" width={100} /></td>
                            <td><Skeleton variant="text" width={100} /></td>
                            <td><Skeleton variant="text" width={100} /></td>
                            <td><Skeleton variant="text" width={100} /></td>
                            <td><Skeleton variant="text" width={100} /></td>
                            <td><Skeleton variant="text" width={100} /></td>
                            <td><Skeleton variant="text" width={100} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SkeletonLeaderboard;
