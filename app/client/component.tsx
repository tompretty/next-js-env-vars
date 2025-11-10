"use client";

import { env } from "@/env";

export default function Component() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <div className="space-y-6">
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
            <strong>Note:</strong> In production builds (next build + next
            start), NEXT_PUBLIC_* variables are inlined at build time into the
            client-side bundle. In development mode (next dev), they read from
            process.env at runtime.
          </p>
        </div>
      </div>
    </div>
  );
}
