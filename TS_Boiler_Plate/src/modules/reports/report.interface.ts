export interface AttendanceSummary {
    employee_id: number;
    name: string;
    days_present: number;
    times_late: number;
}

export interface ReportQuery {
    month: string;
    employee_id?: number | undefined;
}

export interface AttendanceReportResponse {
    month: string;
    data: AttendanceSummary[];
}