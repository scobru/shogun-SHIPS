/**
 * SHIP-04: Multi-Modal Authentication Interface
 *
 * @title ISHIP_04 - Alternative Authentication Methods
 * @notice Interface for multi-modal authentication extending SHIP-00
 *
 * ## Abstract
 *
 * This standard extends SHIP-00 to provide multiple authentication methods:
 * - WebAuthn/Passkeys (biometric authentication)
 * - Nostr (decentralized social protocol)
 * - Web3 (MetaMask, WalletConnect, etc.)
 *
 * ## Dependencies
 *
 * - SHIP-00: Base identity foundation
 * - Shogun Core Plugins: WebAuthn, Nostr, Web3
 *
 * ## Inclusive Hierarchy
 *
 * SHIP-04 extends SHIP-00 (✅ allowed):
 * ```
 * SHIP-04 (Multi-Modal Auth)
 *    ↓ depends on
 * SHIP-00 (Identity Foundation)
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * const identity = new SHIP_00(config);
 * const multiAuth = new SHIP_04(identity);
 *
 * // Login with WebAuthn
 * await multiAuth.loginWithWebAuthn('alice');
 *
 * // Or Web3
 * await multiAuth.connectWeb3();
 *
 * // Result is SHIP-00 compatible!
 * const user = identity.getCurrentUser();
 * ```
 */

import type { ISHIP_00, SEAPair, AuthResult } from "./ISHIP_00";

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Available authentication methods
 * Exported as const enum to allow usage as both type and value
 */
export const enum AuthMethod {
  PASSWORD = "password", // Traditional (SHIP-00)
  WEBAUTHN = "webauthn", // Biometric/Passkey
  NOSTR = "nostr", // Nostr protocol
  WEB3 = "web3", // Web3 wallets
}

// Also export as string union type
export type AuthMethodType =
  | "password"
  | "webauthn"
  | "nostr"
  | "web3";

/**
 * WebAuthn authentication result
 */
export interface WebAuthnAuthResult extends AuthResult {
  credentialId?: string;
  authenticatorType?: string;
}

/**
 * Nostr authentication result
 */
export interface NostrAuthResult extends AuthResult {
  nostrPubkey?: string;
  relays?: string[];
}

/**
 * Web3 authentication result
 */
export interface Web3AuthResult extends AuthResult {
  walletAddress?: string;
  chainId?: number;
  walletType?: string; // metamask, walletconnect, etc.
}

/**
 * Authentication method info
 */
export interface AuthMethodInfo {
  method: AuthMethod;
  available: boolean;
  configured: boolean;
  lastUsed?: number;
}

/**
 * SHIP-04 Configuration
 */
export interface SHIP_04_Config {
  /** Enable WebAuthn authentication */
  enableWebAuthn?: boolean;
  /** WebAuthn RP name */
  webAuthnRpName?: string;
  /** WebAuthn RP ID */
  webAuthnRpId?: string;

  /** Enable Nostr authentication */
  enableNostr?: boolean;
  /** Nostr relays */
  nostrRelays?: string[];

  /** Enable Web3 authentication */
  enableWeb3?: boolean;
  /** Preferred Web3 provider */
  web3Provider?: "metamask" | "walletconnect" | "coinbase";
}

// ============================================================================
// MAIN INTERFACE
// ============================================================================

/**
 * @title ISHIP_04 - Multi-Modal Authentication
 * @notice Main interface for alternative authentication methods
 * @dev Extends SHIP-00 with OAuth, WebAuthn, Nostr, and Web3 auth
 */
export interface ISHIP_04 {
  // ========================================================================
  // INITIALIZATION
  // ========================================================================

  /**
   * @notice Initialize multi-modal auth system
   * @dev Initializes all enabled authentication plugins
   * @returns Promise that resolves when initialization is complete
   */
  initialize(): Promise<void>;

  /**
   * @notice Check if system is initialized
   * @returns True if initialized
   */
  isInitialized(): boolean;

  /**
   * @notice Get the underlying SHIP-00 identity provider
   * @returns SHIP-00 instance
   */
  getIdentity(): ISHIP_00;


  // ========================================================================
  // WEBAUTHN AUTHENTICATION
  // ========================================================================

  /**
   * @notice Register new user with WebAuthn
   * @param username Username for the account
   * @returns Promise resolving to WebAuthn auth result
   */
  registerWithWebAuthn(username: string): Promise<WebAuthnAuthResult>;

  /**
   * @notice Login with WebAuthn (biometric/passkey)
   * @param username Username to authenticate
   * @returns Promise resolving to WebAuthn auth result
   */
  loginWithWebAuthn(username: string): Promise<WebAuthnAuthResult>;

  /**
   * @notice Check if WebAuthn is supported
   * @returns True if WebAuthn is available
   */
  isWebAuthnAvailable(): boolean;

  // ========================================================================
  // NOSTR AUTHENTICATION
  // ========================================================================

  /**
   * @notice Connect and authenticate with Nostr
   * @returns Promise resolving to Nostr auth result
   */
  connectNostr(): Promise<NostrAuthResult>;

  /**
   * @notice Login with Nostr extension (nos2x, Alby, etc.)
   * @returns Promise resolving to Nostr auth result
   */
  loginWithNostr(): Promise<NostrAuthResult>;

  /**
   * @notice Check if Nostr is available
   * @returns True if Nostr extension detected
   */
  isNostrAvailable(): boolean;

  // ========================================================================
  // WEB3 AUTHENTICATION
  // ========================================================================

  /**
   * @notice Connect Web3 wallet (MetaMask, WalletConnect, etc.)
   * @returns Promise resolving to Web3 auth result
   */
  connectWeb3(): Promise<Web3AuthResult>;

  /**
   * @notice Login with Web3 wallet
   * @param message Optional message to sign
   * @returns Promise resolving to Web3 auth result
   */
  loginWithWeb3(message?: string): Promise<Web3AuthResult>;

  /**
   * @notice Check if Web3 is available
   * @returns True if Web3 provider detected
   */
  isWeb3Available(): boolean;

  // ========================================================================
  // UTILITIES
  // ========================================================================

  /**
   * @notice Get all available authentication methods
   * @returns Array of available auth methods with info
   */
  getAvailableAuthMethods(): AuthMethodInfo[];

  /**
   * @notice Get current authentication method
   * @returns Current auth method or null
   */
  getCurrentAuthMethod(): AuthMethod | null;

  /**
   * @notice Clear authentication data
   * @returns Promise that resolves when cleared
   */
  clearAuth(): Promise<void>;
}

// ============================================================================
// EVENTS
// ============================================================================

export type SHIP_04_Events = {
  webauthnRegistered: (result: WebAuthnAuthResult) => void;
  nostrConnected: (result: NostrAuthResult) => void;
  web3Connected: (result: Web3AuthResult) => void;
  authMethodChanged: (method: AuthMethod) => void;
  error: (error: Error) => void;
};
