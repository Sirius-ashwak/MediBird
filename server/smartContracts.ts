/**
 * This module provides smart contract implementations for the MediBird platform.
 * It uses Polkadot's substrate framework to create and interact with smart contracts
 * that manage medical records, consent, and data access.
 */

import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { u8aToHex, stringToU8a } from '@polkadot/util';
import { createHash } from 'crypto';

// Smart Contract Data Structures
interface MedicalRecordContract {
  id: string;
  ownerId: number;
  recordType: string;
  recordTitle: string;
  dataHash: string;
  timestamp: string;
  accessControl: {
    ownerAddress: string;
    allowedProviders: number[];
    isPublic: boolean;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

interface ConsentContract {
  id: string;
  patientId: number;
  providerId: number;
  dataTypes: string[];
  accessPeriod: {
    startDate: string;
    endDate: string;
  };
  status: 'granted' | 'revoked' | 'expired';
  conditions: string[];
  revocable: boolean;
  timestamp: string;
}

interface HealthDataAccessLog {
  accessId: string;
  recordId: string;
  accessorId: number;
  accessTimestamp: string;
  accessType: 'read' | 'write' | 'update' | 'delete';
  authorized: boolean;
}

export class SmartContractService {
  private medicalRecordContracts: Map<string, MedicalRecordContract>;
  private consentContracts: Map<string, ConsentContract>;
  private accessLogs: Map<string, HealthDataAccessLog[]>;
  
  constructor() {
    this.medicalRecordContracts = new Map();
    this.consentContracts = new Map();
    this.accessLogs = new Map();
  }

  /**
   * Creates a new medical record smart contract
   */
  async createMedicalRecordContract(
    api: ApiPromise | null,
    keyring: Keyring | null,
    ownerId: number,
    recordType: string,
    recordTitle: string,
    dataHash: string,
    ownerAddress: string
  ): Promise<string> {
    try {
      // In a real implementation, we would deploy a substrate smart contract
      // For this demo, we simulate it with an in-memory representation

      // Generate a unique contract ID
      const contractId = this.generateContractId('MR', ownerId, recordType);
      
      // Create the contract object
      const contract: MedicalRecordContract = {
        id: contractId,
        ownerId,
        recordType,
        recordTitle,
        dataHash,
        timestamp: new Date().toISOString(),
        accessControl: {
          ownerAddress,
          allowedProviders: [],
          isPublic: false
        },
        verificationStatus: 'pending'
      };
      
      // Store the contract
      this.medicalRecordContracts.set(contractId, contract);
      
      // In a real implementation, we would trigger a blockchain transaction here
      console.log(`Created medical record smart contract: ${contractId}`);
      
      return contractId;
    } catch (error) {
      console.error('Error creating medical record smart contract:', error);
      throw error;
    }
  }

  /**
   * Creates a new consent smart contract
   */
  async createConsentContract(
    api: ApiPromise | null,
    keyring: Keyring | null,
    patientId: number,
    providerId: number,
    dataTypes: string[],
    durationDays: number
  ): Promise<string> {
    try {
      // Generate a unique contract ID
      const contractId = this.generateContractId('CS', patientId, providerId.toString());
      
      // Calculate access period
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + durationDays);
      
      // Create the contract object
      const contract: ConsentContract = {
        id: contractId,
        patientId,
        providerId,
        dataTypes,
        accessPeriod: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        },
        status: 'granted',
        conditions: ['Must be used for treatment purposes only'],
        revocable: true,
        timestamp: startDate.toISOString()
      };
      
      // Store the contract
      this.consentContracts.set(contractId, contract);
      
      console.log(`Created consent smart contract: ${contractId}`);
      
      return contractId;
    } catch (error) {
      console.error('Error creating consent smart contract:', error);
      throw error;
    }
  }

  /**
   * Revoke a consent contract
   */
  async revokeConsent(contractId: string, patientId: number): Promise<boolean> {
    const contract = this.consentContracts.get(contractId);
    
    if (!contract) {
      throw new Error(`Consent contract ${contractId} not found`);
    }
    
    if (contract.patientId !== patientId) {
      throw new Error('Not authorized to revoke this consent');
    }
    
    if (!contract.revocable) {
      throw new Error('This consent contract is not revocable');
    }
    
    // Update the contract
    contract.status = 'revoked';
    this.consentContracts.set(contractId, contract);
    
    console.log(`Revoked consent contract: ${contractId}`);
    
    return true;
  }

