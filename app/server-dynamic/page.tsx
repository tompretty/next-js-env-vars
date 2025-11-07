import { env } from "@/env";

export default function Page() {
  return (
    <div>
      <main>
        <h1>Dynamic server component</h1>

        {/* In prod this will evaluate to the RUNTIME value of the env var as this is a dynamic page and it's a non-public variable */}
        <p>Server variable: {env.MY_SERVER_VAR}</p>

        {/* In prod this will evaluate to the BUILDTIME value of the env var as NEXT_PUBLIC_ variables are always buildtime */}
        <p>Public variable: {env.NEXT_PUBLIC_MY_CLIENT_VAR}</p>
      </main>
    </div>
  );
}

export const dynamic = "force-dynamic";
