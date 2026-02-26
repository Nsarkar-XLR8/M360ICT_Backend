export interface Employee {
    id: number;
    name: string;
    age: number;
    designation: string;
    hiring_date: string;
    date_of_birth: string;
    salary: number;
    photo_path: string | null;
    deleted_at: string | null;
    created_at: string | Date;
    updated_at: string | Date;
}

// Used for Knex insert/update operations
export interface EmployeeRecord {
    id?: number | undefined;
    name?: string | undefined;
    age?: number | undefined;
    designation?: string | undefined;
    hiring_date?: string | undefined;
    date_of_birth?: string | undefined;
    salary?: number | undefined;
    photo_path?: string | null | undefined;
    deleted_at?: string | Date | null | undefined;
    created_at?: string | Date | undefined;
    updated_at?: string | Date | undefined;
}

export interface CreateEmployeeInput {
    name: string;
    age: number;
    designation: string;
    hiring_date: string;
    date_of_birth: string;
    salary: number;
    photo_path?: string | undefined;
}

export interface UpdateEmployeeInput {
    name?: string | undefined;
    age?: number | undefined;
    designation?: string | undefined;
    hiring_date?: string | undefined;
    date_of_birth?: string | undefined;
    salary?: number | undefined;
    photo_path?: string | undefined;
}

export interface EmployeeQuery {
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: 'asc' | 'desc' | undefined;
    search?: string | undefined;
}

export interface PaginatedEmployees {
    data: Employee[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}