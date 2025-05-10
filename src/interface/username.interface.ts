export interface SetUsernameDTO {
    email: string;
    username: string;
    password: string;
    role?: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'HEALTH_STAFF' | 'FINANCE_STAFF';
  }
  