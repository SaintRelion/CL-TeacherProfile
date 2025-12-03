import { type Document } from "@/models/document";
import { firebaseRegister, mockRegister } from "@saintrelion/data-access-layer";

firebaseRegister("Document");

mockRegister<Document>("Document", [
  // PERSONAL
  {
    expiryDate: "2",
    documentType: "personal",
    iconBackgroundColor: "bg-error-100",
    iconClassName: "fas fa-file-pdf text-error-600",
    documentName: "Birth Certificate",
    description: "Uploaded: Sept 15, 2025",
  },
  {
    expiryDate: "2",
    documentType: "personal",
    iconBackgroundColor: "bg-primary-100",
    iconClassName: "fas fa-file-alt text-primary-600",
    documentName: "Resume/CV",
    description: "Updated: Sept 10, 2025",
  },
  {
    expiryDate: "2",
    documentType: "personal",
    iconBackgroundColor: "bg-success-100",
    iconClassName: "fas fa-image text-success-600",
    documentName: "2x2 ID Photo",
    description: "Uploaded: Aug 28, 2025",
  },

  // PROFESSIONAL
  {
    expiryDate: "2",
    documentType: "professional",
    iconBackgroundColor: "bg-accent-100",
    iconClassName: "fas fa-certificate text-accent-600",
    documentName: "Teaching License",
    description: "Valid until: June 2027",
  },
  {
    expiryDate: "2",
    documentType: "professional",
    iconBackgroundColor: "bg-primary-100",
    iconClassName: "fas fa-graduation-cap text-primary-600",
    documentName: "Master's Diploma",
    description: "University of the Philippines",
  },
  {
    expiryDate: "-1",
    documentType: "professional",
    iconBackgroundColor: "bg-warning-100",
    iconClassName: "fas fa-exclamation-triangle text-warning-600",
    documentName: "CPD Certificate",
    description: "Expires: Jan 10, 2026",
  },
]);
