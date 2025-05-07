import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { blockchain } from "./blockchain";
import { aiService } from "./aiService";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { WebSocketServer, WebSocket } from "ws";
import MemoryStore from "memorystore";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import {
  insertUserSchema,
  insertMedicalRecordSchema,
  insertConsentSchema,
  insertAiConsultationSchema,
  insertAiMessageSchema,
  insertAppointmentSchema,
  insertActivitySchema,
  insertHealthProfileSchema,
} from "../shared/schema";

const MemorySessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session and authentication
  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || "medibridge-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1000 },
    store: new MemorySessionStore({ checkPeriod: 86400000 }),
  });

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Add a simple health check endpoint that doesn't require auth
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok",
      service: "MediBridge API",
      timestamp: new Date().toISOString()
    });
  });

  // Configure passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (user.password !== password) {
          // In a real app, use bcrypt to compare passwords
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Helper middleware for requiring authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Helper function to handle validation errors
  const validateSchema = (schema: any, data: any) => {
    try {
      return { data: schema.parse(data), error: null };
    } catch (error) {
      if (error instanceof ZodError) {
        return { data: null, error: fromZodError(error).message };
      }
      return { data: null, error: "Validation error" };
    }
  };

  // ======== Authentication Routes ========
  app.post("/api/auth/register", async (req, res) => {
    const { data, error } = validateSchema(insertUserSchema, req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    try {
      const existingUser = await storage.getUserByUsername(data.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const walletId = await blockchain.createWallet();
      const user = await storage.createUser({
        ...data,
        walletId: walletId,
      });

      // Create default health profile
      await storage.createHealthProfile({
        userId: user.id,
        patientId: `#${Math.floor(1000000 + Math.random() * 9000000)}`, // Generate random patient ID
        gender: "Unknown",
        age: 0,
      });

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error during login after registration" });
        }
        return res.status(201).json({ user });
      });
    } catch (err) {
      console.error("Registration error:", err);
      return res.status(500).json({ message: "Server error during registration" });
    }
  });

  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    res.json({ user: req.user });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/session", (req, res) => {
    if (req.isAuthenticated()) {
      return res.json({ user: req.user });
    }
    return res.status(401).json({ message: "Not authenticated" });
  });

  // ======== User Profile Routes ========
  app.get("/api/profile", requireAuth, async (req: any, res) => {
    try {
      const profile = await storage.getHealthProfile(req.user.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (err) {
      console.error("Error fetching profile:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/profile", requireAuth, async (req: any, res) => {
    try {
      const profile = await storage.updateHealthProfile(req.user.id, req.body);
      res.json(profile);
    } catch (err) {
      console.error("Error updating profile:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ======== Medical Records Routes ========
  app.get("/api/medical-records", requireAuth, async (req: any, res) => {
    try {
      const records = await storage.getMedicalRecords(req.user.id);
      res.json(records);
    } catch (err) {
      console.error("Error fetching medical records:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/medical-records", requireAuth, async (req: any, res) => {
    const { data, error } = validateSchema(insertMedicalRecordSchema, {
      ...req.body,
      userId: req.user.id,
    });

    if (error) {
      return res.status(400).json({ message: error });
    }

    try {
      // Store record in blockchain
      const hash = await blockchain.storeRecord({
        type: data.type,
        title: data.title,
        userId: req.user.id,
        timestamp: new Date().toISOString(),
      });

      // Store record in database
      const record = await storage.createMedicalRecord({
        ...data,
        blockchainHash: hash,
        verified: true,
      });

      // Log activity
      await storage.createActivity({
        userId: req.user.id,
        type: "record_upload",
        title: `${data.type} uploaded`,
        description: data.title,
        metadata: { recordId: record.id },
      });

      res.status(201).json(record);
    } catch (err) {
      console.error("Error creating medical record:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/medical-records/:id", requireAuth, async (req: any, res) => {
    try {
      const record = await storage.getMedicalRecord(parseInt(req.params.id));
      if (!record) {
        return res.status(404).json({ message: "Record not found" });
      }

      if (record.userId !== req.user.id) {
        // Check if the user has consent to view this record
        const hasConsent = await storage.checkConsent(record.id, req.user.id);
        if (!hasConsent) {
          return res.status(403).json({ message: "Not authorized to view this record" });
        }
      }

      res.json(record);
    } catch (err) {
      console.error("Error fetching medical record:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ======== Consent Management Routes ========
  app.get("/api/consent/providers", requireAuth, async (req: any, res) => {
    try {
      const consents = await storage.getUserConsents(req.user.id);
      res.json(consents);
    } catch (err) {
      console.error("Error fetching consents:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/consent/providers", requireAuth, async (req: any, res) => {
    const { data, error } = validateSchema(insertConsentSchema, {
      ...req.body,
      userId: req.user.id,
    });

    if (error) {
      return res.status(400).json({ message: error });
    }

    try {
      // Record consent on blockchain
      const hash = await blockchain.storeConsent({
        userId: req.user.id,
        providerId: data.providerId,
        dataType: data.dataType,
        status: data.status,
        timestamp: new Date().toISOString(),
      });

      // Store consent in database
      const consent = await storage.createConsent(data);

      // Log activity
      await storage.createActivity({
        userId: req.user.id,
        type: "consent_created",
        title: `Consent ${data.status}`,
        description: `Data access for ${data.dataType}`,
        metadata: { consentId: consent.id },
      });

      res.status(201).json(consent);
    } catch (err) {
      console.error("Error creating consent:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/consent/providers/:id", requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // In a real app, verify that this consent belongs to the user
      // For this mock version, we'll skip that check

      // Record consent change on blockchain
      await blockchain.updateConsent({
        consentId: id,
        status: req.body.status || (req.body.active ? "approved" : "rejected"),
        userId: req.user.id,
        timestamp: new Date().toISOString(),
      });

      // Update consent in database
      const consent = await storage.updateConsent(id, req.body);

      // Log activity
      await storage.createActivity({
        userId: req.user.id,
        type: "consent_updated",
        title: `Consent ${req.body.status || (req.body.active ? "approved" : "rejected")}`,
        description: `Data access updated`,
        metadata: { consentId: id },
      });

      res.json(consent);
    } catch (err) {
      console.error("Error updating consent:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ======== Healthcare Providers Routes ========
  app.get("/api/providers", requireAuth, async (req, res) => {
    try {
      const allProviders = await storage.getProviders();
      res.json(allProviders);
    } catch (err) {
      console.error("Error fetching providers:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/providers/:id", requireAuth, async (req, res) => {
    try {
      const provider = await storage.getProvider(parseInt(req.params.id));
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      res.json(provider);
    } catch (err) {
      console.error("Error fetching provider:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ======== AI Consultation Routes ========
  app.get("/api/ai/consultations", requireAuth, async (req: any, res) => {
    try {
      const consultations = await storage.getAiConsultations(req.user.id);
      res.json(consultations);
    } catch (err) {
      console.error("Error fetching consultations:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/ai/consultations", requireAuth, async (req: any, res) => {
    const { data, error } = validateSchema(insertAiConsultationSchema, {
      ...req.body,
      userId: req.user.id,
    });

    if (error) {
      return res.status(400).json({ message: error });
    }

    try {
      const consultation = await storage.createAiConsultation(data);
      
      // Add initial AI message
      await storage.createAiMessage({
        consultationId: consultation.id,
        content: "Hello! How can I help you with your health today?",
        sender: "ai",
      });

      res.status(201).json(consultation);
    } catch (err) {
      console.error("Error creating consultation:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/ai/consultations/:id/messages", requireAuth, async (req: any, res) => {
    try {
      const consultation = await storage.getAiConsultation(parseInt(req.params.id));
      if (!consultation || consultation.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to access this consultation" });
      }

      const messages = await storage.getAiMessages(consultation.id);
      res.json(messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/ai/message", requireAuth, async (req: any, res) => {
    const { message, consultationId } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message content is required" });
    }

    try {
      let activeConsultationId = consultationId;

      // If no consultation ID provided, create a new one or use the most recent active one
      if (!activeConsultationId) {
        const consultations = await storage.getAiConsultations(req.user.id);
        const activeConsultation = consultations.find(c => c.status === "active");
        
        if (activeConsultation) {
          activeConsultationId = activeConsultation.id;
        } else {
          // Create new consultation
          const newConsultation = await storage.createAiConsultation({
            userId: req.user.id,
            title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
            status: "active",
          });
          activeConsultationId = newConsultation.id;
        }
      }

      // Save the user message
      await storage.createAiMessage({
        consultationId: activeConsultationId,
        content: message,
        sender: "user",
      });

      // Get AI response
      const aiResponse = await aiService.getResponse(message, req.user.id);

      // Save the AI response
      await storage.createAiMessage({
        consultationId: activeConsultationId,
        content: aiResponse,
        sender: "ai",
      });

      // Record activity
      await storage.createActivity({
        userId: req.user.id,
        type: "ai_consultation",
        title: "AI Health Consultation",
        description: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
        metadata: { consultationId: activeConsultationId },
      });

      res.json({ response: aiResponse, consultationId: activeConsultationId });
    } catch (err) {
      console.error("Error processing AI message:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ======== Blockchain Verification Routes ========
  app.get("/api/blockchain/logs", requireAuth, async (req: any, res) => {
    try {
      const logs = await storage.getBlockchainLogs(req.user.id);
      res.json(logs);
    } catch (err) {
      console.error("Error fetching blockchain logs:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/blockchain/verify/:recordId", requireAuth, async (req: any, res) => {
    try {
      const recordId = parseInt(req.params.recordId);
      const record = await storage.getMedicalRecord(recordId);
      
      if (!record) {
        return res.status(404).json({ message: "Record not found" });
      }

      if (record.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to verify this record" });
      }

      // Make sure blockchainHash is not null
      if (!record.blockchainHash) {
        return res.status(400).json({ message: "Record does not have a blockchain hash" });
      }
      
      const isVerified = await blockchain.verifyRecord(record.blockchainHash, {
        type: record.type,
        title: record.title,
        userId: record.userId,
      });

      if (isVerified) {
        await storage.updateMedicalRecord(recordId, { verified: true });
        return res.json({ verified: true });
      }

      res.json({ verified: false });
    } catch (err) {
      console.error("Error verifying record:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ======== Appointments Routes ========
  app.get("/api/appointments", requireAuth, async (req: any, res) => {
    try {
      const appointments = await storage.getAppointments(req.user.id);
      res.json(appointments);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/appointments", requireAuth, async (req: any, res) => {
    const { data, error } = validateSchema(insertAppointmentSchema, {
      ...req.body,
      userId: req.user.id,
    });

    if (error) {
      return res.status(400).json({ message: error });
    }

    try {
      const appointment = await storage.createAppointment(data);
      
      // Log activity
      await storage.createActivity({
        userId: req.user.id,
        type: "appointment_created",
        title: "Appointment Scheduled",
        description: `${data.type} with ${data.doctorName}`,
        metadata: { appointmentId: appointment.id },
      });

      res.status(201).json(appointment);
    } catch (err) {
      console.error("Error creating appointment:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ======== Activities Routes ========
  app.get("/api/activities", requireAuth, async (req: any, res) => {
    try {
      const activities = await storage.getActivities(req.user.id);
      res.json(activities);
    } catch (err) {
      console.error("Error fetching activities:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Create HTTP server and WebSocket server
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws',  // Use a distinct path to avoid conflicts with Vite HMR
    clientTracking: true,
    perMessageDeflate: false,
    // Handle WebSocket CORS
    verifyClient: (info, callback) => {
      // Allow all origins for WebSocket connections
      callback(true);
    }
  });
  
  // Store connected clients with their user info
  const clients = new Map();
  
  // Handle WebSocket connections for real-time updates
  wss.on("connection", (ws, req) => {
    console.log("WebSocket client connected");
    
    // Add a ping-pong mechanism to keep connections alive
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      }
    }, 30000);
    
    // Handle incoming messages
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("Received WebSocket message:", data);
        
        // Handle different message types
        switch (data.type) {
          case 'auth':
            // Store user info with this connection
            if (data.userId) {
              clients.set(ws, { userId: data.userId });
              // Send acknowledgment
              ws.send(JSON.stringify({ type: 'auth_success' }));
            }
            break;
            
          case 'medical_update':
            // Broadcast medical record updates to authorized users
            if (clients.has(ws) && clients.get(ws).userId) {
              // In a real app, check permissions before broadcasting
              broadcastToAuthorizedUsers(data, clients.get(ws).userId);
            }
            break;
            
          case 'consent_changed':
            // Handle consent changes in real-time
            if (clients.has(ws) && data.providerId) {
              notifyProvider(data.providerId, data);
            }
            break;
            
          default:
            console.log('Unhandled message type:', data.type);
        }
      } catch (err) {
        console.error("Error processing WebSocket message:", err);
      }
    });
    
    // Handle connection errors
    ws.on("error", (error) => {
      console.error("WebSocket connection error:", error.message);
      // Don't terminate the connection on error
    });
    
    // Handle connection close
    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      // Clear ping interval
      clearInterval(pingInterval);
      // Remove client from tracking
      clients.delete(ws);
    });
  });
  
  // Function to broadcast messages to users authorized to receive updates
  function broadcastToAuthorizedUsers(data: Record<string, any>, senderUserId: number): void {
    clients.forEach((clientData, client) => {
      // Only send to clients in OPEN state
      if (client.readyState === WebSocket.OPEN) {
        // Check if this client should receive the message
        // In a real app, this would check consent records
        if (clientData.userId !== senderUserId) {
          // Only send to relevant providers or specific users
          client.send(JSON.stringify({
            type: 'update',
            data: data
          }));
        }
      }
    });
  }
  
  // Function to notify a specific provider
  function notifyProvider(providerId: number, data: Record<string, any>): void {
    clients.forEach((clientData, client) => {
      if (client.readyState === WebSocket.OPEN && clientData.providerId === providerId) {
        client.send(JSON.stringify({
          type: 'consent_notification',
          data: data
        }));
      }
    });
  }
  
  // Add error handler for the WebSocket server
  wss.on("error", (error) => {
    console.error("WebSocket server error:", error.message);
    // Don't crash the server on WebSocket errors
  });

  return httpServer;
}
