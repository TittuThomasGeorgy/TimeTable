import { Router } from 'express';
import { createTeacher, getTeacherByIdReq, getTeachers, updateTeacher } from './teacher.controller';

const teacherRoutes = Router();

teacherRoutes.get('/', getTeachers);
teacherRoutes.post('/', createTeacher);
teacherRoutes.get('/:id', getTeacherByIdReq);
teacherRoutes.patch('/:id', updateTeacher);

export default teacherRoutes;