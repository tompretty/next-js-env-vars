# NextJS env vars

## Takeaways

The key takeaways are:

- The `NEXT_PUBLIC_` prefixed variables will always be the build time values in production. This limits their usefulness a lot (are there any use cases?)
- Using environment variables alone isn't sufficient to opt-in to dynamic rendering! Potential fix: custom eslint rule for this?
