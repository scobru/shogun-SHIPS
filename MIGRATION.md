# Migration Guide: shogun-core/ship → shogun-ship

This document explains the migration from the old architecture (SHIP standards embedded in shogun-core) to the new architecture (SHIP standards as a separate package).

## Overview

### Old Architecture ❌
```
shogun-core/
├── src/              # Core functionality
└── ship/             # SHIP standards (tightly coupled)
    ├── implementation/
    ├── interfaces/
    └── examples/
```

### New Architecture ✅
```
shogun-core/          # Core library (foundation)
    ↓ (no dependencies on SHIP)

shogun-ship/          # SHIP standards (separate package)
    ├── src/
    │   ├── implementation/
    │   ├── interfaces/
    │   └── examples/
    └── package.json (depends on shogun-core via npm)
```

## Benefits of Separation

### 1. Clean Dependency Flow
- ✅ **Unidirectional**: `shogun-ship` depends on `shogun-core` (via npm)
- ✅ **No circular dependencies**: `shogun-core` does NOT import `shogun-ship`
- ✅ **Clear ownership**: Each package has a single responsibility

### 2. Modularity
- ✅ Use `shogun-core` alone for basic auth/storage
- ✅ Add `shogun-ship` only when you need SHIP standards
- ✅ Smaller bundle sizes for projects that don't need all features

### 3. Independent Versioning
- ✅ `shogun-core` can be updated without breaking SHIP implementations
- ✅ New SHIPs can be added without updating core
- ✅ Better semantic versioning

### 4. Reusability
- ✅ Other projects can implement SHIP standards
- ✅ SHIP standards can be used with different core implementations
- ✅ Easier to create alternative implementations

## Migration Steps for Users

### Before (Old Way)
```typescript
import { SHIP_00, SHIP_01 } from "shogun-core/ship";
```

### After (New Way)
```typescript
import { SHIP_00, SHIP_01 } from "shogun-ship";
```

### Installation

**Before:**
```bash
npm install shogun-core
```

**After:**
```bash
npm install shogun-core shogun-ship
```

## Breaking Changes

### Import Paths
- ❌ `import { SHIP_00 } from "shogun-core/ship"` 
- ✅ `import { SHIP_00 } from "shogun-ship"`

### Dependencies
- Now requires both `shogun-core` AND `shogun-ship` to be installed
- `shogun-ship` has `shogun-core` as a peer dependency

## Implementation Changes

### Internal Imports Updated

**Before (in SHIP_00):**
```typescript
import { ShogunCore } from "../../src/core";
import derive from "../../src/gundb/derive";
```

**After (in SHIP_00):**
```typescript
import { ShogunCore, derive } from "shogun-core";
```

### All SHIP Files Updated
- ✅ `SHIP_00.ts` - Updated imports from shogun-core
- ✅ `SHIP_01.ts` - No changes needed (uses ISHIP_00 interface)
- ✅ `SHIP_02.ts` - No changes needed (uses ISHIP_00 interface)
- ✅ `SHIP_03.ts` - No changes needed (uses ISHIP_02 interface)
- ✅ `SHIP_04.ts` - Updated plugin imports from shogun-core
- ✅ `SHIP_05.ts` - No changes needed (uses ISHIP_00 interface)
- ✅ `SHIP_06.ts` - No changes needed (uses ISHIP_00 interface)

## Package Structure

### shogun-ship Package

