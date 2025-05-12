# crmX - Advanced Customer Relationship Management System

[//]: # "Insert Architecture Diagram Here"

## Overview

crmX is a modern, full-stack CRM system designed to help businesses efficiently manage customer relationships, track order data, and run targeted marketing campaigns. The application provides insightful analytics, AI-powered message suggestions, and campaign automation tools.

## Tech Stack

### Frontend
- **Framework**: Next.js 14
- **UI**: React 18, Tailwind CSS
- **State Management**: React Context API
- **Authentication**: Firebase Auth (Google Sign-in)
- **Charting**: Chart.js, Tremor
- **Component Libraries**: Radix UI, Headless UI
- **Table Management**: TanStack Table
- **Toast Notifications**: Sonner

### Backend
- **Runtime**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Message Queue**: RabbitMQ (CloudAMQP)
- **API Client**: Axios
- **AI Integration**: Google Gemini AI

### DevOps
- **Development**: TypeScript, Nodemon
- **Package Manager**: pnpm
- **Development Tools**: ESLint, TypeScript

## Project Structure

```
crmX/
├── client/              # Next.js frontend
│   ├── public/          # Static assets
│   └── src/
│       ├── app/         # App router pages
│       ├── components/  # React components
│       ├── hooks/       # Custom hooks
│       ├── lib/         # Utility functions
│       └── utils/       # Helper utilities
└── server/              # Express backend
    └── src/
        ├── controller/  # API controllers
        ├── database/    # Database configuration
        ├── model/       # Mongoose schemas
        └── routes/      # Express routes
```

## Features

- 📊 **Dashboard Analytics**: Real-time insights into customer behavior and sales
- 🤖 **AI-Powered Suggestions**: Gemini AI integration for smart message suggestions  
- 📱 **Campaign Management**: Create, track, and analyze marketing campaigns
- 👥 **Customer Segmentation**: Natural language customer segmentation
- 📈 **Performance Tracking**: Monitor campaign performance with detailed metrics
- 🔐 **Authentication**: Secure login via Firebase Google Auth

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (preferred package manager)
- MongoDB instance
- RabbitMQ instance (CloudAMQP or self-hosted)
- Firebase project
- Google Gemini AI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/crmX-v-2.git
cd crmX-v-2
```

2. Install dependencies for both client and server
```bash
# Install client dependencies
cd client
pnpm install

# Install server dependencies
cd ../server
pnpm install
```

3. Configure environment variables

#### Client (.env.local)
```
NEXT_PUBLIC_BACKEND_SERVER_URL=http://localhost:8000

# Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# Gemini AI configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

#### Server (.env)
```
MONGODB_URI=your_mongodb_connection_string
PORT=8000
RABBITMQ_URL=your_rabbitmq_connection_string
```

### Running the Application

#### Development Mode

1. Start the server
```bash
cd server
pnpm run dev & pnpm run start:all
```

2. In a separate terminal, start the client
```bash
cd client
pnpm dev
```

3. Open your browser and navigate to `http://localhost:3000`

#### Production Mode

1. Build the client
```bash
cd client
pnpm build
```

2. Start the server and client
```bash
# Start the server
cd server
pnpm start:all

# In a separate terminal, start the client
cd client
pnpm start
```

## API Services

The backend consists of several microservices:
- **Main API**: Express server for handling REST endpoints
- **Consumer Service**: Processes messages from RabbitMQ queue
- **Dummy Vendor API**: Simulates third-party vendor interactions
- **Delivery Receipt API**: Handles delivery confirmation

