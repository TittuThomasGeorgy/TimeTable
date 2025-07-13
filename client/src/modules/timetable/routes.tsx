import { lazy } from 'react';
import type { ModuleRoute } from '../../types/ModuleRoute';
import { TableBar as TimeTableIcon } from '@mui/icons-material';

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
        
    ],
};

export default TimeTablePageRoutes;