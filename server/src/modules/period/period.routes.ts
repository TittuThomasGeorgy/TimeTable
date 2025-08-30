import { Router } from 'express';
import { getPeriods, shuffleAllPeriods, shufflePeriods, } from './period.controller';

const periodRoutes = Router();

periodRoutes.get('/', getPeriods);
periodRoutes.post('/shuffle/:id', shufflePeriods);
periodRoutes.post('/:id', shuffleAllPeriods);


export default periodRoutes;