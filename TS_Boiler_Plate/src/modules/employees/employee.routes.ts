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

/**
 * @openapi
 * /api/v1/employees/get-all:
 *   get:
 *     tags:
 *       - Employees
 *     summary: List all employees
 *     description: Returns a paginated list of active (non-deleted) employees. Supports search, sorting, and pagination.
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by employee name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, age, salary, hiring_date, created_at]
 *           default: created_at
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Paginated employee list
 *       401:
 *         description: Unauthorized
 */
router.get('/get-all', validateRequest(listEmployeeSchema), employeeController.getAll);

/**
 * @openapi
 * /api/v1/employees/{id}:
 *   get:
 *     tags:
 *       - Employees
 *     summary: Get employee by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee data
 *       404:
 *         description: Employee not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', validateRequest(getEmployeeSchema), employeeController.getById);

/**
 * @openapi
 * /api/v1/employees/create:
 *   post:
 *     tags:
 *       - Employees
 *     summary: Create a new employee
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - designation
 *               - hiring_date
 *               - date_of_birth
 *               - salary
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               age:
 *                 type: integer
 *                 example: 30
 *               designation:
 *                 type: string
 *                 example: Software Engineer
 *               hiring_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: "1994-05-20"
 *               salary:
 *                 type: number
 *                 example: 75000.00
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
router.post('/create', upload.single('photo'), validateRequest(createEmployeeSchema), employeeController.create);

/**
 * @openapi
 * /api/v1/employees/{id}:
 *   put:
 *     tags:
 *       - Employees
 *     summary: Update an employee
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               designation:
 *                 type: string
 *               hiring_date:
 *                 type: string
 *                 format: date
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               salary:
 *                 type: number
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', upload.single('photo'), validateRequest(updateEmployeeSchema), employeeController.update);

/**
 * @openapi
 * /api/v1/employees/{id}:
 *   delete:
 *     tags:
 *       - Employees
 *     summary: Soft-delete an employee
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
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', validateRequest(getEmployeeSchema), employeeController.delete);

export const EmployeeRoutes = router;