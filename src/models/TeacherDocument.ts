export interface TeacherDocument {
  id: string;
  user: string;
  folder: string;
  document_title: string;
  issue_date: string;
  expiry_date: string;
  extension: string;
  file_size_in_mb: string;
  file_base64: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
}

export interface CreateTeacherDocument {
  user: string;
  folder: string;
  document_title: string;
  issue_date: string;
  expiry_date: string;
  extension: string;
  file_size_in_mb: string;
  file_base64: string;
}

export interface UpdateTeacherDocument {
  is_archived: boolean;
}
