import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { notFound } from './middlewares/notFound.middleware';
import { errorHandler } from './middlewares/error.middleware';
import router from './routes';

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/', router);
app.use(notFound); // global error handler
app.use(errorHandler); // global error handler

export default app;
