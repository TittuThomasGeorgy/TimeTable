import { Router } from 'express';
import { createTeacher } from './teacher.controller';

const teacherRoutes = Router();

teacherRoutes.post('/', createTeacher);

export default teacherRoutes;