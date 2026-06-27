// Better Auth mounts its own handler — this file just re-exports the mount helper.
// All /api/auth/* routes are handled by toNodeHandler(auth) in index.ts.
// This file exists as a placeholder in case custom endpoints need to be added
// alongside the Better Auth handler in the future.

export {};
