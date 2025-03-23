import { createTheme } from '@mui/material';

export const companyTheme = {
  colors: {
    primary: {
      main: '#b71c1c', // Deep red
      light: '#f05545',
      dark: '#7f0000',
      gradient: 'linear-gradient(135deg, #b71c1c 0%, #c62828 50%, #d32f2f 100%)',
    },
    secondary: {
      main: '#d32f2f', // Light red
      light: '#ff6659',
      dark: '#9a0007',
    },
    background: {
      default: '#f5f5f5',
      paper: 'rgba(183, 28, 28, 0.15)',
      gradient: 'linear-gradient(135deg, rgba(183, 28, 28, 0.1) 0%, rgba(198, 40, 40, 0.1) 50%, rgba(211, 47, 47, 0.1) 100%)',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.9)',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    border: {
      main: 'rgba(255, 255, 255, 0.08)',
      hover: 'rgba(255, 255, 255, 0.15)',
    },
  },
  components: {
    glassMorphism: {
      background: 'rgba(183, 28, 28, 0.15)',
      blur: '30px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    },
    buttons: {
      gradient: 'linear-gradient(135deg, #b71c1c 0%, #c62828 100%)',
      hoverGradient: 'linear-gradient(135deg, #c62828 0%, #d32f2f 100%)',
    },
  },
}; 