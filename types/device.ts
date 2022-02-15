export interface Device {
  id: number;
  name: string;
  sensor_set: string[];

  config: {
    temperature: boolean;
    accelerometer: boolean;
    compass: boolean;
    location: boolean;
    volume: boolean;
    distance: boolean;
  };

  type_name: string; // JOINed on device_types
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

  degrees?: number;
  acceleration?: { x: number; y: number; z: number };
  volume?: number;
  location?: { latitude: number; longitude: number };
  heading?: number;
  distances?: {
    distance_from: number; // other m:bit id
    distance: number;
    rssi: number;
  }[];
}
