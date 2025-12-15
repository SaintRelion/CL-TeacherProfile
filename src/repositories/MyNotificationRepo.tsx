import type { MyNotification } from "@/models/MyNotification";
import {
  apiRegister,
  firebaseRegister,
  mockRegister,
} from "@saintrelion/data-access-layer";

// Firebase
firebaseRegister("MyNotification");

// API
apiRegister("MyNotification", "mynotification");

// Mock
mockRegister<MyNotification>("MyNotification", []);
