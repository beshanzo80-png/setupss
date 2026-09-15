import { HardwareRepository } from '../repositories/HardwareRepository.js';
import { AppError } from '../middlewares/errorHandler.js';

export class HardwareService {
  static async getHardwareDetailsBySlug(slug: string) {
    const hardware = await HardwareRepository.findBySlug(slug);
    if (!hardware) {
      throw new AppError(`Hardware entity with slug '${slug}' not found`, 404);
    }

    const [relations, benchmarks, priceHistory, pairedSetups] = await Promise.all([
      HardwareRepository.getRelations(hardware.id),
      HardwareRepository.getBenchmarks(hardware.id),
      HardwareRepository.getPriceHistory(hardware.id),
      HardwareRepository.getPairedSetups(slug)
    ]);

    return {
      entity: hardware,
      relations,
      benchmarks,
      priceHistory,
      pairedSetups,
      graphSummary: {
        totalConnections: relations.length,
        totalSetupsUsing: pairedSetups.length,
        averageFps: benchmarks.length > 0 
          ? Math.round(benchmarks.reduce((acc, b) => acc + (b.avg_fps || 0), 0) / benchmarks.length) 
          : null
      }
    };
  }

  static async getGraphDataForEntity(slug: string) {
    const hardware = await HardwareRepository.findBySlug(slug);
    if (!hardware) {
      throw new AppError(`Hardware entity '${slug}' not found for graph generation`, 404);
    }

    const relations = await HardwareRepository.getRelations(hardware.id);

    const nodes = [
      {
        id: hardware.id,
        label: hardware.name,
        category: hardware.category,
        type: 'PRIMARY',
        slug: hardware.slug,
        image: hardware.image_url
      }
    ];

    const edges: any[] = [];

    for (const rel of relations) {
      const isSource = rel.source_id === hardware.id;
      const otherId = isSource ? rel.target_id : rel.source_id;
      const otherName = isSource ? rel.target_name : rel.source_name;
      const otherSlug = isSource ? rel.target_slug : rel.source_slug;
      const otherCategory = isSource ? rel.target_category : rel.source_category;

      if (!nodes.find(n => n.id === otherId)) {
        nodes.push({
          id: otherId,
          label: otherName,
          category: otherCategory,
          type: 'RELATED',
          slug: otherSlug,
          image: rel.target_image
        });
      }

      edges.push({
        id: rel.id,
        source: rel.source_id,
        target: rel.target_id,
        type: rel.relation_type,
        weight: rel.weight || 1.0,
        metadata: rel.metadata
      });
    }

    return { nodes, edges };
  }

  static async listHardwareEntities(category?: string, query?: string) {
    return await HardwareRepository.listAll(category, query);
  }

  static async calculateBottleneck(cpuSlug: string, gpuSlug: string, resolution: string = '1440p') {
    const [cpu, gpu] = await Promise.all([
      HardwareRepository.findBySlug(cpuSlug),
      HardwareRepository.findBySlug(gpuSlug)
    ]);

    if (!cpu || !gpu) {
      throw new AppError('CPU or GPU entity not found for bottleneck analysis', 404);
    }

    const cpuScore = cpu.benchmark_score || 10000;
    const gpuScore = gpu.benchmark_score || 15000;

    let resMultiplier = 1.0;
    if (resolution === '1080p') resMultiplier = 1.3; // CPU bound
    if (resolution === '1440p') resMultiplier = 1.0; // Balanced
    if (resolution === '4K') resMultiplier = 0.7; // GPU bound

    const adjustedCpuScore = cpuScore * resMultiplier;
    const ratio = adjustedCpuScore / gpuScore;

    let bottleneckPercentage = 0;
    let bottleneckSource: 'CPU' | 'GPU' | 'BALANCED' = 'BALANCED';
    let recommendation = '';

    if (ratio < 0.75) {
      bottleneckPercentage = Math.min(Math.round((0.75 - ratio) * 100), 45);
      bottleneckSource = 'CPU';
      recommendation = `${cpu.name} is slightly limiting the ${gpu.name} at ${resolution}. Consider upgrading CPU or gaming at higher resolutions like 4K.`;
    } else if (ratio > 1.35) {
      bottleneckPercentage = Math.min(Math.round((ratio - 1.35) * 50), 35);
      bottleneckSource = 'GPU';
      recommendation = `${gpu.name} is running at 100% capacity while ${cpu.name} has head room. This is ideal for GPU-bound gaming at ${resolution}.`;
    } else {
      bottleneckPercentage = Math.round(Math.abs(1.0 - ratio) * 10);
      bottleneckSource = 'BALANCED';
      recommendation = `Excellent match! ${cpu.name} and ${gpu.name} form an optimal gaming pairing for ${resolution}.`;
    }

    return {
      cpu: { name: cpu.name, slug: cpu.slug, score: cpuScore },
      gpu: { name: gpu.name, slug: gpu.slug, score: gpuScore },
      resolution,
      bottleneckPercentage,
      bottleneckSource,
      recommendation
    };
  }
}
