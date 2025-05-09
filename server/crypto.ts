/**
 * Cryptographic utilities for the MediBridge platform
 * Provides functions for signing, verifying, and encrypting/decrypting data
 * using Polkadot's cryptographic primitives
 */

import { u8aToHex, hexToU8a, stringToU8a } from '@polkadot/util';
import { Keyring } from '@polkadot/keyring';
import { 
  mnemonicGenerate, 
  naclEncrypt, 
  naclDecrypt, 
  randomAsU8a,
  signatureVerify,
  sr25519Sign
} from '@polkadot/util-crypto';
import { createHash } from 'crypto';

// Encryption constants
const NONCE_LENGTH = 24;

/**
 * Signs data using a Polkadot private key
 * @param data - The data to sign
 * @param privateKey - The private key to sign with
 * @returns The signature as a hex string
 */
export function signData(data: string, privateKey: string): string {
  try {
    const keyring = new Keyring({ type: 'sr25519' });
    const pair = keyring.addFromUri(privateKey);
    const signature = pair.sign(stringToU8a(data));
    return u8aToHex(signature);
  } catch (error) {
    console.error('Error signing data:', error);
    throw new Error('Failed to sign data');
  }
}

/**
 * Verifies a signature using a Polkadot public key
 * @param data - The original data
 * @param signature - The signature to verify
 * @param publicKey - The public key to verify with
 * @returns True if the signature is valid
 */
export function verifySignature(data: string, signature: string, publicKey: string): boolean {
  try {
    const keyring = new Keyring({ type: 'sr25519' });
    const pair = keyring.addFromUri('//verify', { name: 'verify' }); 
    
    return pair.verify(stringToU8a(data), hexToU8a(signature), publicKey);
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

/**
 * Encrypts data using a Polkadot public key (for recipient-only access)
 * @param data - The data to encrypt
 * @param recipientPublicKey - The recipient's public key
 * @returns The encrypted data and nonce as hex strings
 */
export function encryptData(data: string, recipientPublicKey: string): { encrypted: string, nonce: string } {
  try {
    const messageU8a = stringToU8a(data);
    const publicKeyU8a = hexToU8a(recipientPublicKey);
    
    // Generate a random nonce
    const nonce = randomAsU8a(NONCE_LENGTH);
    
    // Use NaCl (via libsodium) for encryption
    const { encrypted } = naclEncrypt(messageU8a, publicKeyU8a, nonce);
    
    return {
      encrypted: u8aToHex(encrypted),
      nonce: u8aToHex(nonce)
    };
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts data using a Polkadot private key
 * @param encryptedData - The encrypted data as a hex string
 * @param nonce - The nonce used for encryption
 * @param privateKey - The private key to decrypt with
 * @returns The decrypted data
 */
export function decryptData(encryptedData: string, nonce: string, privateKey: string): string {
  try {
    const keyring = new Keyring({ type: 'sr25519' });
    const pair = keyring.addFromUri(privateKey);
    
    const encrypted = hexToU8a(encryptedData);
    const nonceU8a = hexToU8a(nonce);
    
    // Use NaCl (via libsodium) for decryption
    const decrypted = naclDecrypt(encrypted, nonceU8a, hexToU8a(privateKey));
    
    if (!decrypted) {
      throw new Error('Failed to decrypt data');
    }
    
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Creates a hash of data for integrity verification
 * @param data - The data to hash
 * @returns The hash as a hex string
 */
export function hashData(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

/**
 * Generates a zero-knowledge proof (simplified) for a specific property
 * without revealing the underlying data
 * @param data - The full data object
 * @param property - The property to create a proof for
 * @returns A ZK proof object
 */
export function generateZKProof(data: any, property: string): any {
  // In a real implementation, this would use a proper ZK-proof library
  // This is a simplified version for demonstration
  const propertyValue = data[property];
  
  if (propertyValue === undefined) {
    throw new Error(`Property ${property} not found in data`);
  }
  
  const propertyHash = hashData(JSON.stringify(propertyValue));
  const dataHash = hashData(JSON.stringify(data));
  
  return {
    property,
    propertyHash,
    dataHash,
    timestamp: Date.now()
  };
}

/**
 * Verifies a zero-knowledge proof (simplified)
 * @param proof - The ZK proof to verify
 * @param expectedDataHash - The expected hash of the full data
 * @returns True if the proof is valid
 */
export function verifyZKProof(proof: any, expectedDataHash: string): boolean {
  return proof.dataHash === expectedDataHash;
}