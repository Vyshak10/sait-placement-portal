import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import saitLogo from '../../assets/SAIT LOGO DARK.png';

const Navbar = ({ onMenuClick, title }) => {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <img 
            src={saitLogo} 
            alt="SAIT Logo" 
            style={{
              height: '40px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          <Typography variant="h6" component="div" sx={{ color: '#ffffff' }}>
            {title}
          </Typography>
        </Box>
        <IconButton color="inherit" onClick={onMenuClick}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 