import { Router } from 'express';
import { createTeacher, getTeachers } from './teacher.controller';

const teacherRoutes = Router();

teacherRoutes.post('/', createTeacher);
teacherRoutes.get('/', getTeachers);

export default teacherRoutes;