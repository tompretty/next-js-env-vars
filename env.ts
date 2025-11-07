import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
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
