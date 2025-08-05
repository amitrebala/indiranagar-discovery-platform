import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AdminAuth {
  private static readonly ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH!;
  private static readonly JWT_SECRET = process.env.JWT_SECRET!;
  
  static async verifyPassword(password: string): Promise<boolean> {
    if (!this.ADMIN_PASSWORD_HASH) {
      console.error('ADMIN_PASSWORD_HASH not set');
      return false;
    }
    return await bcrypt.compare(password, this.ADMIN_PASSWORD_HASH);
  }
  
  static generateToken(): string {
    return jwt.sign(
      { 
        role: 'admin', 
        iat: Date.now(),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      },
      this.JWT_SECRET
    );
  }
  
  static verifyToken(token: string): boolean {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      return decoded.role === 'admin';
    } catch (error) {
      return false;
    }
  }
}