import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials: {
    url:'postgresql://neondb_owner:npg_PlfcbgCo7hp5@ep-small-brook-a8445amx-pooler.eastus2.azure.neon.tech/video-generator?sslmode=require&channel_binding=require',
  },
});