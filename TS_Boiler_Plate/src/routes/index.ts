import { Router } from 'express';
import { healthRouter } from './health.route.js';
import { rootRouter } from './root.routes.js';
import { AuthRoutes } from '@/modules/auth/auth.routes.js';
import { EmployeeRoutes } from '@/modules/employees/employee.routes.js';
import { AttendanceRoutes } from '@/modules/attendance/attendance.routes.js';
import { ReportRoutes } from '@/modules/reports/report.routes.js';

const router = Router();

const moduleRoutes = [
    {
        path: '/',
        route: rootRouter,
    },
    {
        path: '/',
        route: healthRouter,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/employees',
        route: EmployeeRoutes,
    },
    {
        path: '/attendance',
        route: AttendanceRoutes,
    },
    {
        path: '/reports',
        route: ReportRoutes,
    }

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;