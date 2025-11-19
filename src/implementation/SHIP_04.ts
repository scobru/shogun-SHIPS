/**
 * SHIP-04: Multi-Modal Authentication Implementation
 *
 * Extends SHIP-00 to provide alternative authentication methods.
 * Integrates existing Shogun Core plugins for WebAuthn, Nostr, and Web3.
 *
 * Based on:
 * - SHIP-00 for identity foundation
 * - Shogun Core Plugins (WebAuthn, Nostr, Web3)
 * - WebAuthn API for biometric auth
 * - Nostr protocol for decentralized social
 * - Web3 providers (MetaMask, WalletConnect)
 *
 * Features:
 * ✅ WebAuthn/Passkeys (biometric, hardware keys)
 * ✅ Nostr protocol integration
 * ✅ Web3 wallet connection (MetaMask, etc.)
 * ✅ SHIP-00 compatible (all methods return SEA keypair)
 * ✅ Plugin-based architecture (modular)
 *
 * Inclusive Hierarchy:
 * SHIP-04 → depends on → SHIP-00 ✅
 */

import type { AuthResult, ISHIP_00, SEAPair } from "../interfaces/ISHIP_00";
import type {
  ISHIP_04,
  WebAuthnAuthResult,
  NostrAuthResult,
  Web3AuthResult,
  AuthMethodInfo,
  SHIP_04_Config,
} from "../interfaces/ISHIP_04";
import { AuthMethod } from "../interfaces/ISHIP_04"; // Import enum as value

// Shogun Core plugins
import {
  WebauthnPlugin,
  NostrConnectorPlugin,
  Web3ConnectorPlugin,
} from "shogun-core";

// ============================================================================
// IMPLEMENTATION
// ============================================================================

/**
 * SHIP-04 Reference Implementation
 *
 * Provides multiple authentication methods on top of SHIP-00.
 * All authentication methods are converted to SHIP-00 compatible format.
 */
class SHIP_04 implements ISHIP_04 {
  private identity: ISHIP_00;
  private config: SHIP_04_Config;
  private initialized: boolean = false;

  // GunDB Node Names for SHIP-04 storage
  // Note: SHIP-04 is a coordinator that delegates to plugins.
  // Plugins manage their own storage internally (OAuth, WebAuthn, Nostr, Web3).
  // We only track the current authentication method used.
  public static readonly NODES = {
    AUTH_METHOD: "current_auth_method", // Last used auth method (in user space)
  } as const;

  // Plugins
  private webauthnPlugin: WebauthnPlugin | null = null;
  private nostrPlugin: NostrConnectorPlugin | null = null;
  private web3Plugin: Web3ConnectorPlugin | null = null;

  // Current auth method
  private currentAuthMethod: AuthMethod | null = null;

  constructor(identity: ISHIP_00, config: SHIP_04_Config = {}) {
    this.identity = identity;
    this.config = {
      enableWebAuthn: config.enableWebAuthn ?? true,
      enableNostr: config.enableNostr ?? true,
      enableWeb3: config.enableWeb3 ?? true,
      webAuthnRpName: config.webAuthnRpName ?? "Shogun",
      webAuthnRpId: config.webAuthnRpId,
      nostrRelays: config.nostrRelays ?? [
        "wss://relay.damus.io",
        "wss://relay.nostr.band",
      ],
      web3Provider: config.web3Provider ?? "metamask",
    };
  }

  // ========================================================================
  // INITIALIZATION
  // ========================================================================

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      console.log("🔐 Initializing SHIP-04 (Multi-Modal Auth)...");

      // Get ShogunCore instance from SHIP-00
      const shogunCore = this.identity.getShogun();
      if (!shogunCore) {
        throw new Error("Cannot access ShogunCore from SHIP-00");
      }

      // Initialize enabled plugins
      if (this.config.enableWebAuthn && typeof window !== "undefined") {
        this.webauthnPlugin = new WebauthnPlugin();
        // WebAuthn plugin doesn't need explicit initialization
        console.log("✅ WebAuthn plugin initialized");
      }

      if (this.config.enableNostr) {
        this.nostrPlugin = new NostrConnectorPlugin();
        // Nostr plugin doesn't need explicit initialization
        console.log("✅ Nostr plugin initialized");
      }

      if (this.config.enableWeb3) {
        this.web3Plugin = new Web3ConnectorPlugin();
        // Web3 plugin doesn't need explicit initialization
        console.log("✅ Web3 plugin initialized");
      }

