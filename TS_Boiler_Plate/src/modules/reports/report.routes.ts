import { Router } from 'express';
import { ReportController } from './report.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { attendanceReportSchema } from './report.validation.js';

const router = Router();
const reportController = new ReportController();

router.use(authenticate);

/**
 * @openapi
 * /api/v1/reports/attendance:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Generate attendance report
 *     description: Returns an attendance summary report optionally filtered by employee and/or date range.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employee_id
 *         schema:
 *           type: integer
 *         description: Filter report for a specific employee
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Attendance report data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Attendance report generated
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error (invalid date range)
 */
router.get(
    '/attendance',
    validateRequest(attendanceReportSchema),
    reportController.getAttendanceReport
);

export const ReportRoutes = router;