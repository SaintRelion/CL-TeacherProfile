import type { UserRole } from "../model-types/userrole";

export interface User {
  id: string;
  username: string;
  role: UserRole;
}
