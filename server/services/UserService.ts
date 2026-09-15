import { UserRepository } from '../repositories/UserRepository.js';
import { AppError } from '../middlewares/errorHandler.js';

export class UserService {
  static async getUserProfile(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  static async listAllUsers() {
    return await UserRepository.listAll();
  }

  static async registerUser(data: { id: string; email: string; passwordHash: string; name: string; role?: string }) {
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError('Email already registered', 400);
    }
    return await UserRepository.create(data);
  }
}
