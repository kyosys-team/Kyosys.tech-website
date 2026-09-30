import { defineConfig } from "prisma/config";
import { config as loadEnv } from "dotenv";

// Prisma 6 with prisma.config.ts skips automatic .env loading, so load
// .env.local explicitly — otherwise CLI commands (migrate, db seed) can't
// see DATABASE_URL. Next.js itself loads .env.local automatically at runtime.
loadEnv({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
