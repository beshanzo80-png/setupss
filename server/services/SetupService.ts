import { SetupRepository } from '../repositories/SetupRepository.js';
import { AppError } from '../middlewares/errorHandler.js';

export class SetupService {
  static async getAllSetups() {
    return await SetupRepository.listAll();
  }

  static async getSetupById(id: string) {
    const setup = await SetupRepository.findById(id);
    if (!setup) {
      throw new AppError('Setup showcase not found', 404);
    }
    return setup;
  }

  static async createSetup(data: {
    id: string;
    title: string;
    owner: string;
    ownerId?: string;
    category: string;
    description?: string;
    image?: string;
    tags?: any;
    components?: any;
    videoUrl?: string;
  }) {
    if (!data.title || !data.category) {
      throw new AppError('Title and category are required', 400);
    }
    return await SetupRepository.create(data);
  }

  static async likeSetup(id: string) {
    const setup = await SetupRepository.findById(id);
    if (!setup) {
      throw new AppError('Setup not found', 404);
    }
    const newLikes = (setup.likes || 0) + 1;
    return await SetupRepository.updateLikes(id, newLikes);
  }
}
