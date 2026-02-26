import { z } from 'zod';

export const createEmployeeSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        age: z.coerce.number().int().min(18).max(65),
        designation: z.string().min(1, 'Designation is required'),
        hiring_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format: YYYY-MM-DD'),
        date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format: YYYY-MM-DD'),
        salary: z.coerce.number().positive('Salary must be positive'),
    }),
});

export const updateEmployeeSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        age: z.coerce.number().int().min(18).max(65).optional(),
        designation: z.string().min(1).optional(),
        hiring_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        salary: z.coerce.number().positive().optional(),
    }),
    params: z.object({
        id: z.coerce.number().int().positive(),
    }),
});

export const getEmployeeSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive(),
    }),
});

export const listEmployeeSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().optional(),
        limit: z.coerce.number().int().positive().optional(),
        sortBy: z.enum(['name', 'age', 'salary', 'hiring_date', 'created_at']).optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
        search: z.string().optional(),
    }),
});

export type CreateEmployeeBody = z.infer<typeof createEmployeeSchema>['body'];
export type UpdateEmployeeBody = z.infer<typeof updateEmployeeSchema>['body'];
export type ListEmployeeQuery = z.infer<typeof listEmployeeSchema>['query'];