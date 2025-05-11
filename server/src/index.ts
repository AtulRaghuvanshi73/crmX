import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { Connection } from "./database/db";
import Router from "./routes/route";

// Configure dotenv properly
dotenv.config();

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", Router);
Connection();

// Get port from environment variable or use default
const PORT = process.env.PORT || 8000;

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
