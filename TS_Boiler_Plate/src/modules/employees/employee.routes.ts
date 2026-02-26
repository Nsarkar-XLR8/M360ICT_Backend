import { Router } from 'express';
import { EmployeeController } from './employee.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { upload } from '../../middlewares/multerMiddleware.js';
import validateRequest from '../../middlewares/validateRequest.js';
import {
    createEmployeeSchema,
    updateEmployeeSchema,
    getEmployeeSchema,
    listEmployeeSchema,
} from './employee.validation.js';

const router = Router();
const employeeController = new EmployeeController();

router.use(authenticate);

router.get('/get-all', validateRequest(listEmployeeSchema), employeeController.getAll);
router.get('/:id', validateRequest(getEmployeeSchema), employeeController.getById);
router.post('/create', upload.single('photo'), validateRequest(createEmployeeSchema), employeeController.create);
router.put('/:id', upload.single('photo'), validateRequest(updateEmployeeSchema), employeeController.update);
router.delete('/:id', validateRequest(getEmployeeSchema), employeeController.delete);

export const EmployeeRoutes = router;