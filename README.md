# Shogun SHIP 🗡️

[![npm](https://img.shields.io/badge/npm-v1.0.0-blue)](https://www.npmjs.com/package/shogun-ship)
[![License](https://img.shields.io/badge/license-MIT-yellow)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)

> **SHIP = Shogun Interface Proposals** 🗡️  
> Open and implementable standards for the Shogun ecosystem

## 📋 Overview

**shogun-ship** provides reference implementations of the SHIP (Shogun Interface Proposals) standards - a collection of modular, composable protocols for decentralized applications.

This package is built on top of [shogun-core](https://github.com/scobru/shogun-core) and provides:

- 🔐 **SHIP-00**: Decentralized Identity & Authentication Foundation
- 💬 **SHIP-01**: P2P Encrypted Messaging  
- 💰 **SHIP-02**: Ethereum HD Wallet & Transaction Sending
- 🕶️ **SHIP-03**: Dual-Key Stealth Addresses (ERC-5564)
- 🔑 **SHIP-04**: Multi-Modal Authentication (OAuth/WebAuthn/Web3/Nostr)
- 📁 **SHIP-05**: Decentralized File Storage (IPFS)
- 🔒 **SHIP-06**: Secure Encrypted Vault

## 🏗️ Architecture

```
shogun-core (foundation)
    ↑
    │ depends on (npm)
    │
shogun-ship (standards)
```

**Clean Separation**:
- `shogun-core`: Core functionality (GunDB, authentication, plugins)
- `shogun-ship`: SHIP standards implementations
- **No circular dependencies**: shogun-core does NOT import from shogun-ship

## 📦 Installation

```bash
npm install shogun-ship shogun-core
# or
yarn add shogun-ship shogun-core
```

**Note**: `shogun-core` is a peer dependency and must be installed separately.

## 🚀 Quick Start

### SHIP-00: Identity & Authentication

```typescript
import { SHIP_00 } from "shogun-ship";
import type { ShogunCoreConfig } from "shogun-core";

const config: ShogunCoreConfig = {
  peers: ["https://gun-manhattan.herokuapp.com/gun"],
  scope: "my-app",
};

const identity = new SHIP_00(config);
await identity.initialize();

// Sign up
const signupResult = await identity.signup("alice", "password123");
console.log("User created:", signupResult.username);
console.log("Public key:", signupResult.userPub);

// Login
const loginResult = await identity.login("alice", "password123");
console.log("Logged in:", loginResult.success);
```

### SHIP-01: Encrypted Messaging

```typescript
import { SHIP_00, SHIP_01 } from "shogun-ship";

const identity = new SHIP_00(config);
await identity.initialize();
await identity.login("alice", "password123");

const messenger = new SHIP_01(identity);
await messenger.initialize();

// Send encrypted message
await messenger.sendMessage("bob_public_key", "Hello Bob!", {
  encrypt: true,
});

// Receive messages
messenger.onMessage((message) => {
  console.log(`From: ${message.from}`);
  console.log(`Message: ${message.text}`);
});
```

### SHIP-02: HD Wallet

```typescript
import { SHIP_00, SHIP_02 } from "shogun-ship";

const identity = new SHIP_00(config);
await identity.initialize();
await identity.login("alice", "password123");

const wallet = new SHIP_02(identity);
await wallet.initialize();

// Derive accounts
const account0 = await wallet.deriveAccount(0);
console.log("Address:", account0.address);
console.log("Private key:", account0.privateKey);

// Send transaction
const tx = await wallet.sendTransaction({
  to: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  value: "0.1", // ETH
  rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY",
});
console.log("TX Hash:", tx.hash);
```

### SHIP-03: Stealth Addresses

```typescript
import { SHIP_00, SHIP_03 } from "shogun-ship";

const identity = new SHIP_00(config);
await identity.initialize();
await identity.login("alice", "password123");

const stealth = new SHIP_03(identity);
await stealth.initialize();

// Generate stealth keys
const keys = await stealth.generateStealthKeys();
console.log("Spending key:", keys.spendingPublicKey);
console.log("Viewing key:", keys.viewingPublicKey);

// Create stealth address
const stealthAddr = await stealth.generateStealthAddress(
  keys.spendingPublicKey,
  keys.viewingPublicKey
);
console.log("Stealth address:", stealthAddr.stealthAddress);
```

### SHIP-04: Multi-Modal Auth

```typescript
import { SHIP_00, SHIP_04 } from "shogun-ship";

const identity = new SHIP_00(config);
await identity.initialize();

const multiAuth = new SHIP_04(identity, {
  oauth: {
    providers: {
      google: {
        clientId: "YOUR_CLIENT_ID",
        clientSecret: "YOUR_SECRET",
        redirectUri: "http://localhost:3000/callback",
      },
    },
  },
  webauthn: {
    rpName: "My App",
    rpId: "localhost",
  },
});
await multiAuth.initialize();

// Login with OAuth
await multiAuth.loginWithOAuth("google");

// Or WebAuthn
await multiAuth.registerWithWebAuthn("alice");
await multiAuth.loginWithWebAuthn("alice");

// Or Web3
await multiAuth.connectWeb3();

// Or Nostr
await multiAuth.connectNostr();
```

### SHIP-05: File Storage

```typescript
import { SHIP_00, SHIP_05 } from "shogun-ship";

const identity = new SHIP_00(config);
await identity.initialize();
await identity.login("alice", "password123");

const storage = new SHIP_05(identity, {
  ipfsService: "PINATA",
  ipfsConfig: {
    pinataJwt: "YOUR_JWT",
  },
  maxFileSizeMB: 100,
});
await storage.initialize();

// Upload encrypted file
const file = new File(["Hello World"], "test.txt");
const result = await storage.uploadFile(file, { encrypt: true });
console.log("IPFS hash:", result.hash);

// Download and decrypt
const data = await storage.downloadFile(result.hash, { decrypt: true });
console.log("File content:", new TextDecoder().decode(data));
```

### SHIP-06: Secure Vault

```typescript
import { SHIP_00, SHIP_06 } from "shogun-ship";

const identity = new SHIP_00(config);
await identity.initialize();
await identity.login("alice", "password123");

const vault = new SHIP_06(identity);
await vault.initialize();

// Store encrypted secrets
await vault.set("api-key", "secret_key_12345");
await vault.set("notes", "Private notes here");

// Retrieve secrets
const apiKey = await vault.get("api-key");
console.log("API Key:", apiKey);

// Export for backup
const backup = await vault.export();
console.log("Vault backup:", backup);
```

## 📚 Available SHIPs

| # | Name | Status | Description |
|---|------|--------|-------------|
| [**SHIP-00**](./docs/SHIP_00.md) | Identity & Authentication | ✅ Implemented | Foundation layer for identity and authentication |
| [**SHIP-01**](./docs/SHIP_01.md) | Encrypted Messaging | ✅ Implemented | P2P encrypted messaging (depends on SHIP-00) |
| [**SHIP-02**](./docs/SHIP_02.md) | Ethereum HD Wallet | ✅ Implemented | BIP-44 HD wallet, transaction signing & sending |
| [**SHIP-03**](./docs/SHIP_03.md) | Stealth Addresses | ✅ Implemented | ERC-5564 privacy-preserving stealth addresses |
| [**SHIP-04**](./docs/SHIP_04.md) | Multi-Modal Auth | ✅ Implemented | OAuth, WebAuthn, Nostr, Web3 authentication |
| [**SHIP-05**](./docs/SHIP_05.md) | File Storage | ✅ Implemented | Encrypted IPFS storage (depends on SHIP-00) |
| [**SHIP-06**](./docs/SHIP_06.md) | Secure Vault | ✅ Implemented | Encrypted key-value storage (depends on SHIP-00) |

## 🛠️ CLI Examples

Each SHIP comes with an interactive CLI example:

```bash
# Install dependencies
yarn install

# SHIP-00: Identity demo
yarn identity alice password123

# SHIP-01: Messaging demo
yarn messenger alice password123

# SHIP-02: Wallet demo
yarn wallet alice password123

# SHIP-03: Stealth addresses demo
yarn stealth alice password123

# SHIP-05: File storage demo
yarn storage alice password123

# SHIP-06: Vault demo
yarn vault alice password123
```

## 📖 Documentation

- [SHIP Standards Overview](./docs/README.md)
- [SHIP-00 Specification](./docs/SHIP_00.md)
- [SHIP-01 Specification](./docs/SHIP_01.md)
- [SHIP-02 Specification](./docs/SHIP_02.md)
- [SHIP-03 Specification](./docs/SHIP_03.md)
- [SHIP-04 Specification](./docs/SHIP_04.md)
- [SHIP-05 Specification](./docs/SHIP_05.md)
- [SHIP-06 Specification](./docs/SHIP_06.md)

## 🏗️ SHIP Hierarchy

```
SHIP-00 (Identity Foundation)
   │
   ├─► SHIP-01 (Messaging) ✅
   ├─► SHIP-02 (HD Wallet) ✅
   │      │
   │      └─► SHIP-03 (Stealth Addresses) ✅
   │
   ├─► SHIP-04 (Multi-Modal Auth) ✅
   ├─► SHIP-05 (File Storage) ✅
   └─► SHIP-06 (Secure Vault) ✅
```

**Inclusive Hierarchy Principle**:
- ✅ Higher-level SHIPs can use lower-level SHIPs
- ❌ Lower-level SHIPs cannot depend on higher-level ones
- 🎯 Ensures modularity, reusability, and maintainability

## 🔧 Development

```bash
# Install dependencies
yarn install

# Build
yarn build

# Run tests
yarn test

# Watch mode
yarn dev

# Format code
yarn format
```

## 📊 API Overview

### SHIP-00 (Identity)
- `signup(username, password)` - Create user
- `login(username, password)` - Authenticate
- `getPublicKey(userPub)` - Get user's public key
- `getUserByAlias(alias)` - Lookup user by alias
- `deriveEthereumAddress(pub)` - Derive ETH address

### SHIP-01 (Messaging)
- `sendMessage(toPub, text, options)` - Send encrypted message
- `onMessage(callback)` - Listen for messages
- `getMessageHistory(withPub)` - Get message history

### SHIP-02 (HD Wallet)
- `deriveAccount(index)` - Derive HD account
- `deriveMultipleAccounts(count)` - Derive multiple accounts
- `sendTransaction(request)` - Send ETH transaction

### SHIP-03 (Stealth Addresses)
- `generateStealthKeys()` - Generate stealth key pair
- `generateStealthAddress(spendKey, viewKey)` - Create stealth address
- `checkStealthPayments(viewKey, spendKey)` - Scan for payments

### SHIP-04 (Multi-Modal Auth)
- `loginWithOAuth(provider)` - OAuth authentication
- `registerWithWebAuthn(username)` - Register WebAuthn
- `loginWithWebAuthn(username)` - Login with WebAuthn
- `connectWeb3()` - Connect MetaMask
- `connectNostr()` - Connect Nostr wallet

### SHIP-05 (File Storage)
- `uploadFile(file, options)` - Upload to IPFS
- `downloadFile(hash, options)` - Download from IPFS
- `getStorageStats()` - Get storage statistics

### SHIP-06 (Secure Vault)
- `set(key, value)` - Store encrypted data
- `get(key)` - Retrieve encrypted data
- `export()` - Export vault for backup
- `import(data)` - Import vault from backup

## 🤝 Contributing

We welcome contributions! To propose a new SHIP:

1. Fork the repository
2. Create your SHIP specification in `docs/SHIP_XX.md`
3. Implement interfaces in `src/interfaces/ISHIP_XX.ts`
4. Implement the SHIP in `src/implementation/SHIP_XX.ts`
5. Add examples in `src/examples/`
6. Update this README
7. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 💬 Community

- 💬 **Telegram**: [t.me/shogun_eco](https://t.me/shogun_eco)
- 💻 **GitHub**: [github.com/scobru/shogun-ship](https://github.com/scobru/shogun-ship)
- 📚 **Documentation**: [shogun-ship-docs](https://shogun-ship-docs.vercel.app/)

## 🔗 Related Projects

- [shogun-core](https://github.com/scobru/shogun-core) - Core library
- [shogun-ipfs](https://github.com/scobru/shogun-ipfs) - IPFS integration
- [GunDB](https://github.com/amark/gun) - Decentralized database

---

<div align="center">

**Developed with ❤️ by the Shogun Team**

🗡️ **SHIP = Shogun Interface Proposals** 🗡️

*Building the decentralized future, one proposal at a time*

</div>

