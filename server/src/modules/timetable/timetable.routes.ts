import { Router } from 'express';
import { createTimetable, getTimetableByIdReq, getTimetables, updateTimetable } from './timetable.controller';

const timetableRoutes = Router();

timetableRoutes.get('/', getTimetables);
timetableRoutes.post('/', createTimetable);
timetableRoutes.get('/:id', getTimetableByIdReq);
timetableRoutes.patch('/:id', updateTimetable);

export default timetableRoutes;