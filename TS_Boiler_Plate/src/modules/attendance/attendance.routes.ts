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

router.get('/get-all', validateRequest(listAttendanceSchema), attendanceController.getAll);
router.get('/:id', validateRequest(getAttendanceSchema), attendanceController.getById);
router.post('/create', validateRequest(createAttendanceSchema), attendanceController.upsert);
router.put('/:id', validateRequest(updateAttendanceSchema), attendanceController.update);
router.delete('/:id', validateRequest(getAttendanceSchema), attendanceController.delete);

export const AttendanceRoutes = router;