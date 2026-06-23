import fs from "fs";
import path from "path";

// Configuration: Drip feed exactly 5 new spoke pages per day
const PAGES_PER_DAY = 5;

interface SpokeInput {
  spokeSlug: string;
  toolSlug: string;
  title: string;
  description: string;
  presetParams: Record<string, string>;
}

interface SpokeOutput extends Omit<SpokeInput, "spokeSlug"> {
  releaseDate: string;
}

const allSpokes: SpokeInput[] = [];

// ==========================================
// 1. Cron Visualizer Spokes
// ==========================================
const cronIntervals = [
  { slug: "every-5-minutes", expr: "*/5 * * * *", desc: "Every 5 minutes" },
  { slug: "every-10-minutes", expr: "*/10 * * * *", desc: "Every 10 minutes" },
  { slug: "every-15-minutes", expr: "*/15 * * * *", desc: "Every 15 minutes" },
  { slug: "every-30-minutes", expr: "*/30 * * * *", desc: "Every 30 minutes" },
  { slug: "every-hour", expr: "0 * * * *", desc: "Every hour at minute 0" },
  { slug: "every-2-hours", expr: "0 */2 * * *", desc: "Every 2 hours" },
  { slug: "at-midnight-every-day", expr: "0 0 * * *", desc: "Every day at midnight" },
  { slug: "at-1am-every-day", expr: "0 1 * * *", desc: "Every day at 1:00 AM" },
  { slug: "at-2am-every-day", expr: "0 2 * * *", desc: "Every day at 2:00 AM" },
  { slug: "at-5am-on-sundays", expr: "0 5 * * 0", desc: "Every Sunday at 5:00 AM" },
  { slug: "every-first-of-month", expr: "0 0 1 * *", desc: "First day of every month at midnight" },
  { slug: "every-weekday-at-9am", expr: "0 9 * * 1-5", desc: "Monday through Friday at 9:00 AM" },
];

cronIntervals.forEach(cron => {
  allSpokes.push({
    spokeSlug: cron.slug,
    toolSlug: "cron-visualizer",
    title: `Cron Job For: ${cron.desc} (${cron.expr})`,
    description: `Generate, validate, and parse the exact cron expression for ${cron.desc.toLowerCase()}. Use our visualizer to test the syntax ${cron.expr}.`,
    presetParams: { q: cron.expr }
  });
});

// ==========================================
// 2. Subnet Calculator Spokes
// ==========================================
const cidrBlocks = Array.from({length: 32}, (_, i) => i + 1).filter(c => c >= 8); // /8 to /32
cidrBlocks.forEach(cidr => {
  allSpokes.push({
    spokeSlug: `cidr-${cidr}-reference`,
    toolSlug: "subnet-calculator",
    title: `CIDR /${cidr} Subnet Mask Reference & Calculator`,
    description: `Calculate the usable hosts, broadcast address, and subnet mask for a /${cidr} network block dynamically.`,
    presetParams: { cidr: cidr.toString() }
  });
});

// ==========================================
// 3. Freelance Tax Calculator Spokes
// ==========================================
const usStates = ["California", "Texas", "New York", "Florida", "Illinois", "Pennsylvania", "Ohio", "Georgia", "North Carolina", "Michigan", "New Jersey", "Virginia", "Washington", "Arizona", "Massachusetts"];
usStates.forEach(state => {
  allSpokes.push({
    spokeSlug: `${state.toLowerCase().replace(/\s+/g, "-")}-sole-proprietor`,
    toolSlug: "freelance-tax",
    title: `${state} Sole Proprietorship & 1099 Freelance Tax Calculator`,
    description: `Estimate your net income after federal, state, and self-employment taxes as an independent contractor or sole proprietor in ${state}.`,
    presetParams: { regime: "US", state: state }
  });
});

// ==========================================
// Process & Stagger Release Dates
// ==========================================
const spokesDb: Record<string, SpokeOutput> = {};

allSpokes.forEach((spoke, index) => {
  const { spokeSlug, ...rest } = spoke;
  
  const daysOffset = Math.floor(index / PAGES_PER_DAY);
  const releaseDate = new Date();
  
  // To allow testing right away, let's make the very first batch (index 0-4) immediately live by giving them a date of yesterday.
  if (daysOffset === 0) {
    releaseDate.setDate(releaseDate.getDate() - 1);
  } else {
    releaseDate.setDate(releaseDate.getDate() + daysOffset);
    releaseDate.setUTCHours(0, 0, 0, 0); // Normalize to midnight UTC
  }

  spokesDb[spokeSlug] = {
    ...rest,
    releaseDate: releaseDate.toISOString(),
  };
});

const outputPath = path.resolve(__dirname, "../config/spokes.json");
fs.writeFileSync(outputPath, JSON.stringify(spokesDb, null, 2), "utf-8");

console.log(`Successfully generated ${allSpokes.length} programmatic spoke permutations.`);
console.log(`Saved to: ${outputPath}`);
console.log(`Schedule: ${PAGES_PER_DAY} pages per day across ${Math.ceil(allSpokes.length / PAGES_PER_DAY)} days.`);
