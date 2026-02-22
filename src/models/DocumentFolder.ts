export interface DocumentFolder {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
}

export interface CreateDocumentFolder {
  name: string;
  userId: string;
}

export interface UpdateDocumentFolder {
  name: string;
}
