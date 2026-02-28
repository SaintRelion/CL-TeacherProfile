export interface PersonalInformation {
  id: string;
  user: string;
  employee_id: string;
  photo_base64: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  date_of_birth: string;
  gender: string;
  civil_status: string;
  email: string;
  mobile_number: string;
  home_address: string;
  position: string;
  department: string;
  employment_status: string;
  date_hired: string;
  salary_grade: string;
  tin: string;
}

export interface CreatePersonalInformation {
  user: string;
  employee_id: string;
  photo_base64: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  date_of_birth: string;
  gender: string;
  civil_status: string;
  email: string;
  mobile_number: string;
  home_address: string;
  position: string;
  department: string;
  employment_status: string;
  date_hired: string;
  salary_grade: string;
  tin: string;
}
