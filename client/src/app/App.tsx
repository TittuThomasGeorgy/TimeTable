import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import './App.css'
import { SnackbarProvider } from "notistack";
import Router from '../routes';
import useCustomTheme from '../theme/theme';
import AppInitializer from "./AppInitializer";
import { LoaderProvider } from "../hooks/contexts/LoaderContext";
function App() {
  const theme = useCustomTheme()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <LoaderProvider>
          <AppInitializer>
            <Router />
            {/* </AuthProvider> */}
            {/* <div>hi</div> */}
          </AppInitializer>
        </LoaderProvider>
      </SnackbarProvider>
    </ThemeProvider >
  )
}

export default App
