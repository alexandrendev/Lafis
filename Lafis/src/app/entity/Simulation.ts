export interface Simulation {
    id: string;
    name?: string;
    context?: {
      aperture?: {
        height?: number;
        type?: string;
        radius?: number;
        depth?: number;
        width?: number;
      };
      source?: {
        type?: string;
        radius?: number;
        height?: number;
        width?: number;
        depth?: number;
        x?: number;
        y?: number;
        z?: number;
        centerX?: number;
        centerY?: number;
        centerZ?: number;
      };
    };
    emissions: number;
    duration: string;
    sourceHeight: number;
    escaped: number;
    solidAngle?: number;
    solidAngleError?: number;
    apertureType?: string;
    sourceType?: string;
    status: string;
    created: any;
  }
