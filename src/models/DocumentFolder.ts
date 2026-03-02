export interface DocumentFolder {
  id: string;
  name: string;
  user: string;
  created_at: string;
}

export interface CreateDocumentFolder {
  name: string;
  user: string;
}

export interface UpdateDocumentFolder {
  name: string;
}
