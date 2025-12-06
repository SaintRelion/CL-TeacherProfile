import { type TeacherDocument } from "@/models/teacher-document";
import { firebaseRegister, mockRegister } from "@saintrelion/data-access-layer";

firebaseRegister("TeacherDocument");

mockRegister<TeacherDocument>("TeacherDocument", []);
