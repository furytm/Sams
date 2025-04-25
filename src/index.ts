import { prisma } from "./prisma/client";
import express, { Request, Response } from 'express';
import contactUsRoutes from "./routes/contactus.routes"
import cors from 'cors'

const app = express();
app.use(express.json())
const port = 3000;

app.use(
    cors({
      origin: "*", // Allows all origins
      methods: 'GET, POST, PUT, DELETE, OPTIONS',
      allowedHeaders: 'Content-Type, Authorization',
      credentials: true, // Allow cookies and authorization headers
    })
  );
  
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript!');
});
app.use('/api/contactus', contactUsRoutes)

async function startServer() {
    try {
      await prisma.$connect();  // Connect to PostgreSQL
      console.log("Connected to PostgreSQL successfully!");
  
      // Start the server
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      process.exit(1); // Exit if connection fails
    }
  }
  
  startServer();
