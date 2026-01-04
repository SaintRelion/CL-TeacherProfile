import { type TeacherDocument } from "@/models/TeacherDocument";
import { firebaseRegister, mockRegister } from "@saintrelion/data-access-layer";

firebaseRegister("TeacherDocument");

mockRegister<TeacherDocument>("TeacherDocument", []);
