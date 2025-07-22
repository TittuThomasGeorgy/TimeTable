import { lazy } from 'react';
import type { ModuleRoute } from '../../types/ModuleRoute';
import { Person as TeacherIcon } from '@mui/icons-material';
import ViewClassPage from './pages/ViewTeacher';

const ClassPage = lazy(() => import('./pages/ClassPage'));

const ClassPageRoutes: ModuleRoute = {
    base: '/class',
    pages: [
        {
            title: 'Teacher',
            path: '/',
            element: <ClassPage />,
            showInDrawer: true,
            icon: <TeacherIcon />,
        },
        {
            title: 'View Teacher',
            path: '/:id',
            element: <ViewClassPage />,

        },

    ],
};

export default ClassPageRoutes;