import { Router } from 'express';
import { createPeriod, getPeriodByIdReq, getPeriods, updatePeriod } from './period.controller';

const periodRoutes = Router();

periodRoutes.get('/', getPeriods);
periodRoutes.post('/', createPeriod);
periodRoutes.get('/:id', getPeriodByIdReq);
periodRoutes.patch('/:id', updatePeriod);

export default periodRoutes;