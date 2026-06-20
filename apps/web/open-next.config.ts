import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const cfConfig = defineCloudflareConfig({});

export default {
  ...cfConfig,
  buildCommand: "npx next build",
};
