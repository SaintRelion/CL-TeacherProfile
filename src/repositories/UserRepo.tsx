import type { User } from "@/models/User";
import {
  apiRegister,
  firebaseRegister,
  mockRegister,
} from "@saintrelion/data-access-layer";

// Firebase
firebaseRegister("User");

// API
apiRegister("User", "user");

// Mock
mockRegister<User>("User", []);
