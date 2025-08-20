import { Router } from 'express';
import { getRemarks } from './remarks.controller';

const remarkRoutes = Router();

remarkRoutes.get('/', getRemarks);


export default remarkRoutes;