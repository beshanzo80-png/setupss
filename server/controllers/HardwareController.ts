import { Request, Response, NextFunction } from 'express';
import { HardwareService } from '../services/HardwareService.js';
import { buildCoresScraper } from '../services/BuildCoresScraper.js';
import { hardwareIntelligenceService } from '../services/HardwareIntelligenceService.js';

export class HardwareController {
  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await HardwareService.getHardwareDetailsBySlug(req.params.slug);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getGraphData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await HardwareService.getGraphDataForEntity(req.params.slug);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async listHardware(req: Request, res: Response, next: NextFunction) {
    try {
      const category = (req.query.category || req.query.categoryId) as string;
      const query = (req.query.q || req.query.search) as string;
      const list = await HardwareService.listHardwareEntities(category, query);
      res.json({ success: true, data: list });
    } catch (error) {
      next(error);
    }
  }

  static async getBottleneck(req: Request, res: Response, next: NextFunction) {
    try {
      const cpu = (req.query.cpu as string) || 'amd-ryzen-7-9800x3d';
      const gpu = (req.query.gpu as string) || 'nvidia-rtx-5090';
      const resolution = (req.query.resolution as string) || '1440p';

      const analysis = await HardwareService.calculateBottleneck(cpu, gpu, resolution);
      res.json({ success: true, data: analysis });
    } catch (error) {
      next(error);
    }
  }

  static async ingestBuildCores(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, limit } = req.body;
      if (!category) {
        return res.status(400).json({ success: false, message: 'category parametresi gereklidir (örneğin: cpu.json, gpu.json)' });
      }
      const fetchLimit = limit ? parseInt(limit, 10) : 5;
      const results = await buildCoresScraper.fetchAndIngestCategory(category, fetchLimit);
      res.json({ success: true, message: `${results.length} adet donanım başarıyla çekildi ve normalize edildi.`, results });
    } catch (error) {
      next(error);
    }
  }

  static async ingestAiSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const { componentName } = req.body;
      if (!componentName) {
        return res.status(400).json({ success: false, message: 'componentName parametresi gereklidir (örneğin: NVIDIA RTX 5090)' });
      }
      const result = await hardwareIntelligenceService.searchAndIngestHardware(componentName);
      res.json({ success: true, message: `Donanım başarıyla web'de arandı, normalize edildi ve veritabanına kaydedildi.`, result });
    } catch (error) {
      next(error);
    }
  }
}
