import { lazy } from 'react';
import type { ModuleRoute } from '../../types/ModuleRoute';
import { Home as HomeIcon } from '@mui/icons-material';

const HomePage = lazy(() => import('./pages/HomePage'));

const HomePageRoutes: ModuleRoute = {
    base: '',
    pages: [
        {
            title: 'Home',
            path: '/',
            element: <HomePage />,
            showInDrawer: true,
            icon: <HomeIcon />,
        },
        
    ],
};

export default HomePageRoutes;