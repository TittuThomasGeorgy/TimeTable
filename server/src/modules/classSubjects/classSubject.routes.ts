import { Router } from 'express';
import { createClassSubject, deleteClassSubject, getClassSubjects, updateClassSubject } from './classSubject.controller';

const classSubjectRoutes = Router();

classSubjectRoutes.post('/', createClassSubject);
classSubjectRoutes.get('/:id', getClassSubjects);
classSubjectRoutes.patch('/:id', updateClassSubject);
classSubjectRoutes.delete('/:id', deleteClassSubject);

export default classSubjectRoutes;