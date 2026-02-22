export interface TeacherPerformance {
  id: string;
  userId: string;
  rating: string;
}

export interface CreateTeacherPerformance {
  userId: string;
  rating: string;
}
