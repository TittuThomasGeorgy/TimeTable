import { lazy } from 'react';
import type { ModuleRoute } from '../../types/ModuleRoute';
import { TableChart as TimeTableIcon } from '@mui/icons-material';
import ViewTimetablePage from './pages/ViewTimetablePage';

const TimeTablePage = lazy(() => import('./pages/TimeTablePage'));

const TimeTablePageRoutes: ModuleRoute = {
    base: '/timetable',
    pages: [
        {
            title: 'TimeTable',
            path: '/',
            element: <TimeTablePage />,
            showInDrawer: true,
            icon: <TimeTableIcon />,
            
        },
         {
            title: 'View Timetable',
            path: '/:id',
            element: <ViewTimetablePage />,

        },
        
    ],
};

export default TimeTablePageRoutes;