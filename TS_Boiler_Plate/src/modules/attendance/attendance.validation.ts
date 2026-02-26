import { z } from 'zod';

export const createAttendanceSchema = z.object({
    body: z.object({
        employee_id: z.coerce.number().int().positive(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format: YYYY-MM-DD'),
        check_in_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Format: HH:MM or HH:MM:SS'),
    }),
});

export const updateAttendanceSchema = z.object({
    body: z.object({
        check_in_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Format: HH:MM or HH:MM:SS'),
    }),
    params: z.object({
        id: z.coerce.number().int().positive(),
    }),
});

export const getAttendanceSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive(),
    }),
});

export const listAttendanceSchema = z.object({
    query: z.object({
        employee_id: z.coerce.number().int().positive().optional(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        page: z.coerce.number().int().positive().optional(),
        limit: z.coerce.number().int().positive().optional(),
    }),
});

export type CreateAttendanceBody = z.infer<typeof createAttendanceSchema>['body'];
export type UpdateAttendanceBody = z.infer<typeof updateAttendanceSchema>['body'];
export type ListAttendanceQuery = z.infer<typeof listAttendanceSchema>['query'];