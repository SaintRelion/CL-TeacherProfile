export interface PersonalInformation {
  id: string;
  userId: string; // FK
  employeeId: string;
  photoBase64: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
  civilStatus: string;
  emailAddress: string;
  mobileNumber: string;
  homeAddress: string;
  position: string;
  department: string;
  employmentStatus: string;
  dateHired: string;
  salaryGrade: string;
  tin: string;
}
