export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <main>
        <div className="bg-purple-50 border-l-4 border-purple-500 p-6 mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">
            Server Static Component
          </h1>
          <p className="text-purple-700 text-sm">
            Runs on server • Rendered once at build time • Cached for all
            requests
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              MY_SERVER_VAR (Server-only)
            </h3>
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
              <div className="text-sm text-yellow-700 mb-2 font-medium">
                ⚠️ Production build: Build-time value (static page)
              </div>
              <div className="text-3xl font-mono font-bold text-yellow-900">
                {env.MY_SERVER_VAR}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              NEXT_PUBLIC_MY_CLIENT_VAR
            </h3>
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
              <div className="text-sm text-yellow-700 mb-2 font-medium">
                ⚠️ Production build: Build-time value (inlined at build)
              </div>
              <div className="text-3xl font-mono font-bold text-yellow-900">
                {env.NEXT_PUBLIC_MY_CLIENT_VAR}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong>Production behavior:</strong> Both variables are captured
              at build time because this is a statically rendered page. In dev
              mode (next dev), both read from runtime.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
