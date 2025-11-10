# Custom ESLint Rule: require-force-dynamic-for-env

## Overview

This custom ESLint rule prevents a common mistake in Next.js applications: using server-side environment variables in statically rendered components, which causes them to be captured at build time instead of reading runtime values.

## The Problem

In Next.js production builds:

- **Static components** (default): Server-side code runs once at build time
- **Dynamic components** (`export const dynamic = "force-dynamic"`): Server-side code runs on every request

If you use a server-only environment variable (like `MY_SERVER_VAR`) in a static component, it will only capture the value from build time, not runtime. This is often unexpected behavior.

## What the Rule Does

The rule checks for:

1. ✅ Imports from your env module (e.g., `import { env } from '@/env'`)
2. ✅ Usage of server-only env variables (non-`NEXT_PUBLIC_*` variables)
3. ❌ Missing `export const dynamic = "force-dynamic"` declaration
4. ✅ Ignores client components (`"use client"` directive)

## Examples

### ❌ Bad (will trigger error)

```typescript
import { env } from "@/env";

export default function Page() {
  // ERROR: MY_SERVER_VAR used without force-dynamic
  return <div>{env.MY_SERVER_VAR}</div>;
}
```

### ✅ Good (with force-dynamic)

```typescript
import { env } from "@/env";

export default function Page() {
  // OK: force-dynamic ensures this runs at runtime
  return <div>{env.MY_SERVER_VAR}</div>;
}

export const dynamic = "force-dynamic";
```

### ✅ Good (NEXT_PUBLIC variables are fine)

```typescript
import { env } from "@/env";

export default function Page() {
  // OK: NEXT_PUBLIC variables are meant to be inlined at build time
  return <div>{env.NEXT_PUBLIC_MY_CLIENT_VAR}</div>;
}
```

### ✅ Good (client components are ignored)

```typescript
"use client";
import { env } from "@/env";

export default function Component() {
  // OK: Client components can only access NEXT_PUBLIC variables anyway
  return <div>{env.NEXT_PUBLIC_MY_CLIENT_VAR}</div>;
}
```

## Configuration

You can customize the rule in `eslint.config.mjs`:

```javascript
{
  rules: {
    "custom/require-force-dynamic-for-env": ["error", {
      // The import source for your env variables
      envSource: "@/env",

      // Regex to identify server-only variables
      // Default: any variable that doesn't start with NEXT_PUBLIC_
      serverOnlyPattern: "^(?!NEXT_PUBLIC_).*"
    }]
  }
}
```

## Disabling for Specific Cases

If you intentionally want a server-only variable to use build-time values (like in the `server-static` demo page), you can disable the rule:

```typescript
import { env } from "@/env";

export default function Page() {
  // eslint-disable-next-line custom/require-force-dynamic-for-env
  return <div>{env.MY_SERVER_VAR}</div>;
}

// Intentionally static - uses build-time values
```

## How It Works

The rule uses ESLint's AST (Abstract Syntax Tree) traversal to:

1. **Track imports**: Identifies when you import from your env module
2. **Detect directives**: Checks for `"use client"` directive (skips if present)
3. **Monitor exports**: Looks for `export const dynamic = "force-dynamic"`
4. **Track usage**: Records all server-only env variable accesses
5. **Report violations**: At the end of the file, reports if server-only variables were used without force-dynamic

## Testing

Run the linter to see violations:

```bash
npm run lint
```

This will catch any static components using server-only environment variables.

## Alternative Approaches

See [ALTERNATIVE_APPROACHES.md](./ALTERNATIVE_APPROACHES.md) for other ways to prevent this issue, including:

- TypeScript-based solutions
- Runtime checks
- Architecture patterns
