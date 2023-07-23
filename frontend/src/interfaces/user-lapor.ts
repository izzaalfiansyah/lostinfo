import User from "./user";

interface UserLapor {
  id?: number | string;
  user_id?: number | string;
  pelapor_id?: number | string;
  alasan?: string;
  user?: User;
  pelapor?: User;
}

export default UserLapor;
