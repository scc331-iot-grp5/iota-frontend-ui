export interface Zone {
  id: number;
  name: string;
  geo_json: any;
  created_by: number; // User by ID
  created_at: string; // ISO8601
  colour: {
    r: number;
    g: number;
    b: number;
  };
}

export interface ZoneGroup {
  id: number;
  name: string;
  created_by: number; // User by ID

  members: number[];
}

export interface ZoneGroupVar {
  id: number;
  group_id: number;
  name: string;
  type: 'number' | 'string' | 'boolean';
}

export type ZoneVarValue = { var_id: number; zone_id: number; value: string };
