export interface Zone {
  id: number;
  geo: unknown; // TODO: GeoJSON
  created_by: number; // User by ID
  created_at: string; // ISO8601
  colour: {
    r: number;
    g: number;
    b: number;
  };

  group?: {
    id: string;
    vars: {
      name: string;
      value: string;
    }[];
  };
}

export interface ZoneGroup {
  id: string;
  name: string;
  created_by: number; // User by ID

  var_definitions: { name: string; type: string }[];
}
