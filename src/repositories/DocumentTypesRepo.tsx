import type { DocumentTypes } from "@/models/DocumentTypes";
import {
  apiRegister,
  firebaseRegister,
  mockRegister,
} from "@saintrelion/data-access-layer";

// Firebase
firebaseRegister("DocumentTypes");

// API
apiRegister("DocumentTypes", "documenttypes");

// Mock
mockRegister<DocumentTypes>("DocumentTypes", []);
