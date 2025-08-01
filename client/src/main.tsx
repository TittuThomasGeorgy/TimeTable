import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './app/App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>

    <App />
  </QueryClientProvider>
  // </StrictMode>,
)
