import {
  User,
  InsertUser,
  MedicalRecord,
  InsertMedicalRecord,
  Provider,
  InsertProvider,
  Consent,
  InsertConsent,
  AiConsultation,
  InsertAiConsultation,
  AiMessage,
  InsertAiMessage,
  BlockchainLog,
  InsertBlockchainLog,
  Appointment,
  InsertAppointment,
  Activity,
  InsertActivity,
  HealthProfile,
  InsertHealthProfile,
  DataAccessProvider,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;

  // Medical record methods
  getMedicalRecords(userId: number): Promise<MedicalRecord[]>;
  getMedicalRecord(id: number): Promise<MedicalRecord | undefined>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  updateMedicalRecord(id: number, data: Partial<MedicalRecord>): Promise<MedicalRecord>;
  deleteMedicalRecord(id: number): Promise<boolean>;

  // Provider methods
  getProviders(): Promise<Provider[]>;
  getProvider(id: number): Promise<Provider | undefined>;
  createProvider(provider: InsertProvider): Promise<Provider>;

  // Consent methods
  getUserConsents(userId: number): Promise<DataAccessProvider[]>;
  getConsent(id: number): Promise<Consent | undefined>;
  createConsent(consent: InsertConsent): Promise<Consent>;
  updateConsent(id: number, data: Partial<Consent>): Promise<Consent>;
  checkConsent(recordId: number, userId: number): Promise<boolean>;

  // AI consultation methods
  getAiConsultations(userId: number): Promise<AiConsultation[]>;
  getAiConsultation(id: number): Promise<AiConsultation | undefined>;
  createAiConsultation(consultation: InsertAiConsultation): Promise<AiConsultation>;
  updateAiConsultation(id: number, data: Partial<AiConsultation>): Promise<AiConsultation>;

  // AI message methods
  getAiMessages(consultationId: number): Promise<AiMessage[]>;
  createAiMessage(message: InsertAiMessage): Promise<AiMessage>;

  // Blockchain log methods
  getBlockchainLogs(userId: number): Promise<BlockchainLog[]>;
  createBlockchainLog(log: InsertBlockchainLog): Promise<BlockchainLog>;

  // Appointment methods
  getAppointments(userId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment>;

  // Activity methods
  getActivities(userId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Health profile methods
  getHealthProfile(userId: number): Promise<HealthProfile | undefined>;
  createHealthProfile(profile: InsertHealthProfile): Promise<HealthProfile>;
  updateHealthProfile(userId: number, data: Partial<HealthProfile>): Promise<HealthProfile>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private medicalRecords: Map<number, MedicalRecord>;
  private providers: Map<number, Provider>;
  private consents: Map<number, Consent>;
  private aiConsultations: Map<number, AiConsultation>;
  private aiMessages: Map<number, AiMessage>;
  private blockchainLogs: Map<number, BlockchainLog>;
  private appointments: Map<number, Appointment>;
  private activities: Map<number, Activity>;
  private healthProfiles: Map<number, HealthProfile>;

  private currentIds: {
    users: number;
    medicalRecords: number;
    providers: number;
    consents: number;
    aiConsultations: number;
    aiMessages: number;
    blockchainLogs: number;
    appointments: number;
    activities: number;
    healthProfiles: number;
  };

  constructor() {
    this.users = new Map();
    this.medicalRecords = new Map();
    this.providers = new Map();
    this.consents = new Map();
    this.aiConsultations = new Map();
    this.aiMessages = new Map();
    this.blockchainLogs = new Map();
    this.appointments = new Map();
    this.activities = new Map();
    this.healthProfiles = new Map();

    this.currentIds = {
      users: 1,
      medicalRecords: 1,
      providers: 1,
      consents: 1,
      aiConsultations: 1,
      aiMessages: 1,
      blockchainLogs: 1,
      appointments: 1,
      activities: 1,
      healthProfiles: 1,
    };

    // Initialize with sample data
    this.initSampleData();
  }

  // Initialize with sample data
  private initSampleData() {
    // Sample users
    const user1: User = {
      id: this.currentIds.users++,
      username: "user1",
      password: "password123", // In a real app, this would be hashed
      name: "Sarah Johnson",
      email: "sarah@example.com",
      walletId: "0x8F42aD42a88F0E3e55c87E7E2a",
      profileImage: "",
      role: "patient",
      createdAt: new Date(),
    };
    this.users.set(user1.id, user1);
    
    const user2: User = {
      id: this.currentIds.users++,
      username: "sarahj",
      password: "password123", // In a real app, this would be hashed
      name: "Sarah Johnson",
      email: "sarah@example.com",
      walletId: "0x9F52aD42a88F0E3e55c87E7E2b",
      profileImage: "",
      role: "patient",
      createdAt: new Date(),
    };
    this.users.set(user2.id, user2);

    // Sample health profile
    const healthProfile: HealthProfile = {
      id: this.currentIds.healthProfiles++,
      userId: user1.id,
      bloodType: "O+",
      height: "5'6\" (168 cm)",
      weight: "135 lbs (61 kg)",
      allergies: "Penicillin, Peanuts",
      emergencyContact: "John Johnson",
      patientId: "#8724531",
      age: 32,
      gender: "Female",
    };
    this.healthProfiles.set(healthProfile.id, healthProfile);

    // Sample providers
    const providers: Provider[] = [
      {
        id: this.currentIds.providers++,
        name: "Northwest Medical Center",
        type: "hospital",
        address: "123 Medical Dr, Seattle, WA",
        contact: "contact@nwmedical.example.com",
        blockchainId: "0xA7bC5e21F8dE3a2b5cD6f9e8B",
      },
      {
        id: this.currentIds.providers++,
        name: "Dr. Emily Chen",
        type: "doctor",
        address: "456 Health Ave, Seattle, WA",
        contact: "dr.chen@example.com",
        blockchainId: "0xB8cF6d32E7fE4b3c6aD5g0h1I",
      },
      {
        id: this.currentIds.providers++,
        name: "CityLabs Diagnostics",
        type: "lab",
        address: "789 Research Blvd, Seattle, WA",
        contact: "info@citylabs.example.com",
        blockchainId: "0xC9dG7e43F8gF4c4d7bE6h1j2K",
      },
    ];

    providers.forEach(provider => {
      this.providers.set(provider.id, provider);
    });

    // Sample consents
    const consents: Consent[] = [
      {
        id: this.currentIds.consents++,
        userId: user1.id,
        providerId: 1, // Northwest Medical Center
        status: "approved",
        dataType: "medical_history,lab_results,prescriptions",
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        createdAt: new Date(),
        active: true,
        blockchainHash: "0xD9eG7e43F8gF4c4d7bE6h1j2K6M8N9P",
        blockchainTimestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        id: this.currentIds.consents++,
        userId: user1.id,
        providerId: 2, // Dr. Emily Chen
        status: "approved",
        dataType: "medical_history,prescriptions",
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        createdAt: new Date(),
        active: true,
        blockchainHash: "0xE8fH6g43F8gF4c4d7bE6h1j2K6M8N9Q",
        blockchainTimestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        id: this.currentIds.consents++,
        userId: user1.id,
        providerId: 3, // CityLabs Diagnostics
        status: "pending",
        dataType: "lab_results",
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        createdAt: new Date(),
        active: false,
        blockchainHash: null,
        blockchainTimestamp: null
      },
    ];

    consents.forEach(consent => {
      this.consents.set(consent.id, consent);
    });

    // Sample medical records
    const medicalRecords: MedicalRecord[] = [
      {
        id: this.currentIds.medicalRecords++,
        userId: user1.id,
        type: "lab",
        title: "Complete Blood Count (CBC)",
        description: "Regular blood work",
        provider: "Northwest Medical Center",
        date: new Date(2023, 6, 15), // July 15, 2023
        blockchainHash: "0x72F934B2a7c8D5e6F3g4H5i6J7k8L9m",
        blockchainTimestamp: new Date(2023, 6, 16), // Added a day after the record
        verified: true,
        data: {
          results: {
            wbc: "7.5 x 10^9/L",
            rbc: "4.8 x 10^12/L",
            hemoglobin: "14.2 g/dL",
            hematocrit: "42%",
            platelets: "250 x 10^9/L",
          },
          notes: "All values within normal range.",
        },
      },
      {
        id: this.currentIds.medicalRecords++,
        userId: user1.id,
        type: "imaging",
        title: "Chest X-Ray",
        description: "Annual checkup",
        provider: "City Hospital",
        date: new Date(2023, 5, 22), // June 22, 2023
        blockchainHash: "0x58A12FD7b8C9d0E1f2G3h4I5j6K7l8",
        blockchainTimestamp: new Date(2023, 5, 23), // Added a day after the record
        verified: true,
        data: {
          findings: "No significant abnormalities detected.",
          recommendation: "No follow-up needed.",
        },
      },
      {
        id: this.currentIds.medicalRecords++,
        userId: user1.id,
        type: "prescription",
        title: "Amoxicillin 500mg",
        description: "For bacterial infection",
        provider: "Dr. Emily Chen",
        date: new Date(2023, 5, 15), // June 15, 2023
        blockchainHash: "0x31C79AF4c5D6e7F8g9H0i1J2k3L4m5",
        blockchainTimestamp: new Date(2023, 5, 15), // Same day as the prescription was issued
        verified: true,
        data: {
          dosage: "500mg",
          frequency: "3 times daily",
          duration: "10 days",
          notes: "Take with food.",
        },
      },
    ];

    medicalRecords.forEach(record => {
      this.medicalRecords.set(record.id, record);
    });

    // Sample appointments
    const appointments: Appointment[] = [
      {
        id: this.currentIds.appointments++,
        userId: user1.id,
        providerId: 1,
        doctorName: "Dr. Emily Chen",
        type: "checkup",
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        location: "Northwest Medical Center",
        notes: "Annual physical examination",
        status: "scheduled",
      },
      {
        id: this.currentIds.appointments++,
        userId: user1.id,
        providerId: 2,
        doctorName: "Dr. Robert Wilson",
        type: "consultation",
        date: new Date(2023, 6, 25, 14, 30), // July 25, 2023, 2:30 PM
        location: "Telehealth Appointment",
        notes: "Dermatology consultation",
        status: "scheduled",
      },
    ];

    appointments.forEach(appointment => {
      this.appointments.set(appointment.id, appointment);
    });

    // Sample activities
    const activities: Activity[] = [
      {
        id: this.currentIds.activities++,
        userId: user1.id,
        type: "record_upload",
        title: "Lab Results Uploaded",
        description: "Blood work results from City Hospital",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        metadata: { recordId: 1 },
      },
      {
        id: this.currentIds.activities++,
        userId: user1.id,
        type: "access_granted",
        title: "Access Granted",
        description: "Dr. Emily Chen at Northwest Medical",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        metadata: { providerId: 2, expiryDays: 30 },
      },
      {
        id: this.currentIds.activities++,
        userId: user1.id,
        type: "ai_analysis",
        title: "AI Health Analysis",
        description: "Sleep pattern analysis completed",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        metadata: { analysisType: "sleep" },
      },
    ];

    activities.forEach(activity => {
      this.activities.set(activity.id, activity);
    });

    // Sample blockchain logs
    const blockchainLogs: BlockchainLog[] = [
      {
        id: this.currentIds.blockchainLogs++,
        userId: user1.id,
        operation: "STORE_RECORD",
        transactionHash: "0x72F934B2a7c8D5e6F3g4H5i6J7k8L9m",
        status: "completed",
        createdAt: new Date(2023, 6, 16),
        details: "Stored medical record: Complete Blood Count (CBC)",
      },
      {
        id: this.currentIds.blockchainLogs++,
        userId: user1.id,
        operation: "STORE_RECORD",
        transactionHash: "0x58A12FD7b8C9d0E1f2G3h4I5j6K7l8",
        status: "completed",
        createdAt: new Date(2023, 5, 23),
        details: "Stored medical record: Chest X-Ray",
      },
      {
        id: this.currentIds.blockchainLogs++,
        userId: user1.id,
        operation: "STORE_RECORD",
        transactionHash: "0x31C79AF4c5D6e7F8g9H0i1J2k3L4m5",
        status: "completed",
        createdAt: new Date(2023, 5, 15),
        details: "Stored medical record: Amoxicillin 500mg",
      },
      {
        id: this.currentIds.blockchainLogs++,
        userId: user1.id,
        operation: "STORE_CONSENT",
        transactionHash: "0xD9eG7e43F8gF4c4d7bE6h1j2K6M8N9P",
        status: "completed",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        details: "Stored consent for provider ID 1",
      },
      {
        id: this.currentIds.blockchainLogs++,
        userId: user1.id,
        operation: "CREATE_WALLET",
        transactionHash: "0xABC123DEF456GHI789JKL0MNOP",
        status: "completed",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        details: "Created new Polkadot wallet address",
      },
    ];

    blockchainLogs.forEach(log => {
      this.blockchainLogs.set(log.id, log);
    });

    // Sample AI consultations
    const aiConsultation: AiConsultation = {
      id: this.currentIds.aiConsultations++,
      userId: user1.id,
      title: "Headache & Fatigue",
      status: "active",
      createdAt: new Date(2023, 6, 19), // July 19, 2023
      updatedAt: new Date(),
    };
    this.aiConsultations.set(aiConsultation.id, aiConsultation);

    // Sample AI messages
    const aiMessages: AiMessage[] = [
      {
        id: this.currentIds.aiMessages++,
        consultationId: aiConsultation.id,
        content: "Hello! How can I help you with your health today?",
        sender: "ai",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
      {
        id: this.currentIds.aiMessages++,
        consultationId: aiConsultation.id,
        content: "I've been having headaches and feeling tired lately.",
        sender: "user",
        timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
      },
      {
        id: this.currentIds.aiMessages++,
        consultationId: aiConsultation.id,
        content: "I'm sorry to hear that. Let me ask you a few questions to better understand your symptoms:\n\n- How long have you been experiencing these headaches?\n- Are they occurring at specific times of day?\n- How would you describe your sleep patterns lately?\n- Have you noticed any changes in your diet or water intake?\n\nNote: This is preliminary information and not a medical diagnosis.",
        sender: "ai",
        timestamp: new Date(Date.now() - 24 * 60 * 1000), // 24 minutes ago
      },
      {
        id: this.currentIds.aiMessages++,
        consultationId: aiConsultation.id,
        content: "The headaches started about a week ago, usually in the afternoon. My sleep has been irregular because of work, and I might not be drinking enough water.",
        sender: "user",
        timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
      },
    ];

    aiMessages.forEach(message => {
      this.aiMessages.set(message.id, message);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    // Make sure we have walletId defined
    const walletId = insertUser.walletId || "temp-wallet-id";
    
    const user: User = { 
      ...insertUser, 
      id,
      walletId, // Ensure walletId is always defined
      createdAt: new Date(),
      profileImage: insertUser.profileImage || null,
      role: insertUser.role || "patient"
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Medical record methods
  async getMedicalRecords(userId: number): Promise<MedicalRecord[]> {
    return Array.from(this.medicalRecords.values()).filter(
      (record) => record.userId === userId,
    );
  }

  async getMedicalRecord(id: number): Promise<MedicalRecord | undefined> {
    return this.medicalRecords.get(id);
  }

  async createMedicalRecord(insertRecord: InsertMedicalRecord): Promise<MedicalRecord> {
    const id = this.currentIds.medicalRecords++;
    const record: MedicalRecord = { 
      ...insertRecord, 
      id,
      date: insertRecord.date || new Date(),
    };
    this.medicalRecords.set(id, record);
    return record;
  }

  async updateMedicalRecord(id: number, data: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const record = await this.getMedicalRecord(id);
    if (!record) {
      throw new Error("Medical record not found");
    }

    const updatedRecord = { ...record, ...data };
    this.medicalRecords.set(id, updatedRecord);
    return updatedRecord;
  }

  async deleteMedicalRecord(id: number): Promise<boolean> {
    return this.medicalRecords.delete(id);
  }

  // Provider methods
  async getProviders(): Promise<Provider[]> {
    return Array.from(this.providers.values());
  }

  async getProvider(id: number): Promise<Provider | undefined> {
    return this.providers.get(id);
  }

  async createProvider(insertProvider: InsertProvider): Promise<Provider> {
    const id = this.currentIds.providers++;
    const provider: Provider = { ...insertProvider, id };
    this.providers.set(id, provider);
    return provider;
  }

  // Consent methods
  async getConsent(id: number): Promise<Consent | undefined> {
    return this.consents.get(id);
  }
  
  async getUserConsents(userId: number): Promise<DataAccessProvider[]> {
    const userConsents = Array.from(this.consents.values()).filter(
      (consent) => consent.userId === userId,
    );

    // Map consents to providers with additional information
    return Promise.all(
      userConsents.map(async (consent) => {
        const provider = await this.getProvider(consent.providerId);
        if (!provider) {
          throw new Error("Provider not found");
        }

        const now = new Date();
        const expiry = consent.expiryDate || now;
        const daysLeft = consent.expiryDate
          ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          : undefined;

        return {
          ...provider,
          status: consent.status,
          daysLeft: daysLeft && daysLeft > 0 ? daysLeft : undefined,
          accessTo: consent.dataType.split(","),
          active: consent.active,
          blockchainHash: consent.blockchainHash,
          blockchainTimestamp: consent.blockchainTimestamp
        };
      }),
    );
  }

  async createConsent(insertConsent: InsertConsent): Promise<Consent> {
    const id = this.currentIds.consents++;
    const consent: Consent = { 
      ...insertConsent, 
      id,
      createdAt: new Date(),
    };
    this.consents.set(id, consent);
    return consent;
  }

  async updateConsent(id: number, data: Partial<Consent>): Promise<Consent> {
    const consent = this.consents.get(id);
    if (!consent) {
      throw new Error("Consent not found");
    }

    const updatedConsent = { ...consent, ...data };
    this.consents.set(id, updatedConsent);
    return updatedConsent;
  }

  async checkConsent(recordId: number, userId: number): Promise<boolean> {
    const record = await this.getMedicalRecord(recordId);
    if (!record) {
      return false;
    }

    // Check if there's an active consent for the record owner and the requesting user
    const consents = Array.from(this.consents.values()).filter(
      (consent) =>
        consent.userId === record.userId &&
        consent.active &&
        consent.status === "approved" &&
        (!consent.expiryDate || consent.expiryDate > new Date()),
    );

    return consents.length > 0;
  }

  // AI consultation methods
  async getAiConsultations(userId: number): Promise<AiConsultation[]> {
    return Array.from(this.aiConsultations.values())
      .filter((consultation) => consultation.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getAiConsultation(id: number): Promise<AiConsultation | undefined> {
    return this.aiConsultations.get(id);
  }

  async createAiConsultation(insertConsultation: InsertAiConsultation): Promise<AiConsultation> {
    const id = this.currentIds.aiConsultations++;
    const now = new Date();
    const consultation: AiConsultation = { 
      ...insertConsultation, 
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.aiConsultations.set(id, consultation);
    return consultation;
  }

  async updateAiConsultation(id: number, data: Partial<AiConsultation>): Promise<AiConsultation> {
    const consultation = await this.getAiConsultation(id);
    if (!consultation) {
      throw new Error("AI consultation not found");
    }

    const updatedConsultation = { 
      ...consultation, 
      ...data,
      updatedAt: new Date(),
    };
    this.aiConsultations.set(id, updatedConsultation);
    return updatedConsultation;
  }

  // AI message methods
  async getAiMessages(consultationId: number): Promise<AiMessage[]> {
    return Array.from(this.aiMessages.values())
      .filter((message) => message.consultationId === consultationId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createAiMessage(insertMessage: InsertAiMessage): Promise<AiMessage> {
    const id = this.currentIds.aiMessages++;
    const message: AiMessage = { 
      ...insertMessage, 
      id,
      timestamp: new Date(),
    };
    this.aiMessages.set(id, message);

    // Update the consultation's updatedAt timestamp
    const consultation = await this.getAiConsultation(insertMessage.consultationId);
    if (consultation) {
      await this.updateAiConsultation(consultation.id, { updatedAt: new Date() });
    }

    return message;
  }

  // Blockchain log methods
  async getBlockchainLogs(userId: number): Promise<BlockchainLog[]> {
    return Array.from(this.blockchainLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return dateB - dateA; // Sort by most recent first
      });
  }

  async createBlockchainLog(insertLog: InsertBlockchainLog): Promise<BlockchainLog> {
    const id = this.currentIds.blockchainLogs++;
    const log: BlockchainLog = { 
      ...insertLog, 
      id,
      createdAt: new Date(),
    };
    this.blockchainLogs.set(id, log);
    return log;
  }

  // Appointment methods
  async getAppointments(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter((appointment) => appointment.userId === userId)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentIds.appointments++;
    const appointment: Appointment = { ...insertAppointment, id };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment> {
    const appointment = this.appointments.get(id);
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    const updatedAppointment = { ...appointment, ...data };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  // Activity methods
  async getActivities(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter((activity) => activity.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentIds.activities++;
    const activity: Activity = { 
      ...insertActivity, 
      id,
      timestamp: new Date(),
    };
    this.activities.set(id, activity);
    return activity;
  }

  // Health profile methods
  async getHealthProfile(userId: number): Promise<HealthProfile | undefined> {
    return Array.from(this.healthProfiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }

  async createHealthProfile(insertProfile: InsertHealthProfile): Promise<HealthProfile> {
    const id = this.currentIds.healthProfiles++;
    const profile: HealthProfile = { ...insertProfile, id };
    this.healthProfiles.set(id, profile);
    return profile;
  }

  async updateHealthProfile(userId: number, data: Partial<HealthProfile>): Promise<HealthProfile> {
    const profile = await this.getHealthProfile(userId);
    if (!profile) {
      throw new Error("Health profile not found");
    }

    const updatedProfile = { ...profile, ...data };
    this.healthProfiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }
}

export const storage = new MemStorage();
