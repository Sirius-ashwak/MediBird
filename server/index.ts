import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve websocket test from public directory
app.get('/websocket-test', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'websocket-test.html'));
});

app.use((req, res, next) => {
  // Enable CORS for all routes with credentials support
  const origin = req.headers.origin;
  
  // Make sure we accept requests from our own domain
  // In development, this could be the Vite server
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    // Default to own server
    res.header("Access-Control-Allow-Origin", "http://localhost:5000");
  }
  
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    // Suppress WebSocket and connection related errors to prevent app crashes
    if (err.message && (
      err.message.includes('WebSocket') || 
      err.message.includes('ws ') || 
      err.message.includes('socket') || 
      err.message.includes('Socket') || 
      err.message.includes('ECONNRESET') ||
      err.message.includes('network')
    )) {
      console.error('WebSocket/Connection error (non-critical):', err.message);
      if (!res.headersSent) {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ message });
      }
      return; // Don't pass the error further
    }
    
    // Handle regular errors
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    
    // Log but don't throw - this prevents process crashes
    console.error(`Error (${status}):`, message);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
})();