  /**
   * Verify access to a medical record using smart contracts
   */
  async verifyAccess(
    recordContractId: string,
    accessorId: number,
    accessType: 'read' | 'write' | 'update' | 'delete'
  ): Promise<boolean> {
    const recordContract = this.medicalRecordContracts.get(recordContractId);
    
    if (!recordContract) {
      throw new Error(`Medical record contract ${recordContractId} not found`);
    }
    
    // Case 1: Owner always has access
    if (recordContract.ownerId === accessorId) {
      this.logAccess(recordContractId, accessorId, accessType, true);
      return true;
    }
    
    // Case 2: Check if access is allowed through consent contracts
    let hasConsent = false;
    
    // Convert Map entries to array and then iterate
    Array.from(this.consentContracts.entries()).forEach(([contractId, consent]) => {
      if (
        consent.patientId === recordContract.ownerId &&
        consent.providerId === accessorId &&
        consent.status === 'granted'
      ) {
        // Check if consent is still valid (not expired)
        const now = new Date();
        const endDate = new Date(consent.accessPeriod.endDate);
        
        if (now <= endDate) {
          // Check if the data type is allowed
          if (consent.dataTypes.includes(recordContract.recordType) || 
              consent.dataTypes.includes('all')) {
            hasConsent = true;
          }
        }
      }
    });
    
    this.logAccess(recordContractId, accessorId, accessType, hasConsent);
    return hasConsent;
  }

  /**
   * Log access to a medical record
   */
  private logAccess(
    recordId: string,
    accessorId: number,
    accessType: 'read' | 'write' | 'update' | 'delete',
    authorized: boolean
  ): void {
    const accessLog: HealthDataAccessLog = {
      accessId: this.generateRandomId(),
      recordId,
      accessorId,
      accessTimestamp: new Date().toISOString(),
      accessType,
      authorized
    };
    
    const logs = this.accessLogs.get(recordId) || [];
    logs.push(accessLog);
    this.accessLogs.set(recordId, logs);
  }

  /**
   * Get access logs for a medical record
   */
  getAccessLogs(recordId: string, ownerId: number): HealthDataAccessLog[] {
    const recordContract = this.medicalRecordContracts.get(recordId);
    
    if (!recordContract) {
      throw new Error(`Medical record contract ${recordId} not found`);
    }
    
    // Only the owner can view access logs
    if (recordContract.ownerId !== ownerId) {
      throw new Error('Not authorized to view access logs for this record');
    }
    
    return this.accessLogs.get(recordId) || [];
  }

  /**
   * Verify the integrity of a medical record
   */
  async verifyRecordIntegrity(
    contractId: string,
    recordData: any
  ): Promise<boolean> {
    const recordContract = this.medicalRecordContracts.get(contractId);
    
    if (!recordContract) {
      throw new Error(`Medical record contract ${contractId} not found`);
    }
    
    // Calculate hash of the provided data
    const dataString = JSON.stringify(recordData);
    const calculatedHash = this.generateDataHash(dataString);
    
    // Compare with stored hash
    const isVerified = calculatedHash === recordContract.dataHash;
    
    // Update verification status
    recordContract.verificationStatus = isVerified ? 'verified' : 'rejected';
    this.medicalRecordContracts.set(contractId, recordContract);
    
    return isVerified;
  }

  /**
   * Grant access to a provider for a specific medical record
   */
  grantAccessToRecord(
    recordContractId: string,
    ownerId: number,
    providerId: number
  ): boolean {
    const recordContract = this.medicalRecordContracts.get(recordContractId);
    
    if (!recordContract) {
      throw new Error(`Medical record contract ${recordContractId} not found`);
    }
    
    // Only the owner can grant access
    if (recordContract.ownerId !== ownerId) {
      throw new Error('Not authorized to grant access to this record');
    }
    
    // Add provider to allowed list if not already present
    if (!recordContract.accessControl.allowedProviders.includes(providerId)) {
      recordContract.accessControl.allowedProviders.push(providerId);
      this.medicalRecordContracts.set(recordContractId, recordContract);
    }
    
    return true;
  }

  /**
   * Generate a unique contract ID
   */
  private generateContractId(prefix: string, userId: number, contextData: string): string {
    const timestamp = Date.now().toString();
    const data = `${prefix}-${userId}-${contextData}-${timestamp}`;
    return this.generateDataHash(data).substring(0, 16);
  }

  /**
   * Generate a random ID for access logs
   */
  private generateRandomId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Generate a hash for data integrity
   */
  private generateDataHash(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }
}

export const smartContracts = new SmartContractService();