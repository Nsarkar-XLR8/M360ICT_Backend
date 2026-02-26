import { StatusCodes } from 'http-status-codes';
import db from '../../config/database.js';
import AppError from '../../errors/AppError.js';
import type {
    AttendanceSummary,
    ReportQuery,
    AttendanceReportResponse,
} from './report.interface.js';

const LATE_THRESHOLD = '09:45:00';

export class ReportService {
    async getMonthlyAttendanceReport(
        query: ReportQuery
    ): Promise<AttendanceReportResponse> {
        // Validate month format
        const [year, month] = query.month.split('-');

        if (!year || !month) {
            throw AppError.of(StatusCodes.BAD_REQUEST, 'Invalid month format', [
                { path: 'month', message: 'Format must be YYYY-MM' },
            ]);
        }

        // Build date range
        const from = `${query.month}-01`;
        const lastDay = new Date(Number(year), Number(month), 0).getDate();
        const to = `${query.month}-${String(lastDay).padStart(2, '0')}`;

        // Base query — join attendance with employees
        const baseQuery = db('attendance')
            .join('employees', 'attendance.employee_id', 'employees.id')
            .whereNull('employees.deleted_at')
            .whereBetween('attendance.date', [from, to]);

        // Optional filter by employee_id
        if (query.employee_id !== undefined) {
            void baseQuery.where('attendance.employee_id', query.employee_id);
        }

        // Get raw attendance data
        const rows = await baseQuery.select(
            'employees.id as employee_id',
            'employees.name as name',
            'attendance.check_in_time'
        );

        if (rows.length === 0) {
            return {
                month: query.month,
                data: [],
            };
        }

        // Group and calculate per employee
        const summaryMap = new Map<number, AttendanceSummary>();

        for (const row of rows as {
            employee_id: number;
            name: string;
            check_in_time: string;
        }[]) {
            const existing = summaryMap.get(row.employee_id);

            const isLate = row.check_in_time > LATE_THRESHOLD;

            if (existing) {
                existing.days_present += 1;
                if (isLate) existing.times_late += 1;
            } else {
                summaryMap.set(row.employee_id, {
                    employee_id: row.employee_id,
                    name: row.name,
                    days_present: 1,
                    times_late: isLate ? 1 : 0,
                });
            }
        }

        return {
            month: query.month,
            data: Array.from(summaryMap.values()),
        };
    }
}