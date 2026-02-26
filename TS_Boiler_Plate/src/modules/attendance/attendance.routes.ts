import { Router } from 'express';
import { AttendanceController } from './attendance.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';
import validateRequest from '../../middlewares/validateRequest.js';
import {
    createAttendanceSchema,
    updateAttendanceSchema,
    getAttendanceSchema,
    listAttendanceSchema,
} from './attendance.validation.js';

const router = Router();
const attendanceController = new AttendanceController();

router.use(authenticate);

/**
 * @openapi
 * /api/v1/attendance/get-all:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: List all attendance records
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: employee_id
 *         schema:
 *           type: integer
 *         description: Filter by employee ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Paginated attendance records
 *       401:
 *         description: Unauthorized
 */
router.get('/get-all', validateRequest(listAttendanceSchema), attendanceController.getAll);

/**
 * @openapi
 * /api/v1/attendance/{id}:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: Get attendance record by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attendance record
 *       404:
 *         description: Record not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', validateRequest(getAttendanceSchema), attendanceController.getById);

/**
 * @openapi
 * /api/v1/attendance/create:
 *   post:
 *     tags:
 *       - Attendance
 *     summary: Create or upsert an attendance record
 *     description: Creates a new attendance record for an employee on a given date. If a record for the same employee+date already exists it is updated (upsert).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employee_id
 *               - date
 *               - check_in_time
 *             properties:
 *               employee_id:
 *                 type: integer
 *                 example: 1
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-03-15"
 *               check_in_time:
 *                 type: string
 *                 example: "09:00:00"
 *     responses:
 *       200:
 *         description: Attendance record created or updated
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
router.post('/create', validateRequest(createAttendanceSchema), attendanceController.upsert);

/**
 * @openapi
 * /api/v1/attendance/{id}:
 *   put:
 *     tags:
 *       - Attendance
 *     summary: Update an attendance record
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               check_in_time:
 *                 type: string
 *                 example: "09:30:00"
 *     responses:
 *       200:
 *         description: Attendance updated
 *       404:
 *         description: Record not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', validateRequest(updateAttendanceSchema), attendanceController.update);

/**
 * @openapi
 * /api/v1/attendance/{id}:
 *   delete:
 *     tags:
 *       - Attendance
 *     summary: Delete an attendance record
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attendance deleted
 *       404:
 *         description: Record not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', validateRequest(getAttendanceSchema), attendanceController.delete);

export const AttendanceRoutes = router;