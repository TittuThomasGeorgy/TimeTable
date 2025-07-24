import { lazy } from 'react';
import type { ModuleRoute } from '../../types/ModuleRoute';
import { School as ClassIcon } from '@mui/icons-material';
// import ViewClassPage from './pages/ViewClass';

const ClassPage = lazy(() => import('./pages/ClassPage'));
const ViewClassPage = lazy(() => import('./pages/ViewClassPage'));

const ClassPageRoutes: ModuleRoute = {
    base: '/class',
    pages: [
        {
            title: 'Class',
            path: '/',
            element: <ClassPage />,
            showInDrawer: true,
            icon: <ClassIcon />,
        },
        {
            title: 'View Class',
            path: '/:id',
            element: <ViewClassPage />,

        },

    ],
};

export default ClassPageRoutes;