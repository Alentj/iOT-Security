# Secure IoT System

A secure, robust backend system for handling IoT communications, specifically designed to interoperate securely with ESP32 devices. Built on Node.js and Express.js, featuring rate limiting, secure headers, CORS, request logging, and unified error handling.

## Features

- **Security First**: Configured with Helmet, CORS, and Rate Limiting to prevent abusive traffic.
- **Robust Error Handling**: Global custom error handler ensures no sensitive stack traces are leaked in production.
- **Quality Tooling**: Preconfigured with ESLint and Prettier for strict code quality and uniform formatting.
- **Environment Aware**: Configured to seamlessly switch between local hardware testing and production environments.

## Prerequisites

- **Node.js**: v18 or later.
- **MongoDB**: A running local or remote MongoDB instance.

## Installation

1. Clone the repository and navigate to the project directory:

   ```bash
   cd secure-iot-system
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Setup environment variables by copying the example environment file:
   ```bash
   cp .env.example .env
   ```
   _Edit `.env` and fill in your actual configuration, primarily your `MONGODB_URI` and `PORT`._

## Running the Application

**Development Mode** (auto-reloads on file changes):

```bash
npm run dev
```

**Production Mode**:

```bash
npm start
```

## Available Scripts

- `npm run dev`: Starts the server with Nodemon.
- `npm start`: Standard command to boot the Node server.
- `npm run lint`: Scans the codebase for code quality issues and ESLint rules.
- `npm run format`: Automatically formats the codebase using Prettier.

## Code Structure

- `/config` - Database and system configurations.
- `/middleware` - Security, rate limiting, and global error handling middlewares.
- `/models` - Mongoose database schemas (Sensors, Users, Devices, Logs).
- `/routes` - Express router definitions grouped by resource.
- `/utils` - Utility classes, helpers, and third-party API integrations (e.g., Telegram).
- `/security` - Anomaly detection and input validation mechanisms.
