import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ReportService } from './report.service.js';
import catchAsync from '../../utils/catchAsync.js';
import type { AttendanceReportQuery } from './report.validation.js';

const reportService = new ReportService();

export class ReportController {
    getAttendanceReport = catchAsync(
        async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
            const query = req.validated?.query as AttendanceReportQuery;

            const result = await reportService.getMonthlyAttendanceReport({
                month: query.month,
                ...(query.employee_id !== undefined && { employee_id: query.employee_id }),
            });

            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Attendance report generated successfully',
                ...result,
            });
        }
    );
}