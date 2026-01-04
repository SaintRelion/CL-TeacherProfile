import type { PersonalInformation } from "@/models/PersonalInformation";
import {
  apiRegister,
  firebaseRegister,
  mockRegister,
} from "@saintrelion/data-access-layer";

// Firebase
firebaseRegister("PersonalInformation");

// API
apiRegister("PersonalInformation", "personal-information");

// Mock
mockRegister<PersonalInformation>("PersonalInformation", []);
