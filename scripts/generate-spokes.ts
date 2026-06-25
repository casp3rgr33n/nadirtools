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
// 4. Triple Net (NNN) Calculator Spokes (NEW)
// ==========================================
const nnnTargets = [
  { slug: "commercial-lease-nnn-calculator", title: "Commercial Lease NNN Calculator" },
  { slug: "retail-space-cam-estimator", title: "Retail Space CAM & NNN Estimator" },
  { slug: "warehouse-triple-net-lease", title: "Warehouse Triple Net Lease Calculator" },
  { slug: "office-space-nnn-calculator", title: "Office Space NNN Cost Estimator" },
  { slug: "restaurant-lease-cam-calculator", title: "Restaurant Lease CAM Calculator" }
];
nnnTargets.forEach(target => {
  allSpokes.push({
    spokeSlug: target.slug,
    toolSlug: "nnn-calculator",
    title: target.title,
    description: `Calculate your base rent, property taxes, building insurance, and Common Area Maintenance (CAM) for a Triple Net (NNN) lease.`,
    presetParams: {}
  });
});

// ==========================================
// 5. Cash-on-Cash Yield Spokes (NEW)
// ==========================================
const cocTargets = [
  "Duplex Cash-on-Cash Yield", "Triplex ROI Calculator", "Fourplex Cash Flow",
  "Multifamily DSCR", "Commercial Real Estate ROI", "Airbnb Cash-on-Cash",
  "Short-Term Rental Yield", "Self Storage ROI Calculator", "Mobile Home Park Yield",
  "Industrial Warehouse ROI", "Strip Mall Cash-on-Cash", "Mixed-Use Property ROI",
  "Student Housing Cash Flow", "Single-Family Rental Yield", "RV Park ROI"
];
cocTargets.forEach(target => {
  allSpokes.push({
    spokeSlug: target.toLowerCase().replace(/\s+/g, "-"),
    toolSlug: "coc-yield",
    title: target,
    description: `Calculate the Cash-on-Cash return, Net Operating Income (NOI), and Debt Service Coverage Ratio (DSCR) for a ${target.toLowerCase()} investment.`,
    presetParams: {}
  });
});

// ==========================================
// 6. JSON Parser Spokes (NEW)
// ==========================================
const jsonTargets = [
  "Validate OpenAPI JSON", "Format package.json", "Beautify tsconfig",
  "Minify JSON Payload", "Validate JWT Header JSON", "Format AWS IAM Policy",
  "Beautify GCP Service Account", "Validate Kubernetes JSON", "Minify Webpack Config",
  "Format Prettierrc", "Validate ESLintrc", "Beautify VSCode Settings",
  "Format manifest.json", "Validate Firebase JSON", "Beautify docker daemon.json"
];
jsonTargets.forEach(target => {
  allSpokes.push({
    spokeSlug: target.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ''),
    toolSlug: "json-parser",
    title: target,
    description: `A fast, client-side utility to ${target.toLowerCase()} with strict syntax validation, minification, and pretty-print formatting.`,
    presetParams: {}
  });
});

// ==========================================
// 7. Firewall Validator Spokes (NEW)
// ==========================================
const firewallTargets = [
  "Cisco ASA ACL Validator", "OPNsense Rule Auditor", "pfSense Firewall Tester",
  "FortiGate Policy Validator", "Palo Alto Security Policy", "Juniper SRX Rule Tester",
  "AWS Security Group Auditor", "Azure NSG Validator", "GCP Firewall Rule Tester",
  "iptables Rule Auditor", "UFW Firewall Tester", "Windows Firewall Validator",
  "Sophos XG Rule Tester", "SonicWall Policy Validator", "WatchGuard Firewall Auditor"
];
firewallTargets.forEach(target => {
  allSpokes.push({
    spokeSlug: target.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ''),
    toolSlug: "firewall-validator",
    title: target,
    description: `Detect shadowed rules, overlaps, and logic errors directly in your browser with our ${target}.`,
    presetParams: {}
  });
});

// ==========================================
// Process & Stagger Release Dates Safely
// ==========================================
const outputPath = path.resolve(__dirname, "../config/spokes.json");
let existingDb: Record<string, SpokeOutput> = {};

if (fs.existsSync(outputPath)) {
  existingDb = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
}

// Find the latest release date currently in the database
let maxDate = new Date();
maxDate.setDate(maxDate.getDate() - 1); // fallback to yesterday if empty

Object.values(existingDb).forEach(spoke => {
  const d = new Date(spoke.releaseDate);
  if (d > maxDate) {
    maxDate = d;
  }
});

// Start adding new spokes AFTER the maxDate
let newSpokesAdded = 0;

allSpokes.forEach(spoke => {
  const { spokeSlug, ...rest } = spoke;
  
  // If spoke already exists, PRESERVE its date.
  if (existingDb[spokeSlug]) {
    // Keep existing
  } else {
    // Brand new spoke! Assign a date.
    const daysOffset = Math.floor(newSpokesAdded / PAGES_PER_DAY);
    const releaseDate = new Date(maxDate);
    // Add offset (we start adding on the NEXT day after maxDate if maxDate is full?
    // Actually, to make it simple: maxDate + 1 day for the first batch.
    releaseDate.setDate(maxDate.getDate() + 1 + daysOffset);
    releaseDate.setUTCHours(0, 0, 0, 0);
    
    existingDb[spokeSlug] = {
      ...rest,
      releaseDate: releaseDate.toISOString(),
    };
    newSpokesAdded++;
  }
});

fs.writeFileSync(outputPath, JSON.stringify(existingDb, null, 2), "utf-8");

console.log(`Successfully processed ${allSpokes.length} total programmatic spoke permutations.`);
console.log(`Added ${newSpokesAdded} NEW spokes to the database.`);
console.log(`Saved to: ${outputPath}`);
