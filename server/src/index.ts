import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { Connection } from "./database/db";
import Router from "./routes/route";

// Load environment variables from .env file
dotenv.config();

const app = express();

// ✅ Configure CORS to allow specific origins
app.use(cors({
  origin: [
    '*',
    'http://localhost:3000',
    'http://localhost:8000',
    'https://crm-x-orcin.vercel.app',
    'https://crm-x-2.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

// ✅ Optional: Log incoming origin for debugging
app.use((req, res, next) => {
  console.log("Incoming request from:", req.headers.origin);
  next();
});

// Parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use your defined routes
app.use("/", Router);

// Connect to the database
Connection();

// Define server port
const PORT = process.env.PORT || 8000;

// Start server with port conflict fallback
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
})
.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    const newPort = Number(PORT) + 1;
    console.error(`Port ${PORT} is already in use. Trying port ${newPort}...`);
    server.close();
    app.listen(newPort, () => console.log(`Server is now listening on port ${newPort}.`));
  } else {
    console.error('Server error:', error);
  }
});
