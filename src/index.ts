/**
 * shogun-ship - SHIP Standards for Shogun Ecosystem
 *
 * This package provides reference implementations of the SHIP (Shogun Interface Proposals)
 * standards for decentralized applications.
 *
 * All SHIP implementations depend on shogun-core for foundational functionality.
 */

// ============================================================================
// SHIP-00: Identity & Authentication Foundation
// ============================================================================
export { SHIP_00 } from "./implementation/SHIP_00";
export type {
  ISHIP_00,
  SignupResult as SHIP_00_SignupResult,
  AuthResult as SHIP_00_AuthResult,
  OperationResult as SHIP_00_OperationResult,
  SEAPair,
  UserIdentity,
  UserData,
  PublicKeyData,
} from "./interfaces/ISHIP_00";

// ============================================================================
// SHIP-01: Decentralized Encrypted Messaging
// ============================================================================
export { SHIP_01 } from "./implementation/SHIP_01";
export type {
  ISHIP_01,
  SendMessageResult,
  DecryptedMessage,
  MessageHistoryEntry,
} from "./interfaces/ISHIP_01";

// ============================================================================
// SHIP-02: Ethereum HD Wallet & Transaction Sending
// ============================================================================
export { SHIP_02 } from "./implementation/SHIP_02";
export type {
  ISHIP_02,
  DerivationResult,
  WalletInfo,
  WalletPath,
  Transaction,
  SignedTransaction,
  AddressEntry,
  AddressBook,
  StealthAddressResult as SHIP_02_StealthAddressResult,
  SignatureResult,
  SHIP_02_Config,
} from "./interfaces/ISHIP_02";

// ============================================================================
// SHIP-03: Dual-Key Stealth Addresses (ERC-5564)
// ============================================================================
export { SHIP_03 } from "./implementation/SHIP_03";
export type {
  ISHIP_03,
  StealthKeys,
  StealthAddressResult as SHIP_03_StealthAddressResult,
  StealthMetadata,
  EphemeralKeyPair,
  AnnouncedStealth,
  OwnedStealthAddress,
  SHIP_03_Config,
} from "./interfaces/ISHIP_03";

// ============================================================================
// SHIP-04: Multi-Modal Authentication
// ============================================================================
export { SHIP_04 } from "./implementation/SHIP_04";
export type {
  ISHIP_04,
  AuthMethod,
  OAuthAuthResult,
  WebAuthnAuthResult,
  NostrAuthResult,
  Web3AuthResult,
  AuthMethodInfo,
  SHIP_04_Config,
} from "./interfaces/ISHIP_04";

// ============================================================================
// SHIP-05: Decentralized File Storage
// ============================================================================
export { SHIP_05 } from "./implementation/SHIP_05";
export type {
  ISHIP_05,
  UploadResult,
  FileMetadata,
  UploadOptions,
  DownloadOptions,
  EncryptionOptions,
  SHIP_05_Config,
} from "./interfaces/ISHIP_05";

// ============================================================================
// SHIP-06: Secure Vault
// ============================================================================
export { SHIP_06 } from "./implementation/SHIP_06";
export type {
  ISHIP_06,
  VaultRecord,
  EncryptedRecord,
  RecordMetadata,
  VaultResult,
  VaultStats,
  GetOptions,
  ListOptions,
  ImportOptions,
  ExportOptions,
  VaultConfig,
} from "./interfaces/ISHIP_06";

// ============================================================================
// Re-export commonly used types from shogun-core
// ============================================================================
export type { ShogunCoreConfig } from "shogun-core";

// ============================================================================
// Version info
// ============================================================================
export const SHIP_VERSION = "1.0.0";
export const SUPPORTED_SHIPS = [
  "SHIP-00",
  "SHIP-01",
  "SHIP-02",
  "SHIP-03",
  "SHIP-04",
  "SHIP-05",
  "SHIP-06",
] as const;
