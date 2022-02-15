export interface User {
  id: string;
  created_at: string; // ISO-8601 Compliant
  display_name: string;
  is_administrator: string;
  username: string;

  // password_hash: string // not stored in browser!
}

export interface ReadRight {
  user_id: string;
  device_id: string;
}
