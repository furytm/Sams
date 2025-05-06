export interface RegisterDTO {
    fullName: string;
    email: string;
    contactNumber: string;
    schoolName: string;
    roleInSchool: string;
    studentSize: number;
  }
  
  export interface VerifyOtpDTO {
    email: string;
    otp: string;
  }
  
  export interface LoginDTO {
    email: string;
    password: string;
  }
  