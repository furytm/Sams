export interface SetUsernameDTO {
    email: string;
    username: string;
    password: string;
    role?: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' ;
  }
  