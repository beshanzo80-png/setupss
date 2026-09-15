import { Request, Response, NextFunction } from 'express';
import { SetupService } from '../services/SetupService.js';

export class SetupController {
  static async listSetups(req: Request, res: Response, next: NextFunction) {
    try {
      const setups = await SetupService.getAllSetups();
      res.json({ success: true, data: setups });
    } catch (error) {
      next(error);
    }
  }

  static async getSetup(req: Request, res: Response, next: NextFunction) {
    try {
      const setup = await SetupService.getSetupById(req.params.id);
      res.json({ success: true, data: setup });
    } catch (error) {
      next(error);
    }
  }

  static async createSetup(req: Request, res: Response, next: NextFunction) {
    try {
      const setup = await SetupService.createSetup(req.body);
      res.status(201).json({ success: true, data: setup });
    } catch (error) {
      next(error);
    }
  }

  static async likeSetup(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await SetupService.likeSetup(req.params.id);
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}
