export interface Rule {
  id: number;
  name: string;

  created_by: number;
  body: any;
}

export interface Event {
  id: number;
  created_at: string; // ISO8601
  rule: number; // Refers to rule by ID
  severity: number;

  involves: { device_id: number; reading_id: number }[]; // List of microbits by ID
}
