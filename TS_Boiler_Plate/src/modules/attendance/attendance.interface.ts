export interface Attendance {
    id: number;
    employee_id: number;
    date: string;
    check_in_time: string;
    created_at: string;
    updated_at: string;
}

export interface AttendanceRecord {
    id?: number | undefined;
    employee_id?: number | undefined;
    date?: string | undefined;
    check_in_time?: string | undefined;
    created_at?: string | Date | undefined;
    updated_at?: string | Date | undefined;
}

export interface CreateAttendanceInput {
    employee_id: number;
    date: string;
    check_in_time: string;
}

export interface UpdateAttendanceInput {
    check_in_time?: string | undefined;
}

export interface AttendanceQuery {
    employee_id?: number | undefined;
    date?: string | undefined;
    from?: string | undefined;
    to?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}

export interface PaginatedAttendance {
    data: Attendance[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}