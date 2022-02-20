export interface Config {
  temperature: boolean;
  accelerometer: boolean;
  compass: boolean;
  location: boolean;
  volume: boolean;
  distance: boolean;
}
export interface Device {
  id: number;
  name: string;
  sensor_set: (keyof Config)[];

  config: Config;

  type_id: number;
}

export interface Type {
  id: number;
  name: string;
  colour: {
    r: number;
    g: number;
    b: number;
  };
}

export interface Reading {
  id: number;
  device_id: number;
  heartbeat: number;
  reported_at: string; // ISO8601

  acceleration?: { x: number; y: number; z: number };
  distances?: {
    distance_from: number; // other m:bit id
    distance: number;
  }[];
  heading?: number;
  location?: { latitude?: number; longitude?: number; zone?: number };
  speed?: number;
  temperature?: number;
  volume?: number;
}
