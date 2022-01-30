export interface Device {
  microbitId: number;
  sensorType: string;
}

export interface Crash {
  microbitId: number;
  sensorType: string;
  date: string;
  time: string;
}

export interface Reading {
  microbitId: number;
  sensorType: string;
  temp: number;
  acc: number;
  direction: string;
  heartbeat: number;
}

export interface Location {
  microbitId: string;
  latitude: number;
  longitude: number;
}

export interface DashboardData {
  devices: Device[];
  crashes: Crash[];
  readings: Reading[];
  locations: Location[];
}
