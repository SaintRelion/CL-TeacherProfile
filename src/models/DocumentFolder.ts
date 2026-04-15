export interface DocumentFolder {
  id: string;
  name: string;
  user: string;
  has_expiry: boolean;
  created_at: string;
}

export interface CreateDocumentFolder {
  name: string;
  user: string;
}

export interface UpdateDocumentFolder {
  name: string;
  is_archived: boolean;
}
