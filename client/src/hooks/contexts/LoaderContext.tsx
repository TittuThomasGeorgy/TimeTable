import React, { useCallback, useState } from 'react';
import type { LoaderContextType } from '../../types/CommonTypes';
import { Box } from '@mui/material';
import Animations from '../../animations';
import Lottie from 'react-lottie';
import { LoaderContext } from '../useLoader';

interface LoaderProviderProps {
  children: React.ReactNode;
}

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
  const [count, setCount] = useState(0);

  const onLoad = useCallback(() => setCount((prev) => prev + 1), []);
  const offLoad = useCallback(() => setCount((prev) => Math.max(0, prev - 1)), []);

  const value: LoaderContextType = { count, onLoad, offLoad };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Animations.loading,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <LoaderContext.Provider value={value}>
      {children}
      {count > 0 && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
          }}
        >
          <Lottie options={defaultOptions} height={200} width={200} />
        </Box>
      )}
    </LoaderContext.Provider>
  );
};
