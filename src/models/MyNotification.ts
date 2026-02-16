export interface MyNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
  isRead?: boolean;
}

export interface CreateMyNotification {
  userId: string;
  type: string;
  title: string;
  description: string;
  isRead?: boolean;
}

export interface UpdateMyNotification {
  isRead?: boolean;
}
