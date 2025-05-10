import { Request, Response } from 'express';
import {
  registerUser,
  verifyUserOtp,
  loginUser, setUser,
  requestPasswordReset,
  resetPassword
} from '../services/auth.service';
import { error } from 'console';
import { rotateRefreshToken, revokeToken } from '../services/token.service';
import { loginSchema } from '../validators/auth.validators';
import { resendOtp } from '../services/auth.service';



// POST /auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Destructure the data from the request body
    const { fullName, email, contactNumber, schoolName, roleInSchool, studentSize } = req.body;

    // Check if all required fields are provided
    if (!fullName || !email || !contactNumber || !schoolName || !roleInSchool || !studentSize) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }
    // Convert studentSize to a number (in case it's a string)
    const parsedStudentSize = typeof studentSize === 'string' ? parseInt(studentSize, 10) : studentSize;
    // Ensure studentSize is a valid number
    if (isNaN(parsedStudentSize)) {
      res.status(400).json({ error: "Student size must be a valid number." })
    }
    // Create a new object with parsed studentSize
    const registrationData = { ...req.body, studentSize: parsedStudentSize };

    // Call the registerUser function
    const result = await registerUser(registrationData);

    // Return a success response
    res.status(201).json(result);
  } catch (err: any) {
    // Return an error response if registration fails
    console.error("Error during registration:", err);
    res.status(400).json({ error: err.message });
  }
};

// POST /auth/verify-otp
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await verifyUserOtp(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
export const setUsernameAndPassword = async (req: Request, res: Response) => {
  try {
    const result = await setUser(req.body);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}



export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
       res.status(400).json({ error: result.error.flatten() });
       return;
    }

    const { email, password, rememberMe } = result.data;

    const { accessToken, refreshToken } = await loginUser({ email, password });

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      ...(rememberMe && {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
      }),
    });

    res.status(200).json({ accessToken });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(400).json({ error: err.message });
  }
};

// controllers/auth.controller.ts
export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const result = await requestPasswordReset(email);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function handlePasswordReset(req: Request, res: Response) {
  try {
    const { token, password } = req.body;
    const result = await resetPassword(token, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function refreshTokenHandler(req: Request, res: Response) {
  try {
    const rawToken = req.cookies.refreshToken;
    if (!rawToken) return res.status(401).json({ error: 'Missing refresh token' });

    const { accessToken, refreshToken } = await rotateRefreshToken(rawToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

export async function logoutHandler(req: Request, res: Response) {
  try {
    const rawToken = req.cookies.refreshToken;
    if (rawToken) await revokeToken(rawToken);
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}


export const resendOtpController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const result = await resendOtp(email);
    res.status(200).json(result);
  } catch (err: any) {
    console.error('Resend OTP error:', err);
    res.status(400).json({ error: err.message });
  }
};


