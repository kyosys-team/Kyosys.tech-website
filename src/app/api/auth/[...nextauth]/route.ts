import { handlers } from "@/lib/auth";

// Auth.js v5 route handler — all of /api/auth/* (signin, callback, session…).
// Runs in the Node runtime; never executes during the static build.
export const { GET, POST } = handlers;
