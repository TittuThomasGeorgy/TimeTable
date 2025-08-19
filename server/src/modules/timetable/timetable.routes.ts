import { Router } from 'express';
import { createTimetable, deleteTimetable, getTimetableByIdReq, getTimetables, updateTimetable } from './timetable.controller';

const timetableRoutes = Router();

timetableRoutes.get('/', getTimetables);
timetableRoutes.post('/', createTimetable);
timetableRoutes.get('/:id', getTimetableByIdReq);
timetableRoutes.patch('/:id', updateTimetable);
timetableRoutes.delete('/:id', deleteTimetable);

export default timetableRoutes;