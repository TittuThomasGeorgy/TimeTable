import { ThemeProvider } from "@emotion/react";
import {  CssBaseline } from "@mui/material";
import './App.css'
import { SnackbarProvider } from "notistack";
import Router from '../routes';
import useCustomTheme from '../theme/theme';
function App() {
  const theme = useCustomTheme()
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
