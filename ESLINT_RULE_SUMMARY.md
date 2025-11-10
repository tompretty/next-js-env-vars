# Custom ESLint Rule: Preventing Static Component Env Variable Issues

## What Was Created

A custom ESLint rule that catches a common Next.js mistake: using server-side environment variables in statically rendered components (which only capture build-time values, not runtime values).

## Files Added

```
eslint-rules/
├── require-force-dynamic-for-env.js  # The ESLint rule implementation
├── index.js                          # Plugin exports
├── README.md                         # Documentation and usage
└── ALTERNATIVE_APPROACHES.md         # Other solutions to consider
```

## Quick Test

The rule is now active and working! To see it in action:

1. **Remove the force-dynamic from a page:**

   ```typescript
   // app/test/page.tsx
   import { env } from "@/env";

   export default function Page() {
     return <div>{env.MY_SERVER_VAR}</div>;
   }
   // Note: No 'export const dynamic = "force-dynamic"'
   ```

2. **Run the linter:**

   ```bash
   npm run lint
   ```

3. **You'll see an error:**
   ```
   Server-only environment variable 'MY_SERVER_VAR' is used without
   `export const dynamic = 'force-dynamic'`. This component will be
   statically rendered and only capture build-time values.
   ```

## How It Works

The rule checks for:

- ✅ Imports from `@/env`
- ✅ Usage of non-`NEXT_PUBLIC_*` variables (server-only)
- ❌ Missing `export const dynamic = "force-dynamic"`
- ✅ Skips client components (`"use client"`)

## When to Disable

If you intentionally want build-time values (rare), disable the rule:

```typescript
/* eslint-disable custom/require-force-dynamic-for-env */
import { env } from "@/env";

export default function Page() {
  return <div>{env.MY_SERVER_VAR}</div>; // Will use build-time value
}
```

## Configuration

The rule is configured in `eslint.config.mjs`:

```javascript
rules: {
  "custom/require-force-dynamic-for-env": "error",
}
```

You can customize it:

```javascript
rules: {
  "custom/require-force-dynamic-for-env": ["error", {
    envSource: "@/env",                    // Your env import path
    serverOnlyPattern: "^(?!NEXT_PUBLIC_).*" // Regex for server vars
  }]
}
```

## Next Steps

### Option 1: Use as-is

The rule works great as a development-time check. Run `npm run lint` regularly.

### Option 2: Add Runtime Protection

For extra safety, add runtime checks to your `env.ts` (see `eslint-rules/ALTERNATIVE_APPROACHES.md` for implementation).

### Option 3: Combine Approaches

Use the ESLint rule for dev-time feedback + runtime checks for production safety.

## Why This Matters

**Without this rule:**

```typescript
// This looks fine but captures BUILD_TIME value only! ❌
export default function Page() {
  return <div>{env.MY_SERVER_VAR}</div>;
}
```

**With this rule:**

- Linter catches the mistake immediately ✅
- Forces you to be explicit about static vs dynamic rendering ✅
- Prevents production surprises ✅

## Real-World Impact

This rule prevents bugs like:

- Database URLs changing between environments
- Feature flags not updating
- API keys not rotating properly
- Configuration not responding to runtime changes

All because the component was accidentally static and captured build-time values.
