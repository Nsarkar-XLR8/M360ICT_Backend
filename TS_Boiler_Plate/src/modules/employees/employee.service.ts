import { StatusCodes } from 'http-status-codes';
import db from '../../config/database.js';
import AppError from '../../errors/AppError.js';
import { buildPagination } from '../../utils/pagination.js';
import type {
    Employee,
    EmployeeRecord,
    CreateEmployeeInput,
    UpdateEmployeeInput,
    EmployeeQuery,
    PaginatedEmployees,
} from './employee.interface.js';

export class EmployeeService {
    async getAll(query: EmployeeQuery): Promise<PaginatedEmployees> {
        const { page, limit, skip, sortBy, sortOrder } = buildPagination(
            {
                ...(query.page !== undefined && { page: query.page }),
                ...(query.limit !== undefined && { limit: query.limit }),
                ...(query.sortBy !== undefined && { sortBy: query.sortBy }),
                ...(query.sortOrder !== undefined && { sortOrder: query.sortOrder }),
            },
            {
                defaultLimit: 10,
                maxLimit: 100,
                defaultSortBy: 'created_at',
                defaultSortOrder: 'desc',
                allowedSortBy: ['name', 'age', 'salary', 'hiring_date', 'created_at'],
            }
        );

        const baseQuery = db<Employee>('employees').whereNull('deleted_at');

        if (query.search) {
            void baseQuery.whereILike('name', `%${query.search}%`);
        }

        const [countRow] = await db<Employee>('employees')
            .whereNull('deleted_at')
            .modify((qb) => {
                if (query.search) void qb.whereILike('name', `%${query.search}%`);
            })
            .count('id as count');

        const total = Number((countRow as { count: number }).count);

        const data = await baseQuery
            .orderBy(sortBy ?? 'created_at', sortOrder)
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

    async getById(id: number): Promise<Employee> {
        const employee = await db<Employee>('employees')
            .where({ id })
            .whereNull('deleted_at')
            .first();

        if (!employee) {
            throw AppError.of(StatusCodes.NOT_FOUND, 'Employee not found', [
                { path: 'id', message: `No employee found with id ${id}` },
            ]);
        }

        return employee;
    }


    async create(input: CreateEmployeeInput): Promise<Employee> {
        const record: EmployeeRecord = {
            name: input.name,
            age: input.age,
            designation: input.designation,
            hiring_date: input.hiring_date,
            date_of_birth: input.date_of_birth,
            salary: input.salary,
            photo_path: input.photo_path ?? null,
            created_at: new Date(),
            updated_at: new Date(),
        };

        const [id] = await db<EmployeeRecord>('employees').insert(record) as [number];
        return this.getById(id);
    }

    async update(id: number, input: UpdateEmployeeInput): Promise<Employee> {
        await this.getById(id);

        const record: EmployeeRecord = {
            ...(input.name !== undefined && { name: input.name }),
            ...(input.age !== undefined && { age: input.age }),
            ...(input.designation !== undefined && { designation: input.designation }),
            ...(input.hiring_date !== undefined && { hiring_date: input.hiring_date }),
            ...(input.date_of_birth !== undefined && { date_of_birth: input.date_of_birth }),
            ...(input.salary !== undefined && { salary: input.salary }),
            ...(input.photo_path !== undefined && { photo_path: input.photo_path }),
            updated_at: new Date(),
        };

        await db<EmployeeRecord>('employees')
            .where({ id })
            .whereNull('deleted_at')
            .update(record);

        return this.getById(id);
    }

    async softDelete(id: number): Promise<void> {
        await this.getById(id);

        await db<EmployeeRecord>('employees').where({ id }).update({
            deleted_at: new Date(),
            updated_at: new Date(),
        });
    }


}