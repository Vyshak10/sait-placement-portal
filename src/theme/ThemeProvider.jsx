import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { studentTheme } from './studentTheme';
import { companyTheme } from './companyTheme';

export const ThemeProvider = ({ userType, children }) => {
  const theme = userType === 'company' ? companyTheme : studentTheme;

  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  );
}; 