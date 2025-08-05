import { AdminAuth } from '@/lib/admin/auth';

describe('Admin Authentication', () => {
  test('verifies correct password', async () => {
    // Test with known hash for password "testpassword"
    process.env.ADMIN_PASSWORD_HASH = '$2a$12$KIXxPfPB.P1ZnYLz9yYgZu.J6KfLr.4Qr/TgLhGxqXB3oj3kYhyDq';
    const result = await AdminAuth.verifyPassword('testpassword');
    expect(result).toBe(true);
  });
  
  test('rejects incorrect password', async () => {
    process.env.ADMIN_PASSWORD_HASH = '$2a$12$KIXxPfPB.P1ZnYLz9yYgZu.J6KfLr.4Qr/TgLhGxqXB3oj3kYhyDq';
    const result = await AdminAuth.verifyPassword('wrongpassword');
    expect(result).toBe(false);
  });
  
  test('generates and verifies JWT token', () => {
    process.env.JWT_SECRET = 'test-secret-key-for-testing-purposes';
    const token = AdminAuth.generateToken();
    expect(AdminAuth.verifyToken(token)).toBe(true);
  });
  
  test('rejects invalid JWT token', () => {
    process.env.JWT_SECRET = 'test-secret-key-for-testing-purposes';
    const result = AdminAuth.verifyToken('invalid-token');
    expect(result).toBe(false);
  });
});