# Alternative Approaches to Enforce Dynamic Environment Variable Usage

Beyond the custom ESLint rule, here are other approaches to prevent accidentally using server-side environment variables in static components:

## 1. Runtime Checks (Recommended Complement)

Add runtime validation in your env module that throws errors in production when accessed from static contexts:

```typescript
// env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { headers } from "next/headers";

const baseEnv = createEnv({
  server: {
    MY_SERVER_VAR: z.string(),
  },
  client: {
    NEXT_PUBLIC_MY_CLIENT_VAR: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_MY_CLIENT_VAR: process.env.NEXT_PUBLIC_MY_CLIENT_VAR,
  },
});

// Wrap server variables with runtime checks
const runtimeCheckedEnv = new Proxy(baseEnv, {
  get(target, prop) {
    const value = target[prop];

    // Only check server-only variables in production
    if (
      typeof prop === "string" &&
      !prop.startsWith("NEXT_PUBLIC_") &&
      process.env.NODE_ENV === "production"
    ) {
      // Try to access headers to verify we're in a dynamic context
      try {
        headers();
      } catch (error) {
        throw new Error(
          `Environment variable "${String(
            prop
          )}" is being accessed in a static context. ` +
            `Add 'export const dynamic = "force-dynamic"' to your page/route to use runtime values.`
        );
      }
    }

    return value;
  },
});

export const env = runtimeCheckedEnv;
```

**Pros:**

- Catches issues at runtime in production
- Provides clear error messages
- Works as a safety net alongside ESLint

**Cons:**

- Only catches issues at runtime, not during development
- Small performance overhead (can be mitigated with caching)

## 2. Separate Import Paths

Create separate import paths for static and dynamic env access:

```typescript
// env/index.ts
export { env as envDynamic } from "./dynamic";
export { env as envStatic } from "./static";

// env/dynamic.ts
export const dynamic = "force-dynamic";
export { env } from "../base-env";

// env/static.ts
// Only exports NEXT_PUBLIC variables
export const env = {
  NEXT_PUBLIC_MY_CLIENT_VAR: process.env.NEXT_PUBLIC_MY_CLIENT_VAR,
};
```

Then use explicit imports:

```typescript
// Dynamic page
import { envDynamic as env } from "@/env";

export default function Page() {
  return <div>{env.MY_SERVER_VAR}</div>;
}

export const dynamic = "force-dynamic"; // Required with this import
```

**Pros:**

- Makes intent explicit in the import
- Can enforce with simpler ESLint rules
- Self-documenting code

**Cons:**

- Requires discipline to use correct import
- More boilerplate

## 3. TypeScript Conditional Types

Use TypeScript to make server-only env variables only accessible in dynamic contexts:

```typescript
// env-types.ts
type ServerEnv = {
  MY_SERVER_VAR: string;
};

type PublicEnv = {
  NEXT_PUBLIC_MY_CLIENT_VAR: string;
};

// Only available when force-dynamic is exported
export type DynamicEnv = ServerEnv & PublicEnv;

// Only public vars available in static contexts
export type StaticEnv = PublicEnv;

// env-dynamic.ts
import type { DynamicEnv } from "./env-types";

export const dynamic = "force-dynamic";
export const env: DynamicEnv = {
  MY_SERVER_VAR: process.env.MY_SERVER_VAR!,
  NEXT_PUBLIC_MY_CLIENT_VAR: process.env.NEXT_PUBLIC_MY_CLIENT_VAR!,
};

// env-static.ts
import type { StaticEnv } from "./env-types";

export const env: StaticEnv = {
  NEXT_PUBLIC_MY_CLIENT_VAR: process.env.NEXT_PUBLIC_MY_CLIENT_VAR!,
};
```

**Pros:**

- Compile-time type safety
- IDE autocomplete helps guide developers
- No runtime overhead

**Cons:**

- Requires separate imports for static vs dynamic
- TypeScript only (no runtime protection)
- More complex type definitions

## 4. File Structure Convention

Organize files to make static/dynamic distinction clear:

```
app/
  (static)/          # Static pages
    about/
    pricing/
  (dynamic)/         # Dynamic pages with force-dynamic
    dashboard/
    api/
```

Add a shared layout in `(dynamic)`:

```typescript
// app/(dynamic)/layout.tsx
export const dynamic = "force-dynamic";

export default function DynamicLayout({ children }) {
  return children;
}
```

Then use ESLint rules to enforce:

- Files in `(dynamic)` folder can access server env vars
- Files in `(static)` folder cannot

**Pros:**

- Clear visual organization
- Easier to reason about rendering behavior
- Can be enforced with path-based ESLint rules

**Cons:**

- Requires restructuring existing apps
- Less flexible for mixed static/dynamic pages

## 5. Custom Hook/Function Wrapper

Create a wrapper that enforces the check:

```typescript
// lib/use-env.ts
import { headers } from "next/headers";
import { env as baseEnv } from "@/env";

export function useDynamicEnv<T extends keyof typeof baseEnv>(
  key: T
): (typeof baseEnv)[T] {
  // This will throw if not in a dynamic context
  headers();

  return baseEnv[key];
}

// Usage in page
export default function Page() {
  const serverVar = useDynamicEnv("MY_SERVER_VAR");
  return <div>{serverVar}</div>;
}

export const dynamic = "force-dynamic";
```

**Pros:**

- Explicit about dynamic env access
- Runtime safety
- Can include additional validation logic

**Cons:**

- More verbose than direct access
- Requires discipline to use the wrapper

## Recommended Combination

For maximum protection, combine multiple approaches:

1. **Custom ESLint rule** (catch at dev time)
2. **Runtime checks** (catch at production time)
3. **File structure conventions** (make intent clear)

This provides multiple layers of protection and catches issues at different stages of development.
