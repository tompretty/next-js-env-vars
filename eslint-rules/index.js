/**
 * Custom ESLint rules for Next.js environment variables
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const requireForceDynamic = require("./require-force-dynamic-for-env");

module.exports = {
  rules: {
    "require-force-dynamic-for-env": requireForceDynamic,
  },
};
