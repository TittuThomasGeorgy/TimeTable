import { lazy } from 'react';
import type { ModuleRoute } from '../../types/ModuleRoute';
import { Person as TeacherIcon } from '@mui/icons-material';

const TeacherPage = lazy(() => import('./pages/TeacherPage'));
const ViewTeacherPage = lazy(() => import('./pages/ViewTeacher'));

const TeacherPageRoutes: ModuleRoute = {
    base: '/teacher',
    pages: [
        {
            title: 'Teacher',
            path: '/',
            element: <TeacherPage />,
            showInDrawer: true,
            icon: <TeacherIcon />,
        },
        {
            title: 'View Teacher',
            path: '/:id',
            element: <ViewTeacherPage />,

        },

    ],
};

export default TeacherPageRoutes;