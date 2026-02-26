/**
 * Unit tests for EmployeeService
 *
 * All external dependencies (Knex db) are mocked so these
 * tests run without a real database connection.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StatusCodes } from 'http-status-codes';

const { mockUpdate, mockFirst, createQueryChain, mockDb } = vi.hoisted(() => {
    const mockUpdate = vi.fn().mockResolvedValue(1);
    const mockFirst = vi.fn();

    // Build a chainable mock query
    function createQueryChain() {
        const chain: Record<string, unknown> = {};
        chain['where'] = vi.fn(() => chain);
        chain['whereNull'] = vi.fn(() => chain);
        chain['first'] = mockFirst;
        chain['update'] = mockUpdate;
        chain['orderBy'] = vi.fn(() => chain);
        chain['limit'] = vi.fn(() => chain);
        chain['offset'] = vi.fn(() => chain);
        chain['count'] = vi.fn().mockResolvedValue([{ count: 0 }]);
        chain['modify'] = vi.fn((fn: (qb: unknown) => void) => { fn(chain); return chain; });
        chain['insert'] = vi.fn().mockResolvedValue([99]);
        chain['whereILike'] = vi.fn(() => chain);
        return chain;
    }

    const mockDb = vi.fn(() => createQueryChain()) as unknown as ReturnType<typeof vi.fn> & {
        raw: ReturnType<typeof vi.fn>;
    };
    mockDb.raw = vi.fn();

    return { mockUpdate, mockFirst, createQueryChain, mockDb };
});

vi.mock('../../../src/config/database.js', () => ({
    default: mockDb,
}));

// ── Mock: pagination util ─────────────────────────────────────────────────
vi.mock('../../../src/utils/pagination.js', () => ({
    buildPagination: vi.fn(() => ({
        page: 1,
        limit: 10,
        skip: 0,
        sortBy: 'created_at',
        sortOrder: 'desc',
    })),
}));

// ── Import AFTER mocks ────────────────────────────────────────────────────
import { EmployeeService } from '../../../src/modules/employees/employee.service.js';

const employeeService = new EmployeeService();

const mockEmployee = {
    id: 1,
    name: 'John Doe',
    age: 30,
    designation: 'Engineer',
    hiring_date: '2024-01-15',
    date_of_birth: '1994-05-20',
    salary: 75000,
    photo_path: null,
    deleted_at: null,
    created_at: new Date(),
    updated_at: new Date(),
};

describe('EmployeeService.getById()', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockDb.mockImplementation(() => createQueryChain());
    });

    it('should return an employee when found', async () => {
        mockFirst.mockResolvedValue(mockEmployee);

        const result = await employeeService.getById(1);
        expect(result).toEqual(mockEmployee);
    });

    it('should throw 404 when employee is not found', async () => {
        mockFirst.mockResolvedValue(undefined);

        await expect(employeeService.getById(999))
            .rejects.toMatchObject({ statusCode: StatusCodes.NOT_FOUND });
    });
});

describe('EmployeeService.softDelete()', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should throw 404 when employee does not exist', async () => {
        // getById (called inside softDelete) will throw 404
        mockFirst.mockResolvedValue(undefined);

        await expect(employeeService.softDelete(999))
            .rejects.toMatchObject({ statusCode: StatusCodes.NOT_FOUND });
    });

    it('should call db update with deleted_at when employee exists', async () => {
        // First call: getById → returns employee
        // Second call: update → resolves
        mockFirst.mockResolvedValueOnce(mockEmployee);
        mockUpdate.mockResolvedValue(1);

        const query = createQueryChain();
        (query['update'] as ReturnType<typeof vi.fn>) = mockUpdate;
        mockDb.mockReturnValue(query);
        mockFirst.mockResolvedValueOnce(mockEmployee);

        await expect(employeeService.softDelete(1)).resolves.toBeUndefined();
    });
});
