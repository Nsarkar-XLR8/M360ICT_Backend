import { StatusCodes } from 'http-status-codes';
import db from '../../config/database.js';
import AppError from '../../errors/AppError.js';
import { buildPagination } from '../../utils/pagination.js';
import type {
    Attendance,
    AttendanceRecord,
    CreateAttendanceInput,
    UpdateAttendanceInput,
    AttendanceQuery,
    PaginatedAttendance,
} from './attendance.interface.js';
import { Knex } from 'knex';

export class AttendanceService {
    async getAll(query: AttendanceQuery): Promise<PaginatedAttendance> {
        const { page, limit, skip } = buildPagination(
            {
                ...(query.page !== undefined && { page: query.page }),
                ...(query.limit !== undefined && { limit: query.limit }),
            },
            { defaultLimit: 10, maxLimit: 100 }
        );

        const applyFilters = (qb: Knex.QueryBuilder) => {
            if (query.employee_id !== undefined) {
                void qb.where('employee_id', query.employee_id);
            }
            if (query.date !== undefined) {
                void qb.where('date', query.date);
            }
            if (query.from !== undefined) {
                void qb.where('date', '>=', query.from);
            }
            if (query.to !== undefined) {
                void qb.where('date', '<=', query.to);
            }
        };

        const [countRow] = await db<Attendance>('attendance')
            .modify(applyFilters)
            .count('id as count');

        const total = Number((countRow as { count: number }).count);

        const data = await db<Attendance>('attendance')
            .modify(applyFilters)
            .orderBy('date', 'desc')
            .orderBy('check_in_time', 'desc')
            .limit(limit)
            .offset(skip);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getById(id: number): Promise<Attendance> {
        const attendance = await db<Attendance>('attendance').where({ id }).first();

        if (!attendance) {
            throw AppError.of(StatusCodes.NOT_FOUND, 'Attendance record not found', [
                { path: 'id', message: `No attendance found with id ${id}` },
            ]);
        }

        return attendance;
    }

    async upsert(input: CreateAttendanceInput): Promise<Attendance> {
        // Check if employee exists
        const employee = await db('employees')
            .where({ id: input.employee_id })
            .whereNull('deleted_at')
            .first();

        if (!employee) {
            throw AppError.of(StatusCodes.NOT_FOUND, 'Employee not found', [
                { path: 'employee_id', message: `No employee found with id ${input.employee_id}` },
            ]);
        }

        // Check if record already exists for this employee + date
        const existing = await db<Attendance>('attendance')
            .where({ employee_id: input.employee_id, date: input.date })
            .first();

        if (existing) {
            // Update existing record
            await db<AttendanceRecord>('attendance')
                .where({ id: existing.id })
                .update({
                    check_in_time: input.check_in_time,
                    updated_at: new Date(),
                });

            return this.getById(existing.id);
        }

        // Insert new record
        const [id] = await db<AttendanceRecord>('attendance').insert({
            employee_id: input.employee_id,
            date: input.date,
            check_in_time: input.check_in_time,
            created_at: new Date(),
            updated_at: new Date(),
        });

        if (!id) {
            throw AppError.of(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create attendance', [
                { path: 'general', message: 'Insert failed' },
            ]);
        }

        return this.getById(id);

    }

    async update(id: number, input: UpdateAttendanceInput): Promise<Attendance> {
        await this.getById(id);

        await db<AttendanceRecord>('attendance').where({ id }).update({
            ...(input.check_in_time !== undefined && { check_in_time: input.check_in_time }),
            updated_at: new Date(),
        });

        return this.getById(id);
    }

    async delete(id: number): Promise<void> {
        await this.getById(id);
        await db<AttendanceRecord>('attendance').where({ id }).delete();
    }
}