export interface User {
  id: number;
  created_at: string; // ISO-8601 Compliant
  is_administrator: string;

  email: string;
  password_hash: string; // not normally stored in browser!

  display_name: string;
  profile_url: string | null;
  profile_banner: string | null;
}

export interface ReadRight {
  user_id: number;
  device_id: number;
}
