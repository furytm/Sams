export interface RegisterDTO {
    fullname: string;
    email: string;
    contactNumber: string;
    schoolName: string;
    role: string;
    studentSize: number;
    password: string;
  }
  
  export interface VerifyOtpDTO {
    email: string;
    otp: string;
  }
  
  export interface LoginDTO {
    email: string;
    password: string;
  }
  