import { env } from "@/env";

export default function Page() {
  return (
    <div>
      <main>
        <h1>Static server component</h1>

        {/* In prod these will both evaluate to the BUILDTIME value of the env vars as this is a static page and is rendered once at buildtime */}
        <p>Server variable: {env.MY_SERVER_VAR}</p>
        <p>Public variable: {env.NEXT_PUBLIC_MY_CLIENT_VAR}</p>
      </main>
    </div>
  );
}
