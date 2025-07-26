import { Router } from 'express';
import { createSubject, getSubjectByIdReq, getSubjects, updateSubject } from './subject.controller';

const subjectRoutes = Router();

subjectRoutes.get('/', getSubjects);
subjectRoutes.post('/', createSubject);
subjectRoutes.get('/:id', getSubjectByIdReq);
subjectRoutes.patch('/:id', updateSubject);

export default subjectRoutes;