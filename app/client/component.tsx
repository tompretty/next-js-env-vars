"use client";

import { env } from "@/env";

export default function Component() {
  return (
    <div>
      {/* In prod this will evaluate to the BUILDTIME value of the env var as NEXT_PUBLIC_ variables are always buildtime */}
      <p>Public variable: {env.NEXT_PUBLIC_MY_CLIENT_VAR}</p>
    </div>
  );
}
