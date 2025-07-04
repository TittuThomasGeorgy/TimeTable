import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));

const HomeRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
];

export default HomeRoutes;