import React,{ useState } from 'react';
import { Link,useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import '../styles.css';

function NavBar() {
    const location = useLocation();
    const [menuAnchor,setMenuAnchor] = useState(null);

    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'transparent',boxShadow: 'none' }}>
            <Toolbar>
                <div className="title-container">
                    <img src="/images/VolleyVibe.png" alt="VolleyVibe Logo" className="logo" />
                    <Typography variant="h6" component="div" className="title">
                        <span className="volley">Volley</span>
                        <span className="vibe">Vibe!</span>
                    </Typography>
                </div>
                <div className="nav-left">
                    <Button
                        component={Link}
                        to="/"
                        className={location.pathname === '/' ? 'active' : ''}
                        sx={{
                            color: location.pathname === '/' ? '#e7552b' : 'inherit',
                            backgroundColor: location.pathname === '/' ? '#fff5d6' : 'transparent',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: location.pathname === '/' ? '#fff5d6' : 'transparent',
                            }
                        }}
                    >
                        Home
          </Button>
                    <Button
                        component={Link}
                        to="/combos"
                        className={location.pathname === '/combos' ? 'active' : ''}
                        sx={{
                            color: location.pathname === '/combos' ? '#e7552b' : 'inherit',
                            backgroundColor: location.pathname === '/combos' ? '#fff5d6' : 'transparent',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: location.pathname === '/combos' ? '#fff5d6' : 'transparent',
                            }
                        }}
                    >
                        Combos
          </Button>
                </div>
                <div className="nav-right">
                    <Button
                        component={Link}
                        to="/milestones"
                        className={location.pathname === '/milestones' ? 'active' : ''}
                        sx={{
                            color: location.pathname === '/milestones' ? '#e7552b' : 'inherit',
                            backgroundColor: location.pathname === '/milestones' ? '#fff5d6' : 'transparent',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: location.pathname === '/milestones' ? '#fff5d6' : 'transparent',
                            }
                        }}
                    >
                        Milestones
          </Button>
                    <Button
                        component={Link}
                        to="/matches"
                        className={location.pathname === '/matches' ? 'active' : ''}
                        sx={{
                            color: location.pathname === '/matches' ? '#e7552b' : 'inherit',
                            backgroundColor: location.pathname === '/matches' ? '#fff5d6' : 'transparent',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: location.pathname === '/matches' ? '#fff5d6' : 'transparent',
                            }
                        }}
                    >
                        Matches
          </Button>
                </div>
                <IconButton
                    edge="start"
                    aria-label="menu"
                    onClick={handleMenuOpen}
                    sx={{ display: { xs: 'block',sm: 'none' },color: '#e7552b',ml: 'auto' }}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: {
                            backgroundColor: '#e7552b',
                            width: 'calc(100% - 32px)',
                            marginTop: '20px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                        },
                    }}
                    sx={{ display: { xs: 'block',sm: 'none' } }}
                >
                    <MenuItem
                        onClick={handleMenuClose}
                        component={Link}
                        to="/"
                        className={location.pathname === '/' ? 'active' : ''}
                        sx={{
                            color: location.pathname === '/' ? '#e7552b' : '#fff5d6',
                            backgroundColor: location.pathname === '/' ? '#fff5d6' : 'transparent',
                            fontFamily: 'coolvetica',
                            width: '100%',
                            textAlign: 'center',
                            '&:hover': {
                                backgroundColor: location.pathname === '/' ? '#fff5d6' : 'transparent',
                                color: location.pathname === '/' ? '#e7552b' : '#fff5d6',
                            }
                        }}
                    >
                        Home
          </MenuItem>
                    <MenuItem
                        onClick={handleMenuClose}
                        component={Link}
                        to="/combos"
                        className={location.pathname === '/combos' ? 'active' : ''}
                        sx={{
                            color: location.pathname === '/combos' ? '#e7552b' : '#fff5d6',
                            backgroundColor: location.pathname === '/combos' ? '#fff5d6' : 'transparent',
                            fontFamily: 'coolvetica',
                            width: '100%',
                            textAlign: 'center',
                            '&:hover': {
                                backgroundColor: location.pathname === '/combos' ? '#fff5d6' : 'transparent',
                                color: location.pathname === '/combos' ? '#e7552b' : '#fff5d6',
                            }
                        }}
                    >
                        Combos
          </MenuItem>
                    <MenuItem
                        onClick={handleMenuClose}
                        component={Link}
                        to="/milestones"
                        className={location.pathname === '/milestones' ? 'active' : ''}
                        sx={{
                            color: location.pathname === '/milestones' ? '#e7552b' : '#fff5d6',
                            backgroundColor: location.pathname === '/milestones' ? '#fff5d6' : 'transparent',
                            fontFamily: 'coolvetica',
                            width: '100%',
                            textAlign: 'center',
                            '&:hover': {
                                backgroundColor: location.pathname === '/milestones' ? '#fff5d6' : 'transparent',
                                color: location.pathname === '/milestones' ? '#e7552b' : '#fff5d6',
                            }
                        }}
                    >
                        Milestones
          </MenuItem>
                    <MenuItem
                        onClick={handleMenuClose}
                        component={Link}
                        to="/matches"
                        className={location.pathname === '/matches' ? 'active' : ''}
                        sx={{
                            color: location.pathname === '/matches' ? '#e7552b' : '#fff5d6',
                            backgroundColor: location.pathname === '/matches' ? '#fff5d6' : 'transparent',
                            fontFamily: 'coolvetica',
                            width: '100%',
                            textAlign: 'center',
                            '&:hover': {
                                backgroundColor: location.pathname === '/matches' ? '#fff5d6' : 'transparent',
                                color: location.pathname === '/matches' ? '#e7552b' : '#fff5d6',
                            }
                        }}
                    >
                        Matches
          </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
