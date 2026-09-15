import { Request, Response, NextFunction } from 'express';
import { authService, UserDto } from '../services/authService.js';

export interface AuthenticatedRequest extends Request {
  user?: UserDto | null;
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const rawUser = (req as any).user || (req as any).session?.passport?.user || (req as any).session?.user;
    if (rawUser) {
      if (typeof rawUser === 'object' && rawUser.id) {
        // Hydrate latest user role & status if database is accessible
        const refreshed = await authService.getUserById(rawUser.id);
        (req as any).user = refreshed || rawUser;
      } else if (typeof rawUser === 'string') {
        const refreshed = await authService.getUserById(rawUser);
        (req as any).user = refreshed;
      }
    } else {
      (req as any).user = null;
    }
  } catch (err) {
    console.warn("optionalAuth hydration warning:", err);
  }
  next();
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  await optionalAuth(req, res, () => {
    const user = (req as any).user;
    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Bu işlemi gerçekleştirmek için lütfen giriş yapın.'
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Hesabınız askıya alınmıştır. Lütfen destek ile iletişime geçin.'
      });
    }

    next();
  });
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  await requireAuth(req, res, () => {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Bu alana erişim yetkiniz bulunmamaktadır. Yalnızca sistem yöneticileri erişebilir.'
      });
    }
    next();
  });
}
