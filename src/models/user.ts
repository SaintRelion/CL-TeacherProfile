import type { RawAuthUser } from "@saintrelion/auth-lib/dist/models/types";

export interface User extends RawAuthUser {
  username: string;
}

export interface CreateUser {
  username: string;
  roles: string[];
  email: string;
}

export interface UpdateUser {
  email: string;
}
