export interface Notification {
  id: string;
  user: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  is_read: boolean;
}

export interface CreateNotification {
  user: string;
  type: string;
  title: string;
  description: string;
  is_read: boolean;
}

export interface UpdateNotification {
  is_read: boolean;
}
