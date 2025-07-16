import { Router } from 'express';
import { createTeacher, getTeacherByIdReq, getTeachers } from './teacher.controller';

const teacherRoutes = Router();

teacherRoutes.post('/', createTeacher);
teacherRoutes.get('/', getTeachers);
teacherRoutes.get('/:id', getTeacherByIdReq);

export default teacherRoutes;