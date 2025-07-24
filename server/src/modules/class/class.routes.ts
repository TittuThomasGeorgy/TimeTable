import { Router } from 'express';
import { createClass, getClassByIdReq, getClasses, updateClass } from './class.controller';

const classRoutes = Router();

classRoutes.get('/', getClasses);
classRoutes.post('/', createClass);
classRoutes.get('/:id', getClassByIdReq);
classRoutes.patch('/:id', updateClass);

export default classRoutes;