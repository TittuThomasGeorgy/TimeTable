import { Router } from 'express';
import {  getPeriodByIdReq, getPeriods, updatePeriod } from './period.controller';

const periodRoutes = Router();

periodRoutes.get('/', getPeriods);


export default periodRoutes;