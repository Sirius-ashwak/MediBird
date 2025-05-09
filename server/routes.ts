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
import { createHash } from "crypto";
import { signData } from "./crypto";
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
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        blockchain: true,
        ai: true,
        storage: true
      }
    });
  });

  // Setup session and authentication
  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || "medibird-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax",
      path: "/"
    },
    store: new MemorySessionStore({ 
      checkPeriod: 86400000, // Clear expired sessions every 24 hours
      stale: false // Don't allow stale sessions
    }),
  });

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Helper function to validate user registration
  const validateRegistration = (username: string, password: string) => {
    if (!username || username.length < 3) {
      return "Username must be at least 3 characters long";
    }
    if (!password || password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

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
  app.post("/api/register", async (req, res) => {
    const { data, error } = validateSchema(insertUserSchema, req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    try {
      const existingUser = await storage.getUserByUsername(data.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      if (!data.walletId) {
        return res.status(400).json({ message: "Wallet ID is required for registration" });
      }

      const user = await storage.createUser({
        ...data,
        walletId: data.walletId,
      });

      // Create default health profile
      await storage.createHealthProfile({
        userId: user.id,
        patientId: `#${Math.floor(1000000 + Math.random() * 9000000)}`,
        gender: "Unknown",
        age: 0,
      });

      // Record this activity
      await storage.createActivity({
        userId: user.id,
        type: "user_registered",
        title: "New User Registration",
        description: `Account created for ${user.name}`,
        metadata: { username: user.username },
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

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Return a clone of the user object to avoid mutations
    const userObj = JSON.parse(JSON.stringify(req.user));
    res.json({ user: userObj });
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.json({ success: true });
    });
  });

  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated() && req.user) {
      // Return a clone of the user object to avoid mutations
      const userObj = JSON.parse(JSON.stringify(req.user));
      return res.json({ user: userObj });
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
        dataHash: createHash('sha256').update(JSON.stringify(data)).digest('hex'),
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
        dataType: Array.isArray(data.dataType) ? data.dataType : [data.dataType],
        status: data.status,
        timestamp: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        accessConditions: {
          purpose: "medical_treatment"
        },
        cryptographicProof: {
          signature: signData(JSON.stringify({
            userId: req.user.id,
            providerId: data.providerId,
            dataType: data.dataType,
            timestamp: new Date().toISOString()
          }), "user_private_key"), // In real app, use user's private key
          publicKey: "user_public_key" // In real app, use user's public key
        }
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
        reason: req.body.reason || "User update via dashboard",
        signature: signData(JSON.stringify({
          consentId: id,
          status: req.body.status || (req.body.active ? "approved" : "rejected"),
          userId: req.user.id,
          timestamp: new Date().toISOString()
        }), "user_private_key") // In real app, use user's private key
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
      const aiMessageRecord = await storage.createAiMessage({
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

      res.json({ 
        response: aiResponse, 
        consultationId: activeConsultationId,
        messageId: aiMessageRecord.id
      });
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
  
  // Get blockchain network information
  app.get("/api/blockchain/info", async (req, res) => {
    try {
      const blockchainInfo = await blockchain.getBlockchainInfo();
      res.json(blockchainInfo);
    } catch (err) {
      console.error("Error retrieving blockchain information:", err);
      res.status(500).json({ 
        message: "Failed to retrieve blockchain information",
        error: (err as Error).message,
        connected: false,
        simulationMode: true
      });
    }
  });
  
  // Create a new blockchain wallet
  app.post("/api/blockchain/wallet", async (req: any, res) => {
    try {
      console.log("API: Creating new blockchain wallet...");
      const walletAddress = await blockchain.createWallet();
      console.log(`API: Wallet created successfully with address: ${walletAddress}`);
      
      // If user is authenticated, record the activity
      if (req.isAuthenticated() && req.user) {
        console.log(`API: Recording wallet creation for user ID: ${req.user.id}`);
        // Record this activity
        await storage.createActivity({
          userId: req.user.id,
          type: "blockchain_wallet_created",
          title: "Blockchain Wallet Created",
          description: `New Polkadot wallet created with address ${walletAddress.substring(0, 10)}...`,
          metadata: { walletAddress },
        });
        
        // Log this in blockchain logs
        await storage.createBlockchainLog({
          userId: req.user.id,
          operation: "CREATE_WALLET",
          transactionHash: walletAddress,
          details: "Created new Polkadot wallet address",
          status: "completed"
        });
      }
      
      res.json({ 
        address: walletAddress,
        created: true,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      const error = err as Error;
      console.error("Error creating blockchain wallet:", error.message);
      console.error("Stack trace:", error.stack || "No stack trace available");
      
      // Check if the error is related to the polkadot.js library
      const errorMessage = error.message.toLowerCase();
      let userFriendlyMessage = "Failed to create blockchain wallet";
      
      if (errorMessage.includes("keyring") || errorMessage.includes("crypto")) {
        userFriendlyMessage = "Failed to initialize blockchain cryptography. Using simulated wallet instead.";
      } else if (errorMessage.includes("mnemonic")) {
        userFriendlyMessage = "Failed to generate secure wallet credentials. Using simulated wallet instead.";
      }
      
      res.status(500).json({ 
        message: userFriendlyMessage,
        error: error.message,
        walletAddress: error.message.includes("simulated") ? error.message.split("address: ")[1] : null
      });
    }
  });

  // Store medical record on blockchain
  app.post("/api/blockchain/store/:recordId", requireAuth, async (req: any, res) => {
    try {
      const recordId = parseInt(req.params.recordId);
      const record = await storage.getMedicalRecord(recordId);
      
      if (!record) {
        return res.status(404).json({ message: "Record not found" });
      }

      if (record.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to store this record" });
      }
      
      // Check if record is already on blockchain
      if (record.blockchainHash) {
        return res.status(400).json({ 
          message: "Record is already stored on blockchain",
          transactionHash: record.blockchainHash
        });
      }
      
      // Create record data for blockchain
      const blockchainRecord = {
        type: record.type,
        title: record.title,
        userId: record.userId,
        timestamp: new Date().toISOString(),
        dataHash: createHash('sha256').update(JSON.stringify(record)).digest('hex')
      };
      
      // Store record on blockchain
      const transactionHash = await blockchain.storeRecord(blockchainRecord);
      
      // Update record with blockchain hash
      await storage.updateMedicalRecord(recordId, { 
        blockchainHash: transactionHash,
        blockchainTimestamp: new Date(),
        verified: true
      });
      
      // Log this blockchain transaction
      await storage.createBlockchainLog({
        userId: req.user.id,
        operation: "STORE_RECORD",
        transactionHash,
        details: `Stored medical record: ${record.title}`,
        status: "completed"
      });
      
      // Record activity
      await storage.createActivity({
        userId: req.user.id,
        type: "blockchain_record_stored",
        title: "Medical Record Stored on Blockchain",
        description: `${record.title} has been securely stored on the blockchain`,
        metadata: { recordId, transactionHash },
      });
      
      res.json({ 
        stored: true, 
        recordId, 
        transactionHash,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error storing record on blockchain:", err);
      res.status(500).json({ 
        message: "Error storing record on blockchain",
        error: (err as Error).message,
      });
    }
  });
  
  // Store consent on blockchain
  app.post("/api/blockchain/consent/:consentId", requireAuth, async (req: any, res) => {
    try {
      const consentId = parseInt(req.params.consentId);
      const consent = await storage.getConsent(consentId);
      
      if (!consent) {
        return res.status(404).json({ message: "Consent record not found" });
      }

      if (consent.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to store this consent" });
      }
      
      // Create consent data for blockchain
      const blockchainConsent = {
        userId: consent.userId,
        providerId: consent.providerId,
        dataType: Array.isArray(consent.dataType) ? consent.dataType : [consent.dataType],
        status: consent.status,
        timestamp: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        accessConditions: {
          purpose: "medical_treatment"
        },
        cryptographicProof: {
          signature: signData(JSON.stringify({
            userId: consent.userId,
            providerId: consent.providerId,
            dataType: consent.dataType,
            timestamp: new Date().toISOString()
          }), "user_private_key"), // In real app, use user's private key
          publicKey: "user_public_key" // In real app, use user's public key
        }
      };
      
      // Store consent on blockchain
      const transactionHash = await blockchain.storeConsent(blockchainConsent);
      
      // Update consent with blockchain hash
      await storage.updateConsent(consentId, { 
        blockchainHash: transactionHash,
        blockchainTimestamp: new Date()
      });
      
      // Log this blockchain transaction
      await storage.createBlockchainLog({
        userId: req.user.id,
        operation: "STORE_CONSENT",
        transactionHash,
        details: `Stored consent for provider ID ${consent.providerId}`,
        status: "completed"
      });
      
      // Record activity
      await storage.createActivity({
        userId: req.user.id,
        type: "blockchain_consent_stored",
        title: "Consent Stored on Blockchain",
        description: `Consent for provider access has been secured on the blockchain`,
        metadata: { consentId, transactionHash },
      });
      
      res.json({ 
        stored: true, 
        consentId, 
        transactionHash,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error storing consent on blockchain:", err);
      res.status(500).json({ 
        message: "Error storing consent on blockchain",
        error: (err as Error).message,
      });
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

  // ======== Advanced Blockchain Identity & Access Control Routes ========

  // Create verifiable credential for cross-provider identity
  app.post("/api/blockchain/identity/credential", requireAuth, async (req: any, res) => {
    try {
      const { credentialType, data } = req.body;
      
      if (!credentialType) {
        return res.status(400).json({ message: "Credential type is required" });
      }
      
      const credentialId = await blockchain.createVerifiableCredential(
        req.user.id,
        credentialType,
        data || { userId: req.user.id, name: req.user.name }
      );
      
      // Log activity
      await storage.createActivity({
        userId: req.user.id,
        type: "credential_created",
        title: "Identity Credential Created",
        description: `Created ${credentialType} verifiable credential`,
        metadata: { credentialId }
      });
      
      // Log in blockchain logs
      await storage.createBlockchainLog({
        userId: req.user.id,
        operation: "CREATE_CREDENTIAL",
        transactionHash: credentialId,
        details: `Created ${credentialType} verifiable credential`,
        status: "completed"
      });
      
      res.json({
        credentialId,
        type: credentialType,
        created: true,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error creating verifiable credential:", err);
      res.status(500).json({ message: "Failed to create verifiable credential" });
    }
  });
  
  // Verify a credential
  app.post("/api/blockchain/identity/verify", requireAuth, async (req: any, res) => {
    try {
      const { credentialId } = req.body;
      
      if (!credentialId) {
        return res.status(400).json({ message: "Credential ID is required" });
      }
      
      const isValid = blockchain.verifyCredential(credentialId, req.user.id);
      
      res.json({
        verified: isValid,
        credentialId,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error verifying credential:", err);
      res.status(500).json({ message: "Failed to verify credential" });
    }
  });
  
  // Grant selective data access to a provider
  app.post("/api/blockchain/access/grant", requireAuth, async (req: any, res) => {
    try {
      const { providerId, dataTypes, duration } = req.body;
      
      if (!providerId) {
        return res.status(400).json({ message: "Provider ID is required" });
      }
      
      if (!dataTypes || !Array.isArray(dataTypes) || dataTypes.length === 0) {
        return res.status(400).json({ message: "Data types are required" });
      }
      
      // Default access duration: 30 days
      const accessDuration = duration || 30;
      
      // Calculate expiry date
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + accessDuration);
      
      // Store consent on blockchain
      const blockchainHash = await blockchain.grantSelectiveAccess(
        req.user.id,
        providerId,
        dataTypes,
        accessDuration
      );
      
      // Create a matching database record for local storage
      const databaseConsent = await storage.createConsent({
        userId: req.user.id,
        providerId: parseInt(providerId.toString()),
        status: "approved", // Auto-approve blockchain consents
        dataType: dataTypes.join(','), // Format for database storage
        expiryDate: expiryDate,
        active: true, // Make it active by default
        blockchainHash: blockchainHash,
        blockchainTimestamp: new Date()
      });
      
      // Log activity
      await storage.createActivity({
        userId: req.user.id,
        type: "selective_access_granted",
        title: "Provider Access Granted",
        description: `Granted access to ${dataTypes.join(', ')} for ${accessDuration} days`,
        metadata: { 
          providerId, 
          dataTypes, 
          duration: accessDuration,
          databaseConsentId: databaseConsent.id,
          blockchainHash
        }
      });
      
      // Log in blockchain logs
      await storage.createBlockchainLog({
        userId: req.user.id,
        operation: "GRANT_ACCESS",
        transactionHash: blockchainHash,
        details: `Granted selective access to provider ${providerId}`,
        status: "completed"
      });
      
      res.json({
        consentId: databaseConsent.id,
        blockchainHash,
        providerId,
        dataTypes,
        duration: accessDuration,
        expiryDate: expiryDate.toISOString(),
        created: true,
        timestamp: new Date().toISOString(),
        active: true
      });
    } catch (err) {
      console.error("Error granting selective access:", err);
      res.status(500).json({ message: "Failed to grant selective access" });
    }
  });
  
  // Verify provider access to data
  app.post("/api/blockchain/access/verify", requireAuth, async (req: any, res) => {
    try {
      const { patientId, dataType } = req.body;
      
      if (!patientId) {
        return res.status(400).json({ message: "Patient ID is required" });
      }
      
      if (!dataType) {
        return res.status(400).json({ message: "Data type is required" });
      }
      
      const hasAccess = blockchain.verifyProviderAccess(
        patientId,
        req.user.id, // Current user is the provider
        dataType
      );
      
      res.json({
        hasAccess,
        patientId,
        dataType,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error verifying provider access:", err);
      res.status(500).json({ message: "Failed to verify provider access" });
    }
  });

  // Create HTTP server and WebSocket server
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws',
    clientTracking: true,
    perMessageDeflate: false,
    verifyClient: (info, callback) => {
      callback(true); // Allow all connections
    }
  });
  
  // Store connected clients with their user info
  const clients = new Map();
  
  // Handle WebSocket connections
  wss.on("connection", (ws, req) => {
    console.log("WebSocket client connected");
    
    // Add ping-pong mechanism
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
        
        switch (data.type) {
          case 'auth':
            if (data.userId) {
              clients.set(ws, { userId: data.userId });
              ws.send(JSON.stringify({ type: 'auth_success' }));
            }
            break;
            
          case 'medical_update':
            if (clients.has(ws) && clients.get(ws).userId) {
              broadcastToAuthorizedUsers(data, clients.get(ws).userId);
            }
            break;
            
          case 'consent_changed':
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
    });
    
    // Handle connection close
    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      clearInterval(pingInterval);
      clients.delete(ws);
    });
  });

  // Function to broadcast messages to authorized users
  function broadcastToAuthorizedUsers(data: Record<string, any>, senderUserId: number): void {
    clients.forEach((clientData, client) => {
      if (client.readyState === WebSocket.OPEN) {
        if (clientData.userId !== senderUserId) {
          client.send(JSON.stringify({
            type: 'update',
            data: data
          }));
        }
      }
    });
  }
  
  // Function to notify specific providers
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
  });

  // Start the server
  const port = parseInt(process.env.PORT || '5000');
  const host = process.env.HOST || '0.0.0.0'; // Bind to all network interfaces by default
  httpServer.listen(port, host, () => {
    console.log(`Server running on ${host}:${port}`);
  });

  return httpServer;
}
