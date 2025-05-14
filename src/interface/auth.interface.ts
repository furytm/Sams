export interface RegisterDTO {
  fullName: string;
  email: string;
  contactNumber: string;
  schoolName: string;
  studentSize: number;
}

export interface RegisterWithTokenDTO {
  fullName: string;
  email: string;
  contactNumber: string;
  token: string;
}

  export interface VerifyOtpDTO {
    email: string;
    otp: string;
  }
  
  export interface LoginDTO {
    email: string;
    password: string;
    rememberMe?: boolean
  }
  