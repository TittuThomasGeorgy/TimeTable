import { lazy } from 'react';
import type { ModuleRoute } from '../../types/ModuleRoute';
import { MenuBook as SubjectIcon } from '@mui/icons-material';
// import ViewSubjectPage from './pages/ViewSubject';

const SubjectPage = lazy(() => import('./pages/SubjectPage'));
const ViewSubjectPage = lazy(() => import('./pages/ViewSubjectPage'));

const SubjectPageRoutes: ModuleRoute = {
    base: '/subject',
    pages: [
        {
            title: 'Subjects',
            path: '/',
            element: <SubjectPage />,
            showInDrawer: true,
            icon: <SubjectIcon />,
        },
        {
            title: 'View Subject',
            path: '/:id',
            element: <ViewSubjectPage />,

        },

    ],
};

export default SubjectPageRoutes;