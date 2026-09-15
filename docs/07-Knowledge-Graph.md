# 07-Knowledge-Graph: The Hardware Interconnection Engine

## Concept & Architecture
The Hardware Knowledge Graph is the beating heart of Setupss. Unlike static static wiki pages or isolated parts pickers, every entity in the system is interconnected bidirectionally.

---

## Entity Relationship Flow
```
CPU <---> Motherboard <---> RAM <---> GPU <---> PSU <---> Monitor
  ^                                                             ^
  |                                                             |
  v                                                             v
Games <-----------------> Setups <---------------------> User Profiles
  ^                                                             ^
  |                                                             |
  v                                                             v
Benchmarks <---------------------------------------------> Creator Reviews
```

### Key Capabilities
- **Reverse Lookup**: View every setup featuring an RTX 5090 or Ryzen 7 9800X3D.
- **Performance Correlation**: View exact frame rates (FPS) for specific games running on specific hardware setups.
- **Ecosystem Discovery**: Explore desks, peripherals, lighting, and audio gear linked directly to real user battlestations.
