import { useMemo } from 'react'
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import './App.css'
import { SnackbarProvider } from "notistack";
import Router from '../routes';
function App() {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {

          background: {
            default: '#000000'
          },
          primary: {
            main: '#2196f3', // Primary blue
          },
          secondary: {
            main: '#ba68c8', // Secondary purple
          },
          success: {
            main: '#66bb6a', // Green for success
          },
          error: {
            main: '#e57373', // Red for errors
          },
          warning: {
            main: '#ffa726', // Orange for warnings
          },
          info: {
            main: '#29b6f6', // Light blue for informational
          },
        },
        // components: {

        //   MuiDrawer: {
        //     styleOverrides: {
        //       paper: {
        //         backgroundColor: '#1b253d',
        //       },
        //     },
        //   },
        //   MuiCard: {
        //     defaultProps: {
        //       elevation: 3,
        //     },
        //     styleOverrides: {
        //       root: {
        //         backgroundColor: '#1b253d',
        //       },
        //     },
        //   },
        //   MuiAppBar: {
        //     styleOverrides: {
        //       root: {
        //         backgroundColor: '#009688',
        //       },
        //     },
        //   },
        //   // MuiInputBase: {
        //   //   styleOverrides: {
        //   //     root: {
        //   //       color: 'white', // Text color
        //   //       backgroundColor: '#424242', // Background color
        //   //       '&::placeholder': {
        //   //         color: 'lightgrey', // Placeholder color
        //   //       },
        //   //       '&.Mui-disabled': {
        //   //         color: '#757575', // Disabled text color
        //   //         backgroundColor: '#303030', // Disabled background color
        //   //       },
        //   //     },
        //   //   },
        //   // },
        //   MuiButton: {
        //     styleOverrides: {
        //       root: {
        //         textTransform: 'none', // Remove uppercase transformation
        //         fontWeight: 'bold', // Add bold text
        //         borderRadius: 8, // Rounded corners
        //         marginBottom: 4,
        //       },
        //       containedPrimary: {
        //         background: 'linear-gradient(45deg, #1976d2, #42a5f5)', // Gradient for primary contained
        //         color: '#ffffff',
        //         '&:hover': {
        //           background: 'linear-gradient(45deg, #1565c0, #2196f3)', // Darker gradient on hover
        //         },
        //       },
        //       containedSecondary: {
        //         background: 'linear-gradient(45deg, #7b1fa2, #ba68c8)', // Gradient for secondary contained
        //         color: '#ffffff',
        //         '&:hover': {
        //           background: 'linear-gradient(45deg, #6a1b9a, #ab47bc)', // Darker gradient on hover
        //         },
        //       },
        //       containedSuccess: {
        //         background: 'linear-gradient(45deg, #388e3c, #66bb6a)', // Gradient for success contained
        //         color: '#ffffff',
        //         '&:hover': {
        //           background: 'linear-gradient(45deg, #2e7d32, #43a047)', // Darker gradient on hover
        //         },
        //       },
        //       containedError: {
        //         background: 'linear-gradient(45deg, #d32f2f, #e57373)', // Gradient for error contained
        //         color: '#ffffff',
        //         '&:hover': {
        //           background: 'linear-gradient(45deg, #c62828, #f44336)', // Darker gradient on hover
        //         },
        //       },
        //       outlinedPrimary: {
        //         border: '2px solid #2196f3', // Primary blue border
        //         color: '#2196f3',
        //         '&:hover': {
        //           border: '2px solid #1976d2',
        //           background: 'rgba(33, 150, 243, 0.1)', // Subtle blue hover background
        //         },
        //       },
        //       outlinedSecondary: {
        //         border: '2px solid #ba68c8', // Secondary purple border
        //         color: '#ba68c8',
        //         '&:hover': {
        //           border: '2px solid #ab47bc',
        //           background: 'rgba(186, 104, 200, 0.1)', // Subtle purple hover background
        //         },
        //       },
        //       textPrimary: {
        //         color: '#2196f3', // Primary text color
        //         '&:hover': {
        //           background: 'rgba(33, 150, 243, 0.1)', // Subtle blue hover background
        //         },
        //       },
        //       textSecondary: {
        //         color: '#ba68c8', // Secondary text color
        //         '&:hover': {
        //           background: 'rgba(186, 104, 200, 0.1)', // Subtle purple hover background
        //         },
        //       },
        //     },
        //   },
        // },

      }),
    []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        {/* <AuthProvider> */}
        <Router />
        {/* </AuthProvider> */}
        {/* <div>hi</div> */}
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
