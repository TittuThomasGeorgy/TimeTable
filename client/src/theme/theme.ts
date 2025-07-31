import { useMemo } from 'react';
import { createTheme, type Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * Custom hook to create a responsive MUI theme based on system dark mode preference.
 * @returns MUI Theme
 */
const useCustomTheme = (): Theme => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: light)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          background: {
            default: prefersDarkMode ? '#121212' : '#f7f7f7',
          },
          primary: {
            main: '#009688',
          },
        },
        components: {
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: prefersDarkMode ? '#1b253d' : '#FFFFFF',
              },
            },
          },
          MuiCard: {
            defaultProps: {
              elevation: 3,
            },
            styleOverrides: {
              root: {
                backgroundColor: prefersDarkMode ? '#1b253d' : '#FFFFFF',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: '#009688',
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              root: {
                color: prefersDarkMode ? 'white' : 'black',
                backgroundColor: prefersDarkMode ? '#424242' : '#f4f5f4',
                '&::placeholder': {
                  color: prefersDarkMode ? 'lightgrey' : 'grey',
                },
                '&.Mui-disabled': {
                  color: prefersDarkMode ? '#757575' : '#C0C0C0',
                  backgroundColor: prefersDarkMode ? '#303030' : '#F8F9FA',
                },
              },
            },
          },
          MuiAutocomplete: {
            styleOverrides: {
              root: {
                color: prefersDarkMode ? 'white' : 'black',
                backgroundColor: prefersDarkMode ? '#424242' : '#f4f5f4',
                borderRadius: 50,
                padding: 1,
                '& .MuiOutlinedInput-root': {
                  paddingLeft: '12px',
                  '& fieldset': {
                    borderColor: prefersDarkMode ? '#616161' : '#ccc',
                  },
                  '&:hover fieldset': {
                    borderColor: prefersDarkMode ? '#757575' : '#888',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: prefersDarkMode ? '#90caf9' : '#1976d2',
                  },
                  '&.Mui-disabled': {
                    color: prefersDarkMode ? '#757575' : '#C0C0C0',
                    backgroundColor: prefersDarkMode ? '#303030' : '#F8F9FA',
                  },
                },
              },
              inputRoot: {
                color: prefersDarkMode ? 'white' : 'black',
                backgroundColor: prefersDarkMode ? '#424242' : '#f4f5f4',
                '& .MuiInputBase-input': {
                  color: prefersDarkMode ? '#fff' : '#000',
                  '&::placeholder': {
                    color: prefersDarkMode ? 'lightgrey' : '#909190',
                  },
                  '&.Mui-disabled': {
                    color: prefersDarkMode ? '#757575' : '#C0C0C0',
                    backgroundColor: prefersDarkMode ? '#303030' : '#F8F9FA',
                  },
                },
              },
              paper: {
                backgroundColor: prefersDarkMode ? '#424242' : '#f4f5f4',
              },
              option: {
                backgroundColor: prefersDarkMode ? '#424242' : '#fff',
                '&[aria-selected="true"]': {
                  backgroundColor: prefersDarkMode ? '#616161' : '#f4f5f4',
                },
                '&:hover': {
                  backgroundColor: prefersDarkMode ? '#757575' : '#e0e0e0',
                },
                '&.Mui-disabled': {
                  color: prefersDarkMode ? '#757575' : '#C0C0C0',
                  backgroundColor: prefersDarkMode ? '#303030' : '#F8F9FA',
                },
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: "capitalize"
              }
            }
          },
          MuiIcon: {
            styleOverrides: {
              root: {
                color:'#009688',
              }
            }
          }
        },
      }),
    [prefersDarkMode]
  );

  return theme;
};

export default useCustomTheme;
