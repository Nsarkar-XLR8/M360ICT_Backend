import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AttendanceService } from './attendance.service.js';
import catchAsync from '../../utils/catchAsync.js';
import type {
    CreateAttendanceBody,
    UpdateAttendanceBody,
    ListAttendanceQuery,
} from './attendance.validation.js';

const attendanceService = new AttendanceService();

export class AttendanceController {
    getAll = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const query = req.validated?.query as ListAttendanceQuery;

        const result = await attendanceService.getAll(query ?? {});

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Attendance records retrieved successfully',
            ...result,
        });
    });

    getById = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const id = Number(req.params['id']);

        const attendance = await attendanceService.getById(id);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Attendance record retrieved successfully',
            data: attendance,
        });
    });

    upsert = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const body = req.validated?.body as CreateAttendanceBody;

        const attendance = await attendanceService.upsert(body);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Attendance recorded successfully',
            data: attendance,
        });
    });

    update = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const id = Number(req.params['id']);
        const body = req.validated?.body as UpdateAttendanceBody;

        const attendance = await attendanceService.update(id, body);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Attendance updated successfully',
            data: attendance,
        });
    });

    delete = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const id = Number(req.params['id']);

        await attendanceService.delete(id);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Attendance deleted successfully',
        });
    });
}