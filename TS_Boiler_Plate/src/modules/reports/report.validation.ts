import { z } from 'zod';

export const attendanceReportSchema = z.object({
    query: z.object({
        month: z
            .string()
            .regex(/^\d{4}-\d{2}$/, 'Format must be YYYY-MM'),
        employee_id: z.coerce.number().int().positive().optional(),
    }),
});

export type AttendanceReportQuery = z.infer<typeof attendanceReportSchema>['query'];