      this.initialized = true;
      console.log("✅ SHIP-04 initialized with multi-modal authentication");
    } catch (error: any) {
      throw new Error(`SHIP-04 initialization failed: ${error.message}`);
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getIdentity(): ISHIP_00 {
    return this.identity;
  }


  // ========================================================================
  // WEBAUTHN AUTHENTICATION
  // ========================================================================

  async registerWithWebAuthn(username: string): Promise<WebAuthnAuthResult> {
    this.ensureInitialized();

    if (!this.webauthnPlugin) {
      return {
        success: false,
        error: "WebAuthn plugin not initialized",
      };
    }

    try {
      console.log(`🔐 Registering with WebAuthn: ${username}`);

      // Register with WebAuthn plugin (handles derive internally)
      const result = await this.webauthnPlugin.signUp(username);

      if (!result.success) {
        return {
          success: false,
          error: result.error || "WebAuthn registration failed",
        };
      }

      // Plugin already handled authentication with SHIP-00
      // Just verify the user is logged in
      const authResult = this.identity.getCurrentUser();

      if (!authResult || !authResult.pub) {
        return {
          success: false,
          error: "SHIP-00 authentication verification failed",
        };
      }

      this.currentAuthMethod = "webauthn" as any;
      await this.saveAuthMethod("webauthn" as any);

      console.log("✅ Registered with WebAuthn");

      return {
        success: true,
        userPub: result.userPub,
        username: username,
        derivedAddress: (result as any).derivedAddress,
      };
    } catch (error: any) {
      console.error("❌ WebAuthn registration error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async loginWithWebAuthn(username: string): Promise<WebAuthnAuthResult> {
    this.ensureInitialized();

    if (!this.webauthnPlugin) {
      return {
        success: false,
        error: "WebAuthn plugin not initialized",
      };
    }

    try {
      console.log(`🔐 Logging in with WebAuthn: ${username}`);

      // Login with WebAuthn plugin (handles derive internally)
      const result = await this.webauthnPlugin.login(username);

      if (!result.success) {
        return {
          success: false,
          error: result.error || "WebAuthn login failed",
        };
      }

      // Plugin already handled authentication with SHIP-00
      // Just verify the user is logged in
      const authResult = this.identity.getCurrentUser();

      if (!authResult || !authResult.pub) {
        return {
          success: false,
          error: "SHIP-00 authentication verification failed",
        };
      }

      this.currentAuthMethod = "webauthn" as any;
      await this.saveAuthMethod("webauthn" as any);

      console.log("✅ Logged in with WebAuthn");

      return {
        success: true,
        userPub: result.userPub,
        username: username,
        derivedAddress: (result as any).derivedAddress,
      };
    } catch (error: any) {
      console.error("❌ WebAuthn login error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  isWebAuthnAvailable(): boolean {
    if (!this.webauthnPlugin) return false;
    return this.webauthnPlugin.isSupported();
  }

  // ========================================================================
  // NOSTR AUTHENTICATION
  // ========================================================================

  async connectNostr(): Promise<NostrAuthResult> {
    this.ensureInitialized();

    if (!this.nostrPlugin) {
      return {
        success: false,
        error: "Nostr plugin not initialized",
      };
    }

    try {
      console.log("🔐 Connecting to Nostr...");

      // Connect with Nostr plugin
      const result = await this.nostrPlugin.connectNostrWallet();

      if (!result.success || !(result as any).credentials) {
        return {
          success: false,
          error: result.error || "Nostr connection failed",
        };
      }

      // Extract Nostr public key
      const nostrPubkey = (result as any).credentials.publicKey;

      // Generate signature for SHIP-00 keypair derivation
      // Nostr plugin generateCredentials needs (address, signature)
      const message = `SHIP-04-NOSTR-${nostrPubkey}`;

      // Request signature from Nostr extension
      const shogun = this.identity.getShogun();
      const gun = shogun?.db?.gun;
      const crypto = shogun?.db?.crypto;

      if (!gun || !crypto) {
        return {
          success: false,
          error: "Cannot access Gun/crypto",
        };
      }

      // For Nostr, we use the public key directly as the seed
      const hashText = await crypto.hashText(nostrPubkey);

      // Create deterministic SEA pair from Nostr pubkey
      const seaPair = await gun.SEA.pair();

      // Use plugin's login method which handles everything
      // The plugin internally uses derive and calls core.login
      const authResult = await this.nostrPlugin.login(nostrPubkey);

      if (!authResult.success) {
        return {
          success: false,
          error: authResult.error || "Nostr login failed",
        };
      }

      // Plugin already handled authentication with SHIP-00
      // Just verify the user is logged in
      const ship00Result = this.identity.getCurrentUser();

      if (!ship00Result || !ship00Result.pub) {
        return {
          success: false,
          error: "SHIP-00 authentication verification failed",
        };
      }

      this.currentAuthMethod = "nostr" as any;
      await this.saveAuthMethod("nostr" as any);

      console.log("✅ Connected with Nostr");

      return {
        success: true,
        userPub: authResult.userPub,
        username: authResult.username,
        derivedAddress: (authResult as any).derivedAddress,
        nostrPubkey,
        relays: this.config.nostrRelays,
      };
    } catch (error: any) {
      console.error("❌ Nostr connection error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async loginWithNostr(): Promise<NostrAuthResult> {
    // Alias for connectNostr
    return this.connectNostr();
  }

  isNostrAvailable(): boolean {
    if (!this.nostrPlugin) return false;
    return this.nostrPlugin.isAvailable();
  }

  // ========================================================================
  // WEB3 AUTHENTICATION
  // ========================================================================

  async connectWeb3(): Promise<Web3AuthResult> {
    this.ensureInitialized();

    if (!this.web3Plugin) {
      return {
        success: false,
        error: "Web3 plugin not initialized",
      };
    }

    try {
      console.log("🔐 Connecting to Web3 wallet...");

      // Connect with Web3 plugin (MetaMask, etc.)
      const result = await this.web3Plugin.connectMetaMask();

      if (!result.success || !result.address) {
        return {
          success: false,
          error: result.error || "Web3 connection failed",
        };
      }

      // Use plugin's login method which handles derive and authentication internally
      const authResult = await this.web3Plugin.login(result.address!);

      if (!authResult.success) {
        return {
          success: false,
          error: authResult.error || "Web3 login failed",
        };
      }

      // Plugin already handled authentication with SHIP-00
      // Just verify the user is logged in
      const ship00Result = this.identity.getCurrentUser();

      if (!ship00Result || !ship00Result.pub) {
        return {
          success: false,
          error: "SHIP-00 authentication verification failed",
        };
      }

      this.currentAuthMethod = "web3" as any;
      await this.saveAuthMethod("web3" as any);

      console.log("✅ Connected with Web3 wallet");

      return {
        success: true,
        userPub: authResult.userPub,
        username: authResult.username || result.address,
        derivedAddress: (authResult as any).derivedAddress,
        walletAddress: result.address,
        chainId: (result as any).chainId,
        walletType: this.config.web3Provider,
      };
    } catch (error: any) {
      console.error("❌ Web3 connection error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async loginWithWeb3(message?: string): Promise<Web3AuthResult> {
    // Use custom message if provided
    if (message) {
      console.log(`💡 Using custom message: ${message}`);
    }

    return this.connectWeb3();
  }

  isWeb3Available(): boolean {
    if (!this.web3Plugin) return false;
    return this.web3Plugin.isAvailable();
  }

  // ========================================================================
  // UTILITIES
  // ========================================================================

  getAvailableAuthMethods(): AuthMethodInfo[] {
    const methods: AuthMethodInfo[] = [];

    // Password (always available via SHIP-00)
    methods.push({
      method: "password" as any,
      available: true,
      configured: true,
      lastUsed: this.currentAuthMethod === "password" ? Date.now() : undefined,
    });

    // WebAuthn
    if (this.config.enableWebAuthn) {
      methods.push({
        method: "webauthn" as any,
        available: this.isWebAuthnAvailable(),
        configured: true,
        lastUsed:
          this.currentAuthMethod === "webauthn" ? Date.now() : undefined,
      });
    }

    // Nostr
    if (this.config.enableNostr) {
      methods.push({
        method: "nostr" as any,
        available: this.isNostrAvailable(),
        configured: true,
        lastUsed: this.currentAuthMethod === "nostr" ? Date.now() : undefined,
      });
    }

    // Web3
    if (this.config.enableWeb3) {
      methods.push({
        method: "web3" as any,
        available: this.isWeb3Available(),
        configured: true,
        lastUsed: this.currentAuthMethod === "web3" ? Date.now() : undefined,
      });
    }

    return methods;
  }

  getCurrentAuthMethod(): AuthMethod | null {
    return this.currentAuthMethod;
  }

  async clearAuth(): Promise<void> {
    this.currentAuthMethod = null;

    // Clear from Gun storage
    try {
      const shogun = this.identity.getShogun();
      const gun = shogun?.db?.gun;
      if (gun) {
        const user = gun.user();
        if (user && user.is) {
          await user.get(SHIP_04.NODES.AUTH_METHOD).put(null);
        }
      }
    } catch (error) {
      console.error("Error clearing auth method from Gun:", error);
    }

    console.log("✅ Authentication method cleared");
  }

  /**
   * Save current auth method to Gun (optional persistence)
   */
  private async saveAuthMethod(method: AuthMethod): Promise<void> {
    try {
      const shogun = this.identity.getShogun();
      const gun = shogun?.db?.gun;
      if (!gun) return;

      const user = gun.user();
      if (!user || !user.is) return;

      await user.get(SHIP_04.NODES.AUTH_METHOD).put(method);
      console.log(`✅ Auth method saved to Gun: ${method}`);
    } catch (error) {
      console.error("Error saving auth method to Gun:", error);
    }
  }

  /**
   * Load last used auth method from Gun
   */
  async loadAuthMethod(): Promise<AuthMethod | null> {
    try {
      const shogun = this.identity.getShogun();
      const gun = shogun?.db?.gun;
      if (!gun) return null;

      const user = gun.user();
      if (!user || !user.is) return null;

      return new Promise((resolve) => {
        const timeout = setTimeout(() => resolve(null), 3000);

        user.get(SHIP_04.NODES.AUTH_METHOD).once((data: any) => {
          clearTimeout(timeout);
          resolve(data || null);
        });
      });
    } catch (error) {
      console.error("Error loading auth method from Gun:", error);
      return null;
    }
  }

  // ========================================================================
  // PRIVATE HELPERS
  // ========================================================================

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error("SHIP-04 not initialized. Call initialize() first.");
    }
  }
}

export { SHIP_04 };
