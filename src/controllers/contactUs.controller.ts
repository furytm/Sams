import { ContactusService } from "../services/contactUs";
import { Request, Response } from "express";

export const ContactUs = async (req: Request, res: Response): Promise<void> => {
    console.log(req.body)
  try {

    const { fullname, workemail, phonenumber, catergory, message, findus } =
      req.body;
    if (
      !fullname ||
      !workemail ||
      !phonenumber ||
      !catergory ||
      !message ||
      !findus
    ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const contact = await ContactusService.createContactUs(
      fullname,
      workemail,
      phonenumber,
      catergory,
      message,
      findus
    );
    res
      .status(201)
      .json({
        message: "Contact request submitted successfully",
        data: contact,
      });
  } catch (error: unknown) {
    // Handle unexpected errors
    console.error("Error in creating contact request:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred." });
    }
  }
};