```
shogun-ship/
├── src/
│   ├── implementation/    # SHIP implementations
│   │   ├── SHIP_00.ts
│   │   ├── SHIP_01.ts
│   │   ├── SHIP_02.ts
│   │   ├── SHIP_03.ts
│   │   ├── SHIP_04.ts
│   │   ├── SHIP_05.ts
│   │   └── SHIP_06.ts
│   ├── interfaces/        # SHIP interfaces
│   │   ├── ISHIP_00.ts
│   │   ├── ISHIP_01.ts
│   │   ├── ISHIP_02.ts
│   │   ├── ISHIP_03.ts
│   │   ├── ISHIP_04.ts
│   │   ├── ISHIP_05.ts
│   │   └── ISHIP_06.ts
│   ├── examples/          # CLI examples
│   │   ├── identity-cli.ts
│   │   ├── messenger-cli.ts
│   │   ├── wallet-cli.ts
│   │   ├── stealth-cli.ts
│   │   ├── storage-cli.ts
│   │   └── vault-cli.ts
│   └── index.ts           # Main exports
├── docs/                  # SHIP specifications
│   ├── README.md
│   ├── SHIP_00.md
│   ├── SHIP_01.md
│   ├── SHIP_02.md
│   ├── SHIP_03.md
│   ├── SHIP_04.md
│   ├── SHIP_05.md
│   └── SHIP_06.md
├── package.json           # Depends on shogun-core
├── tsconfig.json
├── README.md
└── LICENSE
```

## Exports

### Main Index (src/index.ts)
```typescript
// SHIP-00
export { SHIP_00 } from "./implementation/SHIP_00";
export type { ISHIP_00, SignupResult, AuthResult, ... } from "./interfaces/ISHIP_00";

// SHIP-01
export { SHIP_01 } from "./implementation/SHIP_01";
export type { ISHIP_01, SendMessageResult, ... } from "./interfaces/ISHIP_01";

// ... (SHIP-02 through SHIP-06)

// Re-export commonly used types from shogun-core
export type { ShogunCoreConfig } from "shogun-core";
```

### Package.json Exports
```json
{
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./ship-00": {
      "types": "./dist/types/implementation/SHIP_00.d.ts",
      "import": "./dist/implementation/SHIP_00.js",
      "default": "./dist/implementation/SHIP_00.js"
    },
    // ... (ship-01 through ship-06)
  }
}
```

## CLI Scripts

All CLI examples are now in `shogun-ship`:

```bash
cd shogun-ship

# Install dependencies
yarn install

# Run examples
yarn identity alice password123
yarn messenger alice password123
yarn wallet alice password123
yarn stealth alice password123
yarn storage alice password123
yarn vault alice password123
```

## Next Steps

### For shogun-core
1. Remove `ship/` folder from shogun-core
2. Remove ship exports from `src/index.ts`
3. Update documentation to reference `shogun-ship` package
4. Bump major version (breaking change)

### For shogun-ship
1. ✅ Package structure created
2. ✅ All imports updated
3. ✅ Documentation migrated
4. ✅ Build configuration ready
5. 🔜 Publish to npm
6. 🔜 Update dependent projects

## Timeline

1. **Phase 1** (Current): Create `shogun-ship` package
2. **Phase 2**: Test and validate all SHIP implementations
3. **Phase 3**: Publish `shogun-ship` to npm
4. **Phase 4**: Remove `ship/` from `shogun-core`
5. **Phase 5**: Update documentation and examples

## FAQ

### Q: Why separate the packages?
**A:** Better modularity, cleaner dependencies, independent versioning, and smaller bundle sizes.

### Q: Do I need to install both packages?
**A:** Yes, if you use SHIP standards. `shogun-ship` depends on `shogun-core`.

### Q: Will old code break?
**A:** Yes, import paths need to be updated: `shogun-core/ship` → `shogun-ship`

### Q: Can I still use shogun-core without SHIP?
**A:** Yes! That's one of the benefits. Use `shogun-core` alone for basic functionality.

### Q: What about the CLI examples?
**A:** They're now in `shogun-ship/src/examples/` with yarn scripts.

## Support

- 💬 Telegram: [t.me/shogun_eco](https://t.me/shogun_eco)
- 💻 GitHub: [github.com/scobru/shogun-ship](https://github.com/scobru/shogun-ship)
- 📚 Docs: [shogun-ship documentation](https://shogun-ship-docs.vercel.app/)

---

**Migration completed on**: October 2025  
**shogun-ship version**: 1.0.0  
**shogun-core version required**: ^3.3.5


