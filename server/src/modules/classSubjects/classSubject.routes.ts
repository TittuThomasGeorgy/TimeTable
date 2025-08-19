import { Router } from 'express';
import { createClassSubject, deleteClassSubject, getAllClassSubjects, getClassSubjects, importClassSubject, updateClassSubject } from './classSubject.controller';

const classSubjectRoutes = Router();

classSubjectRoutes.post('/', createClassSubject);
classSubjectRoutes.post('/:id', importClassSubject);
classSubjectRoutes.get('/', getAllClassSubjects);
classSubjectRoutes.get('/:id', getClassSubjects);
classSubjectRoutes.patch('/:id', updateClassSubject);
classSubjectRoutes.delete('/:id', deleteClassSubject);

export default classSubjectRoutes;