// src/pages/ErrorPage.tsx
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <Typography variant="h2" color="error" gutterBottom>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" mb={3}>
        An unexpected error has occurred. Please try again later.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Go to Home
      </Button>
    </Container>
  );
};

export default ErrorPage;
