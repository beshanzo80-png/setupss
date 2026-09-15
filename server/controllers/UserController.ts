import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService.js';

export class UserController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserProfile(req.params.id);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  static async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.listAllUsers();
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }
}
