import { Router } from 'express';
import { getPeriodByClzId, getPeriods, shuffleAllPeriods, shufflePeriods, } from './period.controller';

const periodRoutes = Router();

periodRoutes.get('/', getPeriods);
periodRoutes.get('/class/:classId', getPeriodByClzId  );
periodRoutes.post('/shuffle/:id', shufflePeriods);
periodRoutes.post('/:id', shuffleAllPeriods);


export default periodRoutes;