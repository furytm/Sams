import { prisma } from "./prisma/client";
import express, { Request, Response } from 'express';
import contactUsRoutes from "./routes/contactus.routes"
import cors from 'cors'
import bodyParser from 'body-parser';
import subscriberRouter from './routes/subscribe';
import authRouter from './routes/auth.routes';
import { scheduleUserCleanup } from './jobs/deleteExpiredUsers.job';
import tokenRouter from './routes/token.routes'
import cookieParser from 'cookie-parser';


const app = express();
app.use(express.json())
app.use(bodyParser.json());
app.use(cookieParser()); 
const port = 3000;


app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://school-managemnet.netlify.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

  
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript!');
});
app.use('/api/contactus', contactUsRoutes)
app.use('/api', subscriberRouter);
app.use('/api/auth', authRouter);
app.use('/api/token', tokenRouter)
app.get('/api/ping', (req, res) => {
  console.log(`[PING] Server is alive at ${new Date().toISOString()}`);
  res.status(200).json({ message: 'pong' });
});
scheduleUserCleanup();


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
