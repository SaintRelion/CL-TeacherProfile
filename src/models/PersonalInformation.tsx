export interface PersonalInformation {
  id: string;
  userId: string;
  employeeId: string;
  photoBase64: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
  civilStatus: string;
  email: string;
  mobileNumber: string;
  homeAddress: string;
  position: string;
  department: string;
  employmentStatus: string;
  dateHired: string;
  salaryGrade: string;
  tin: string;
}

export interface CreatePersonalInformation {
  userId: string;
  employeeId: string;
  photoBase64: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
  civilStatus: string;
  email: string;
  mobileNumber: string;
  homeAddress: string;
  position: string;
  department: string;
  employmentStatus: string;
  dateHired: string;
  salaryGrade: string;
  tin: string;
}
