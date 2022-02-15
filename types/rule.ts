export interface Rule {
  id: number;
  name: string;

  // TODO: Rule bodies
}

export interface Event {
  id: number;
  type: string;
  created_at: string; // ISO8601
  triggered_by: number; // Refers to rule by ID

  involves: string[]; // List of microbits by ID
}
