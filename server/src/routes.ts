import { Router } from 'express';
import teacherRoutes from './modules/teacher/teacher.routes';
import classRoutes from './modules/class/class.routes';
import subjectRoutes from './modules/subject/subject.routes';
import classSubjectRoutes from './modules/classSubjects/classSubject.routes';
import timetableRoutes from './modules/timetable/timetable.routes';
import periodRoutes from './modules/period/period.routes';

const router = Router();

router.use('/teachers', teacherRoutes);
router.use('/classes', classRoutes);
router.use('/class_sub', classSubjectRoutes);
router.use('/subjects', subjectRoutes);
router.use('/timetable', timetableRoutes);
router.use('/period', periodRoutes);

export default router;