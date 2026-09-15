import { z } from 'zod';

export const SocketRelationMeta = z.object({
  relation_type: z.literal('COMPATIBLE_WITH'),
  metadata: z.object({
    reason: z.literal('socket_match'),
    socket: z.string()
  })
});

export const PowerRelationMeta = z.object({
  relation_type: z.literal('POWER_REQUIRED'),
  metadata: z.object({
    reason: z.literal('power_requirement'),
    required_watts: z.number()
  })
});

export const PCIeRelationMeta = z.object({
  relation_type: z.literal('COMPATIBLE_WITH'),
  metadata: z.object({
    reason: z.literal('pcie_compatibility'),
    pcie_generation: z.number()
  })
});

export const BottleneckRelationMeta = z.object({
  relation_type: z.literal('BOTTLENECK_PAIR'),
  metadata: z.object({
    reason: z.literal('cpu_bottleneck'),
    severity_percentage: z.number()
  })
});

export const HardwareRelationSchema = z.discriminatedUnion('relation_type', [
  SocketRelationMeta,
  PowerRelationMeta,
  PCIeRelationMeta,
  BottleneckRelationMeta,
  z.object({
    relation_type: z.literal('RECOMMENDED_PAIRING'),
    metadata: z.object({
      reason: z.string(),
      description: z.string().optional()
    })
  }),
  z.object({
    relation_type: z.literal('ALTERNATIVE_TO'),
    metadata: z.object({
      reason: z.string().optional(),
      performance_diff_percentage: z.number().optional()
    })
  })
]);

export type HardwareRelationData = z.infer<typeof HardwareRelationSchema>;
