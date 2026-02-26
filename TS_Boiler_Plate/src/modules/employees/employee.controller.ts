import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { EmployeeService } from './employee.service.js';
import catchAsync from '../../utils/catchAsync.js';
import type {
    CreateEmployeeBody,
    UpdateEmployeeBody,
    ListEmployeeQuery,
} from './employee.validation.js';
import { UpdateEmployeeInput } from './employee.interface.js';
import { uploadToCloudinaryFromMulter } from '@/utils/cloudinary.js';

const employeeService = new EmployeeService();

export class EmployeeController {
    getAll = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const query = req.validated?.query as ListEmployeeQuery;

        const result = await employeeService.getAll(query ?? {});

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Employees retrieved successfully',
            ...result,
        });
    });

    getById = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const id = Number(req.params['id']);

        const employee = await employeeService.getById(id);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Employee retrieved successfully',
            data: employee,
        });
    });

    create = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const body = req.validated?.body as CreateEmployeeBody;

        let photo_path: string | undefined;

        if (req.file) {
            const uploaded = await uploadToCloudinaryFromMulter(req.file, 'hr/employees');
            photo_path = uploaded.secure_url;
        }

        const employee = await employeeService.create({
            ...body,
            ...(photo_path !== undefined && { photo_path }),
        });

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Employee created successfully',
            data: employee,
        });
    });

    update = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const id = Number(req.params['id']);
        const body = req.validated?.body as UpdateEmployeeBody;

        let photo_path: string | undefined;

        if (req.file) {
            const uploaded = await uploadToCloudinaryFromMulter(req.file, 'hr/employees');
            photo_path = uploaded.secure_url;
        }

        const updateInput: UpdateEmployeeInput = {
            ...(body.name !== undefined && { name: body.name }),
            ...(body.age !== undefined && { age: body.age }),
            ...(body.designation !== undefined && { designation: body.designation }),
            ...(body.hiring_date !== undefined && { hiring_date: body.hiring_date }),
            ...(body.date_of_birth !== undefined && { date_of_birth: body.date_of_birth }),
            ...(body.salary !== undefined && { salary: body.salary }),
            ...(photo_path !== undefined && { photo_path }),
        };

        const employee = await employeeService.update(id, updateInput);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Employee updated successfully',
            data: employee,
        });
    });

    delete = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const id = Number(req.params['id']);

        await employeeService.softDelete(id);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Employee deleted successfully',
        });
    });
}