import { Request, Response } from 'express';
import {
  registerUser,
  verifyUserOtp,
  loginUser, setUser
} from '../services/auth.service';
import { error } from 'console';


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


// POST /auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
