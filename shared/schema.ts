import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  walletId: text("wallet_id").notNull(),
  profileImage: text("profile_image"),
  role: text("role").default("patient"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Make a base insert schema
const baseInsertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  walletId: true,
  profileImage: true,
  role: true,
});

// Create a modified version where walletId is optional
export const insertUserSchema = baseInsertUserSchema.extend({
  walletId: z.string().optional(),
});

// Medical record schema
export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // lab, imaging, prescription, report
  title: text("title").notNull(),
  description: text("description"),
  provider: text("provider"),
  date: timestamp("date").defaultNow(),
  blockchainHash: text("blockchain_hash"),
  blockchainTimestamp: timestamp("blockchain_timestamp"),
  verified: boolean("verified").default(false),
  data: jsonb("data"),
});

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).pick({
  userId: true,
  type: true,
  title: true,
  description: true,
  provider: true,
  date: true,
  blockchainHash: true,
  blockchainTimestamp: true,
  verified: true,
  data: true,
});

// Healthcare provider schema
export const providers = pgTable("providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // hospital, doctor, lab, clinic
  address: text("address"),
  contact: text("contact"),
  blockchainId: text("blockchain_id"),
});

export const insertProviderSchema = createInsertSchema(providers).pick({
  name: true,
  type: true,
  address: true,
  contact: true,
  blockchainId: true,
});

// Data access consent schema
export const consents = pgTable("consents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  providerId: integer("provider_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, expired
  dataType: text("data_type").notNull(), // medical_history, lab_results, prescriptions, etc.
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
  active: boolean("active").default(false),
  blockchainHash: text("blockchain_hash"),
  blockchainTimestamp: timestamp("blockchain_timestamp"),
});

export const insertConsentSchema = createInsertSchema(consents).pick({
  userId: true,
  providerId: true,
  status: true,
  dataType: true,
  expiryDate: true,
  active: true,
  blockchainHash: true,
  blockchainTimestamp: true,
});

// AI conversation schema
export const aiConsultations = pgTable("ai_consultations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  status: text("status").default("active"), // active, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAiConsultationSchema = createInsertSchema(aiConsultations).pick({
  userId: true,
  title: true,
  status: true,
});

// Messages within a consultation
export const aiMessages = pgTable("ai_messages", {
  id: serial("id").primaryKey(),
  consultationId: integer("consultation_id").notNull(),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // user, ai
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertAiMessageSchema = createInsertSchema(aiMessages).pick({
  consultationId: true,
  content: true,
  sender: true,
});

// Blockchain verification logs
export const blockchainLogs = pgTable("blockchain_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  operation: text("operation").notNull(), // STORE_RECORD, VERIFY_RECORD, CREATE_WALLET, STORE_CONSENT, etc
  transactionHash: text("transaction_hash").notNull(),
  details: text("details"),
  status: text("status").notNull(), // completed, pending, failed
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBlockchainLogSchema = createInsertSchema(blockchainLogs).pick({
  userId: true,
  operation: true,
  transactionHash: true,
  details: true,
  status: true,
});

// Appointments
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  providerId: integer("provider_id"),
  doctorName: text("doctor_name"),
  type: text("type").notNull(), // checkup, consultation, followup
  date: timestamp("date").notNull(),
  location: text("location"),
  notes: text("notes"),
  status: text("status").default("scheduled"), // scheduled, completed, cancelled
});

export const insertAppointmentSchema = createInsertSchema(appointments).pick({
  userId: true,
  providerId: true,
  doctorName: true,
  type: true,
  date: true,
  location: true,
  notes: true,
  status: true,
});

// Activities/Events
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // record_upload, access_granted, ai_analysis
  title: text("title").notNull(),
  description: text("description"),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata"),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  type: true,
  title: true,
  description: true,
  metadata: true,
});

// Health profile
export const healthProfiles = pgTable("health_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  bloodType: text("blood_type"),
  height: text("height"),
  weight: text("weight"),
  allergies: text("allergies"),
  emergencyContact: text("emergency_contact"),
  patientId: text("patient_id").notNull(),
  age: integer("age"),
  gender: text("gender"),
});

export const insertHealthProfileSchema = createInsertSchema(healthProfiles).pick({
  userId: true,
  bloodType: true,
  height: true,
  weight: true,
  allergies: true,
  emergencyContact: true,
  patientId: true,
  age: true,
  gender: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;

export type Provider = typeof providers.$inferSelect;
export type InsertProvider = z.infer<typeof insertProviderSchema>;

export type Consent = typeof consents.$inferSelect;
export type InsertConsent = z.infer<typeof insertConsentSchema>;

export type AiConsultation = typeof aiConsultations.$inferSelect;
export type InsertAiConsultation = z.infer<typeof insertAiConsultationSchema>;

export type AiMessage = typeof aiMessages.$inferSelect;
export type InsertAiMessage = z.infer<typeof insertAiMessageSchema>;

export type BlockchainLog = typeof blockchainLogs.$inferSelect;
export type InsertBlockchainLog = z.infer<typeof insertBlockchainLogSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type HealthProfile = typeof healthProfiles.$inferSelect;
export type InsertHealthProfile = z.infer<typeof insertHealthProfileSchema>;

// Extended/composite types for specific feature needs

export interface DataAccessProvider extends Provider {
  status: string;
  daysLeft?: number;
  accessTo: string[];
  active: boolean;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}
