import type { TeacherPerformance } from "@/models/performance";
import {
  apiRegister,
  firebaseRegister,
  mockRegister,
} from "@saintrelion/data-access-layer";

// Firebase
firebaseRegister("TeacherPerformance");

// API
apiRegister("TeacherPerformance", "teacher-performance");

// Mock
mockRegister<TeacherPerformance>("TeacherPerformance", []);
