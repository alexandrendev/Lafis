export interface Simulation {
    id: string;
    context: {
      aperture: {
        height: number;
        type: string;
        radius: number;
        depth: number;
        width: number;
      };
      source: {
        type: string;
        radius: number;
        height: number;
        width: number;
        depth: number;
      };
    };
    emissions: number;
    duration: string;
    sourceHeight: number;
    escaped: number;
    status: string;
    created: any;
  }