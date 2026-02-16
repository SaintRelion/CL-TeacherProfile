export interface TeacherDocument {
  id: string;
  userId: string;
  folderId: string;
  documentTitle: string;
  documentType: string;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  extension: string;
  fileSizeInMB: string;
  fileBase64: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface CreateTeacherDocument {
  userId: string;
  folderId: string;
  documentTitle: string;
  issueDate: string;
  expiryDate: string;
  extension: string;
  fileSizeInMB: string;
  fileBase64: string;
}

export interface UpdateTeacherDocument {
  archived: boolean;
}
