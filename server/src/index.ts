import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { Connection } from "./database/db";
import Router from "./routes/route";

// Configure dotenv properly
dotenv.config();

const app = express();
// Configure CORS to allow requests from your Vercel domain
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow any Vercel domains and localhost
    if (
      origin.includes('.vercel.app') || 
      origin.includes('onrender.com') || 
      origin.includes('localhost') ||
      origin === 'http://localhost:3000'
    ) {
      return callback(null, true);
    }
    
    console.log('CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle OPTIONS preflight requests
app.options('*', cors());

// Add CORS headers to all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use("/", Router);
Connection();

// Get port from environment variable or use default
const PORT = process.env.PORT || 10000;

// Start server with error handling for port conflicts
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
})
.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Trying port ${Number(PORT) + 1}...`);
    // Try the next port
    const newPort = Number(PORT) + 1;
    server.close();
    app.listen(newPort, () => console.log(`Server is now listening on port ${newPort}.`));
  } else {
    console.error('Server error:', error);
  }
});
