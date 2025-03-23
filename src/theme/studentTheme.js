import { createTheme } from '@mui/material';

export const studentTheme = {
  colors: {
    primary: {
      main: '#1a237e', // Deep blue
      light: '#534bae',
      dark: '#000051',
      gradient: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
    },
    secondary: {
      main: '#0288d1', // Light blue
      light: '#5eb8ff',
      dark: '#005b9f',
    },
    background: {
      default: '#f5f5f5',
      paper: 'rgba(26, 35, 126, 0.15)',
      gradient: 'linear-gradient(135deg, rgba(26, 35, 126, 0.1) 0%, rgba(13, 71, 161, 0.1) 50%, rgba(1, 87, 155, 0.1) 100%)',
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
      background: 'rgba(26, 35, 126, 0.15)',
      blur: '30px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    },
    buttons: {
      gradient: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
      hoverGradient: 'linear-gradient(135deg, #283593 0%, #1565c0 100%)',
    },
  },
}; 