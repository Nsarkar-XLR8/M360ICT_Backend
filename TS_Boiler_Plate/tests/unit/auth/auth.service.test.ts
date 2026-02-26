/**
 * Unit tests for AuthService.login()
 *
 * All external dependencies (Knex db, bcrypt) are mocked so these
 * tests run without a real database connection.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StatusCodes } from 'http-status-codes';

const { mockFirst, mockWhere, mockDb, mockCompare } = vi.hoisted(() => {
    const mockFirst = vi.fn();
    const mockWhere = vi.fn(() => ({ first: mockFirst }));
    const mockDb = vi.fn(() => ({ where: mockWhere }));
    const mockCompare = vi.fn();
    return { mockFirst, mockWhere, mockDb, mockCompare };
});

// ── Mock: config (must come before AuthService import) ────────────────────
vi.mock('../../../src/config/index.js', () => ({
    default: {
        jwt: {
            secret: 'test-jwt-secret-that-is-definitely-long-enough',
            expiresIn: '1h',
        },
    },
}));

// ── Mock: Knex db ─────────────────────────────────────────────────────────
vi.mock('../../../src/config/database.js', () => ({
    default: mockDb,
}));

// ── Mock: bcrypt ──────────────────────────────────────────────────────────
vi.mock('bcrypt', () => ({
    default: { compare: mockCompare },
}));

// ── Import AFTER mocks are set up ─────────────────────────────────────────
import { AuthService } from '../../../src/modules/auth/auth.service.js';

const authService = new AuthService();

const mockUser = {
    id: 1,
    email: 'admin@hr.com',
    password_hash: '$2b$10$hashedpassword',
    name: 'Admin HR',
};

describe('AuthService.login()', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should throw 401 when user is not found', async () => {
        mockFirst.mockResolvedValue(undefined); // user not in DB

        await expect(authService.login('unknown@hr.com', 'password'))
            .rejects.toMatchObject({ statusCode: StatusCodes.UNAUTHORIZED });
    });

    it('should throw 401 when password does not match', async () => {
        mockFirst.mockResolvedValue(mockUser);
        mockCompare.mockResolvedValue(false); // wrong password

        await expect(authService.login('admin@hr.com', 'wrongpassword'))
            .rejects.toMatchObject({ statusCode: StatusCodes.UNAUTHORIZED });
    });

    it('should return a JWT string on successful login', async () => {
        mockFirst.mockResolvedValue(mockUser);
        mockCompare.mockResolvedValue(true); // correct password

        const token = await authService.login('admin@hr.com', 'admin123');

        expect(typeof token).toBe('string');
        expect(token.split('.')).toHaveLength(3); // valid JWT format
    });

    it('should query the database with the provided email', async () => {
        mockFirst.mockResolvedValue(mockUser);
        mockCompare.mockResolvedValue(true);

        await authService.login('admin@hr.com', 'admin123');

        expect(mockDb).toHaveBeenCalledWith('hr_users');
        expect(mockWhere).toHaveBeenCalledWith({ email: 'admin@hr.com' });
    });
});
