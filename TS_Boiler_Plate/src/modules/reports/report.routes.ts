import { Router } from 'express';
import { ReportController } from './report.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { attendanceReportSchema } from './report.validation.js';

const router = Router();
const reportController = new ReportController();

router.use(authenticate);

router.get(
    '/attendance',
    validateRequest(attendanceReportSchema),
    reportController.getAttendanceReport
);

export const ReportRoutes = router;