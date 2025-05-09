/**
 * Cryptographic utilities for the MediBird platform
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
 * Generates a zero-knowledge proof for a specific property
 * without revealing the underlying data
 * @param data - The full data object
 * @param property - The property to create a proof for
 * @returns A ZK proof object
 */
export function generateZKProof(data: any, property: string): any {
  // This implementation simulates a ZK-proof using cryptographic hashing and selective disclosure
  // In a real-world implementation, we would use a proper ZKP library like zk-SNARKs or Bulletproofs
  const propertyValue = data[property];
  
  if (propertyValue === undefined) {
    throw new Error(`Property ${property} not found in data`);
  }
  
  // Create a Merkle tree-like structure (simplified)
  const allProperties = Object.keys(data);
  const propertyHashes = allProperties.map(key => {
    return {
      key,
      hash: hashData(JSON.stringify(data[key]))
    };
  });
  
  // Generate a hash commitment for the entire data record
  const dataHash = hashData(JSON.stringify(data));
  
  // Generate a zero-knowledge range proof for numeric values (simulation)
  let rangeProof = null;
  if (typeof propertyValue === 'number') {
    // For example, proving that age > 18 without revealing the actual age
    // This would be a real ZK range proof in a full implementation
    const ranges = [
      { min: 0, max: 17, result: false },
      { min: 18, max: 200, result: true }
    ];
    
    // Find which range contains our value
    const matchingRange = ranges.find(range => 
      propertyValue >= range.min && propertyValue <= range.max
    );
    
    if (matchingRange) {
      rangeProof = {
        // Create a simulated proof that doesn't reveal the actual value
        rangeHash: hashData(`range:${matchingRange.min}-${matchingRange.max}`),
        result: matchingRange.result,
        commitment: hashData(`${dataHash}:range:${matchingRange.min}-${matchingRange.max}`)
      };
    }
  }
  
  // Create a Merkle path (simplified) to prove inclusion without revealing other properties
  const merklePath = propertyHashes
    .filter(item => item.key !== property)
    .map(item => item.hash);
  
  const propertyHash = hashData(JSON.stringify(propertyValue));
  
  // Simulation of a proper zkSNARK or Bulletproof
  const simulatedProof = hashData(`ZKP:${propertyHash}:${dataHash}:${Date.now()}`);
  
  return {
    property,
    propertyHash,
    dataHash,
    merklePath,
    rangeProof,
    zkProof: {
      proof: simulatedProof,
      publicInputs: [property, dataHash.substring(0, 8)],
      verificationKey: "sim_verification_key_" + hashData(`verify:${property}`).substring(0, 16)
    },
    timestamp: Date.now()
  };
}

/**
 * Verifies a zero-knowledge proof
 * @param proof - The ZK proof to verify
 * @param expectedDataHash - The expected hash of the full data
 * @returns True if the proof is valid
 */
export function verifyZKProof(proof: any, expectedDataHash: string): boolean {
  // In a real implementation, this would use a proper ZK verification algorithm
  
  // Verify the data hash matches
  if (proof.dataHash !== expectedDataHash) {
    return false;
  }
  
  // Verify the ZK proof cryptographically
  if (!proof.zkProof || !proof.zkProof.proof) {
    return false;
  }
  
  // Simulate verification of the proof
  // In a real ZKP system, this would run the verification algorithm
  const expectedVerifierOutput = hashData(`ZKP:${proof.propertyHash}:${expectedDataHash}:${proof.timestamp}`);
  
  // Check if our proof matches what we expect
  return proof.zkProof.proof === expectedVerifierOutput;
}