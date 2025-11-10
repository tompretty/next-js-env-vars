/**
 * ESLint rule to ensure server-side environment variables are only used
 * in components that have `export const dynamic = "force-dynamic"`
 *
 * This prevents accidentally using runtime env vars in statically rendered
 * components, which would cause them to be captured at build time only.
 */

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require `export const dynamic = 'force-dynamic'` when using server-only environment variables",
      category: "Best Practices",
      recommended: true,
    },
    messages: {
      missingForceDynamic:
        "Server-only environment variable '{{varName}}' is used without `export const dynamic = 'force-dynamic'`. " +
        "This component will be statically rendered and only capture build-time values. " +
        "Either add `export const dynamic = 'force-dynamic'` or use this variable in a dynamic component.",
    },
    schema: [
      {
        type: "object",
        properties: {
          envSource: {
            type: "string",
            description: "The import source for env variables (e.g., '@/env')",
            default: "@/env",
          },
          serverOnlyPattern: {
            type: "string",
            description:
              "Regex pattern to match server-only env variable names",
            default: "^(?!NEXT_PUBLIC_).*",
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const envSource = options.envSource || "@/env";
    const serverOnlyPattern = new RegExp(
      options.serverOnlyPattern || "^(?!NEXT_PUBLIC_).*"
    );

    let hasEnvImport = false;
    let envImportName = null;
    let hasForceDynamic = false;
    let hasUseClient = false;
    const serverEnvUsages = [];

    return {
      // Check for "use client" directive
      Program(node) {
        if (node.body[0]?.type === "ExpressionStatement") {
          const expr = node.body[0].expression;
          if (expr.type === "Literal" && expr.value === "use client") {
            hasUseClient = true;
          }
        }
      },

      // Track imports from env module
      ImportDeclaration(node) {
        if (node.source.value === envSource) {
          hasEnvImport = true;
          // Get the imported name (e.g., 'env' in `import { env } from '@/env'`)
          const specifier = node.specifiers.find(
            (s) => s.type === "ImportSpecifier"
          );
          if (specifier) {
            envImportName = specifier.local.name;
          }
        }
      },

      // Check for force-dynamic export
      ExportNamedDeclaration(node) {
        if (node.declaration?.type === "VariableDeclaration") {
          const declaration = node.declaration.declarations.find(
            (d) => d.id.name === "dynamic" && d.init?.value === "force-dynamic"
          );
          if (declaration) {
            hasForceDynamic = true;
          }
        }
      },

      // Track usage of server-only env variables
      MemberExpression(node) {
        if (!hasEnvImport || !envImportName) return;
        if (hasUseClient) return; // Skip client components

        // Check if this is accessing env.VARIABLE_NAME
        if (
          node.object.type === "Identifier" &&
          node.object.name === envImportName &&
          node.property.type === "Identifier"
        ) {
          const varName = node.property.name;

          // Check if it's a server-only variable (not NEXT_PUBLIC_*)
          if (serverOnlyPattern.test(varName)) {
            serverEnvUsages.push({
              node: node.property,
              varName,
            });
          }
        }
      },

      // At the end of the file, check if we have violations
      "Program:exit"() {
        // Only check server components (not client components)
        if (hasUseClient) return;

        // If we found server-only env variable usage without force-dynamic
        if (serverEnvUsages.length > 0 && !hasForceDynamic) {
          serverEnvUsages.forEach(({ node, varName }) => {
            context.report({
              node,
              messageId: "missingForceDynamic",
              data: { varName },
            });
          });
        }
      },
    };
  },
};
