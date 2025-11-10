import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <main>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-indigo-500 p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Next.js Environment Variables Demo
          </h1>
          <p className="text-gray-700 text-lg">
            Understanding how different component types handle environment
            variables
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How to Test This Demo
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>1. Build with BUILD_TIME values:</strong>
              </p>
              <code className="block bg-gray-900 text-green-400 px-4 py-3 rounded text-sm font-mono">
                MY_SERVER_VAR=BUILD_TIME NEXT_PUBLIC_MY_CLIENT_VAR=BUILD_TIME
                npm run build
              </code>

              <p className="text-sm text-gray-700 leading-relaxed pt-3">
                <strong>2. Run with RUN_TIME values:</strong>
              </p>
              <code className="block bg-gray-900 text-green-400 px-4 py-3 rounded text-sm font-mono">
                MY_SERVER_VAR=RUN_TIME NEXT_PUBLIC_MY_CLIENT_VAR=RUN_TIME npm
                start
              </code>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Pages to Explore
            </h2>
            <div className="grid gap-4">
              <Link
                href="/client"
                className="block p-6 border-2 border-blue-200 hover:border-blue-500 rounded-lg transition-colors bg-blue-50"
              >
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  Client Component
                </h3>
                <p className="text-blue-700 text-sm">
                  Demonstrates that NEXT_PUBLIC_* variables are always inlined
                  at build time, even in client components.
                </p>
              </Link>

              <Link
                href="/server-dynamic"
                className="block p-6 border-2 border-green-200 hover:border-green-500 rounded-lg transition-colors bg-green-50"
              >
                <h3 className="text-xl font-semibold text-green-900 mb-2">
                  Server Dynamic Component
                </h3>
                <p className="text-green-700 text-sm">
                  Shows that server-only variables (without NEXT_PUBLIC_) can
                  read runtime values when force-dynamic is enabled.
                  NEXT_PUBLIC_* still get inlined.
                </p>
              </Link>

              <Link
                href="/server-static"
                className="block p-6 border-2 border-purple-200 hover:border-purple-500 rounded-lg transition-colors bg-purple-50"
              >
                <h3 className="text-xl font-semibold text-purple-900 mb-2">
                  Server Static Component
                </h3>
                <p className="text-purple-700 text-sm">
                  Demonstrates that statically rendered pages capture all
                  environment variables at build time.
                </p>
              </Link>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6">
            <h3 className="font-semibold text-amber-900 mb-2">
              Key Takeaway (Production Builds)
            </h3>
            <p className="text-amber-800 text-sm leading-relaxed">
              In <strong>production builds</strong> (next build + next start),{" "}
              <strong>NEXT_PUBLIC_*</strong> variables are <em>always</em>{" "}
              inlined at build time by webpack, regardless of whether
              you&apos;re using client components, server components, or
              force-dynamic. For true runtime environment variables in
              production, use server-only variables (without the NEXT_PUBLIC_
              prefix) in dynamic server components.
            </p>
            <p className="text-amber-800 text-sm leading-relaxed mt-3">
              <strong>Note:</strong> In development mode (next dev), all
              environment variables are read from process.env at runtime, so you
              won&apos;t see this inlining behavior.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
