import { Router } from 'express';
import { getPeriods, shufflePeriods, } from './period.controller';

const periodRoutes = Router();

periodRoutes.get('/', getPeriods);
periodRoutes.post('/:id', shufflePeriods);


export default periodRoutes;