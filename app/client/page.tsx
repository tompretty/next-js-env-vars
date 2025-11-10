import Component from "./component";

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <main>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Client Component
          </h1>
          <p className="text-blue-700 text-sm">
            Runs in the browser • Environment variables are inlined at build
            time
          </p>
        </div>

        <Component />
      </main>
    </div>
  );
}
