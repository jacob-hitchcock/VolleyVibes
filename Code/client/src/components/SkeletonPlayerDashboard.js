import React from 'react';
import { Grid,Typography,Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import SkeletonStatCard from '../components/SkeletonStatCard';
import SkeletonLineChart from '../components/SkeletonLineChart';
import SkeletonMostPlayedWithCard from '../components/SkeletonMostPlayedWithCard';
import '../styles.css';

const SkeletonPlayerDashboard = () => (
    <div className="player-dashboard">
        <NavBar />
        <Box sx={{ padding: 0 }}>
            <Typography variant="h4" align="left" sx={{ fontFamily: 'Coolvetica',color: '#e7552b',fontSize: '38px',marginBottom: '15px' }}>
                Loading Dashboard...
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <Grid container spacing={2} alignItems="center">
                        {[...Array(4)].map((_,index) => (
                            <Grid item xs={6} md={2.4} key={index}>
                                <SkeletonStatCard />
                            </Grid>
                        ))}
                        <Grid item xs={12} md={2.4}>
                            <SkeletonStatCard />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <SkeletonLineChart />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid container spacing={4.5} alignItems="center">
                        {[...Array(6)].map((_,index) => (
                            <Grid item xs={6} md={6} key={index}>
                                <SkeletonMostPlayedWithCard />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <SkeletonLineChart />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <SkeletonLineChart />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <SkeletonLineChart />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <div className="chart-card">
                                <Skeleton variant="text" width="80%" height={30} sx={{ marginBottom: '10px' }} />
                                <Skeleton variant="text" width="100%" height={20} sx={{ marginBottom: '10px' }} />
                                <Skeleton variant="text" width="100%" height={20} sx={{ marginBottom: '10px' }} />
                                <Skeleton variant="text" width="100%" height={20} sx={{ marginBottom: '10px' }} />
                                <Skeleton variant="text" width="80%" height={30} sx={{ marginBottom: '10px' }} />
                                <Skeleton variant="text" width="100%" height={20} sx={{ marginBottom: '10px' }} />
                                <Skeleton variant="text" width="100%" height={20} sx={{ marginBottom: '10px' }} />
                                <Skeleton variant="text" width="100%" height={20} sx={{ marginBottom: '10px' }} />
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
        <Footer />
    </div>
);

export default SkeletonPlayerDashboard;
