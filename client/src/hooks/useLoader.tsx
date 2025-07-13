import { createContext, useContext } from 'react';
import type { LoaderContextType } from '../types/LoaderContextType';

export const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};
