import { Router } from 'express';
import { createClassSubject, getClassSubjects, updateClassSubject } from './classSubject.controller';

const classSubjectRoutes = Router();

classSubjectRoutes.post('/', createClassSubject);
classSubjectRoutes.get('/:id', getClassSubjects);
classSubjectRoutes.patch('/:id', updateClassSubject);

export default classSubjectRoutes;