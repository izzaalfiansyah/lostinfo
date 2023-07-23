import User from "./user";

interface UserLapor {
  id?: number | string;
  user_id?: number | string;
  pelapor_id?: number | string;
  alasan?: string;
  user?: User;
  pelapor?: User;
  created_at?: string;
  updated_at?: string;
}

export default UserLapor;
