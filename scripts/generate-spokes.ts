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
// 8. Cron Visualizer Spokes — schedule expansion
//    CronVisualizer reads prefillParams.q, so each of these genuinely loads its expression.
// ==========================================
const cronExtra = [
  { slug: "every-1-minute", expr: "* * * * *", desc: "Every minute" },
  { slug: "every-2-minutes", expr: "*/2 * * * *", desc: "Every 2 minutes" },
  { slug: "every-3-minutes", expr: "*/3 * * * *", desc: "Every 3 minutes" },
  { slug: "every-4-minutes", expr: "*/4 * * * *", desc: "Every 4 minutes" },
  { slug: "every-6-minutes", expr: "*/6 * * * *", desc: "Every 6 minutes" },
  { slug: "every-12-minutes", expr: "*/12 * * * *", desc: "Every 12 minutes" },
  { slug: "every-20-minutes", expr: "*/20 * * * *", desc: "Every 20 minutes" },
  { slug: "every-45-minutes", expr: "*/45 * * * *", desc: "Every 45 minutes" },
  { slug: "every-3-hours", expr: "0 */3 * * *", desc: "Every 3 hours" },
  { slug: "every-4-hours", expr: "0 */4 * * *", desc: "Every 4 hours" },
  { slug: "every-6-hours", expr: "0 */6 * * *", desc: "Every 6 hours" },
  { slug: "every-8-hours", expr: "0 */8 * * *", desc: "Every 8 hours" },
  { slug: "every-12-hours", expr: "0 */12 * * *", desc: "Every 12 hours" },
  { slug: "every-15-minutes-on-weekdays", expr: "*/15 * * * 1-5", desc: "Every 15 minutes on weekdays" },
  { slug: "every-hour-on-weekdays", expr: "0 * * * 1-5", desc: "Every hour on weekdays" },
  { slug: "every-first-of-quarter", expr: "0 0 1 1,4,7,10 *", desc: "First day of every quarter" },
  { slug: "every-january-first", expr: "0 0 1 1 *", desc: "Every January 1st at midnight" }
];
cronExtra.forEach(cron => {
  allSpokes.push({
    spokeSlug: cron.slug,
    toolSlug: "cron-visualizer",
    title: `Cron Job For: ${cron.desc} (${cron.expr})`,
    description: `Generate, validate, and parse the exact cron expression for ${cron.desc.toLowerCase()}. Use our visualizer to test the syntax ${cron.expr}.`,
    presetParams: { q: cron.expr }
  });
});

// Every-day-at-hour sweep (03:00 through 23:00; midnight, 1am and 2am already exist)
const dailyHours = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
dailyHours.forEach(hour => {
  const label = hour === 12 ? "12:00 PM" : hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
  const slugHour = hour === 12 ? "12pm" : hour < 12 ? `${hour}am` : `${hour - 12}pm`;
  const expr = `0 ${hour} * * *`;
  allSpokes.push({
    spokeSlug: `at-${slugHour}-every-day`,
    toolSlug: "cron-visualizer",
    title: `Cron Job For: Every day at ${label} (${expr})`,
    description: `Build, validate, and preview the cron schedule that runs every day at ${label}. The visualizer shows the next run times for ${expr}.`,
    presetParams: { q: expr }
  });
});

// Once-a-week-at-9am sweep
const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
weekdayNames.forEach((day, idx) => {
  const expr = `0 9 * * ${idx}`;
  allSpokes.push({
    spokeSlug: `every-${day.toLowerCase()}-at-9am`,
    toolSlug: "cron-visualizer",
    title: `Cron Job For: Every ${day} at 9:00 AM (${expr})`,
    description: `Cron expression that runs once a week on ${day} at 9:00 AM. Validate the syntax and preview the upcoming run dates for ${expr}.`,
    presetParams: { q: expr }
  });
});

// ==========================================
// 9. Triple Net (NNN) Spokes with real, editable figures
//    NNNCalculator reads baseRent/rentType/sqft/taxes/insurance/cam, so these pages open
//    preloaded with plausible numbers for the asset class rather than empty defaults.
// ==========================================
const nnnPresets = [
  { slug: "cold-storage-nnn-calculator", title: "Cold Storage NNN Lease Calculator",
    p: { baseRent: "14.5", rentType: "annual_psf", sqft: "25000", taxes: "42000", insurance: "28000", cam: "31000" } },
  { slug: "medical-office-nnn-calculator", title: "Medical Office NNN Cost Calculator",
    p: { baseRent: "38", rentType: "annual_psf", sqft: "4000", taxes: "22000", insurance: "9500", cam: "18000" } },
  { slug: "data-center-nnn-lease-calculator", title: "Data Center NNN Lease Calculator",
    p: { baseRent: "95", rentType: "annual_psf", sqft: "12000", taxes: "120000", insurance: "65000", cam: "88000" } },
  { slug: "self-storage-nnn-calculator", title: "Self Storage NNN Cost Calculator",
    p: { baseRent: "11", rentType: "annual_psf", sqft: "30000", taxes: "38000", insurance: "21000", cam: "26000" } },
  { slug: "qsr-drive-thru-nnn-calculator", title: "QSR Drive-Thru NNN Lease Calculator",
    p: { baseRent: "52", rentType: "annual_psf", sqft: "2800", taxes: "19000", insurance: "12000", cam: "16000" } },
  { slug: "grocery-anchored-retail-nnn-calculator", title: "Grocery-Anchored Retail NNN Calculator",
    p: { baseRent: "24", rentType: "annual_psf", sqft: "45000", taxes: "95000", insurance: "44000", cam: "120000" } },
  { slug: "strip-mall-nnn-cost-calculator", title: "Strip Mall NNN Cost Calculator",
    p: { baseRent: "26", rentType: "annual_psf", sqft: "18000", taxes: "46000", insurance: "19000", cam: "52000" } },
  { slug: "flex-industrial-nnn-calculator", title: "Flex Industrial NNN Calculator",
    p: { baseRent: "15", rentType: "annual_psf", sqft: "22000", taxes: "34000", insurance: "17000", cam: "24000" } },
  { slug: "parking-garage-nnn-calculator", title: "Parking Garage NNN Calculator",
    p: { baseRent: "18", rentType: "annual_psf", sqft: "60000", taxes: "88000", insurance: "36000", cam: "72000" } },
  { slug: "fitness-studio-nnn-calculator", title: "Fitness Studio NNN Calculator",
    p: { baseRent: "32", rentType: "annual_psf", sqft: "6500", taxes: "27000", insurance: "13000", cam: "22000" } },
  { slug: "daycare-nnn-lease-calculator", title: "Daycare NNN Lease Calculator",
    p: { baseRent: "28", rentType: "annual_psf", sqft: "8000", taxes: "25000", insurance: "14000", cam: "19000" } },
  { slug: "restaurant-with-patio-nnn-calculator", title: "Restaurant With Patio NNN Calculator",
    p: { baseRent: "40", rentType: "annual_psf", sqft: "5200", taxes: "29000", insurance: "16000", cam: "24000" } }
];
nnnPresets.forEach(target => {
  allSpokes.push({
    spokeSlug: target.slug,
    toolSlug: "nnn-calculator",
    title: target.title,
    description: `Model base rent plus property taxes, insurance, and Common Area Maintenance (CAM) for a ${target.title.replace(" Calculator", "").toLowerCase()} — preloaded with realistic figures you can edit.`,
    presetParams: target.p
  });
});

// ==========================================
// 10. Cash-on-Cash Spokes with real acquisition figures
//     CashOnCashYield reads prefillParams.price and prefillParams.rent (annual gross rent).
// ==========================================
const cocPresets = [
  { slug: "single-family-rental-yield-calculator", title: "Single-Family Rental Yield Calculator", price: "450000", rent: "42000" },
  { slug: "brrrr-cash-on-cash-calculator", title: "BRRRR Cash-on-Cash Calculator", price: "320000", rent: "36000" },
  { slug: "house-hack-roi-calculator", title: "House Hack ROI Calculator", price: "680000", rent: "54000" },
  { slug: "storage-facility-coc-calculator", title: "Storage Facility Cash-on-Cash Calculator", price: "1500000", rent: "180000" },
  { slug: "mobile-home-park-coc-calculator", title: "Mobile Home Park Cash-on-Cash Calculator", price: "2200000", rent: "260000" },
  { slug: "office-building-coc-calculator", title: "Office Building Cash-on-Cash Calculator", price: "3400000", rent: "420000" },
  { slug: "retail-center-coc-calculator", title: "Retail Center Cash-on-Cash Calculator", price: "4800000", rent: "560000" },
  { slug: "industrial-warehouse-coc-calculator", title: "Industrial Warehouse Cash-on-Cash Calculator", price: "2900000", rent: "330000" },
  { slug: "grocery-anchored-coc-calculator", title: "Grocery-Anchored Center Cash-on-Cash Calculator", price: "8200000", rent: "940000" },
  { slug: "data-center-coc-calculator", title: "Data Center Cash-on-Cash Calculator", price: "12000000", rent: "1500000" },
  { slug: "car-wash-coc-calculator", title: "Car Wash Cash-on-Cash Calculator", price: "1850000", rent: "340000" },
  { slug: "laundromat-coc-calculator", title: "Laundromat Cash-on-Cash Calculator", price: "420000", rent: "96000" }
];
cocPresets.forEach(target => {
  allSpokes.push({
    spokeSlug: target.slug,
    toolSlug: "coc-yield",
    title: target.title,
    description: `Calculate Cash-on-Cash return, Net Operating Income (NOI), and DSCR for a ${target.title.replace(" Calculator", "").toLowerCase()} — preloaded with a sample acquisition you can edit.`,
    presetParams: { price: target.price, rent: target.rent }
  });
});

// ==========================================
// 11. JSON Parser Spokes with real sample documents
//     JSONParser reads prefillParams.json, so each page opens with a working example loaded.
// ==========================================
const jsonSamples = [
  { slug: "validate-kubernetes-deployment-json", title: "Validate Kubernetes Deployment JSON",
    sample: '{"apiVersion":"apps/v1","kind":"Deployment","metadata":{"name":"web","labels":{"app":"web"}},"spec":{"replicas":3,"selector":{"matchLabels":{"app":"web"}},"template":{"metadata":{"labels":{"app":"web"}},"spec":{"containers":[{"name":"web","image":"nginx:1.27","ports":[{"containerPort":80}]}]}}}}' },
  { slug: "validate-docker-compose-json", title: "Validate Docker Compose JSON",
    sample: '{"version":"3.9","services":{"api":{"image":"node:22-alpine","ports":["8080:8080"],"environment":{"NODE_ENV":"production"}},"db":{"image":"postgres:16","volumes":["pgdata:/var/lib/postgresql/data"]}},"volumes":{"pgdata":{}}}' },
  { slug: "validate-aws-iam-policy-json", title: "Validate AWS IAM Policy JSON",
    sample: '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject","s3:ListBucket"],"Resource":["arn:aws:s3:::example-bucket","arn:aws:s3:::example-bucket/*"]}]}' },
  { slug: "validate-openapi-3-json", title: "Validate OpenAPI 3.0 JSON",
    sample: '{"openapi":"3.0.3","info":{"title":"Orders API","version":"1.0.0"},"paths":{"/orders":{"get":{"summary":"List orders","responses":{"200":{"description":"OK"}}}}}}' },
  { slug: "validate-terraform-state-json", title: "Validate Terraform State JSON",
    sample: '{"version":4,"terraform_version":"1.9.5","serial":12,"lineage":"a1b2c3","outputs":{},"resources":[]}' },
  { slug: "validate-postman-collection-json", title: "Validate Postman Collection JSON",
    sample: '{"info":{"name":"NadirTools API","schema":"https://schema.getpostman.com/json/collection/v2.1.0/collection.json"},"item":[{"name":"Health","request":{"method":"GET","url":"https://api.nadirtools.com/health"}}]}' },
  { slug: "validate-geojson-feature-collection", title: "Validate GeoJSON Feature Collection",
    sample: '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"Point A"},"geometry":{"type":"Point","coordinates":[-117.16,32.71]}}]}' },
  { slug: "validate-cloudformation-template-json", title: "Validate CloudFormation Template JSON",
    sample: '{"AWSTemplateFormatVersion":"2010-09-09","Resources":{"Bucket":{"Type":"AWS::S3::Bucket","Properties":{"BucketName":"example-artifacts"}}}}' },
  { slug: "validate-package-lock-json", title: "Validate package-lock.json",
    sample: '{"name":"example-app","version":"1.0.0","lockfileVersion":3,"requires":true,"packages":{"":{"name":"example-app","version":"1.0.0"}}}' },
  { slug: "validate-jwt-payload-json", title: "Validate JWT Payload JSON",
    sample: '{"sub":"1234567890","name":"Alex Rango","iat":1770000000,"exp":1770003600,"scope":"read:tools"}' },
  { slug: "validate-eslint-flat-config-json", title: "Validate ESLint Flat Config JSON",
    sample: '[{"rules":{"no-unused-vars":"warn","no-console":"off"}},{"ignores":["dist/**","node_modules/**"]}]' },
  { slug: "validate-json-schema-draft-json", title: "Validate JSON Schema Draft JSON",
    sample: '{"$schema":"https://json-schema.org/draft/2020-12/schema","type":"object","properties":{"email":{"type":"string","format":"email"}},"required":["email"]}' },
  { slug: "validate-netlify-config-json", title: "Validate Netlify Config JSON",
    sample: '{"build":{"command":"npm run build","publish":"out"},"redirects":[{"from":"/old","to":"/new","status":301}]}' },
  { slug: "validate-vercel-config-json", title: "Validate Vercel Config JSON",
    sample: '{"version":2,"builds":[{"src":"api/*.ts","use":"@vercel/node"}],"routes":[{"src":"/api/(.*)","dest":"/api/$1"}]}' },
  { slug: "validate-google-cloud-build-json", title: "Validate Google Cloud Build JSON",
    sample: '{"steps":[{"name":"gcr.io/cloud-builders/npm","args":["install"]},{"name":"gcr.io/cloud-builders/npm","args":["run","build"]}]}' }
];
jsonSamples.forEach(target => {
  allSpokes.push({
    spokeSlug: target.slug,
    toolSlug: "json-parser",
    title: target.title,
    description: `A fast, client-side utility to ${target.title.toLowerCase()} — preloaded with a real ${target.title.replace("Validate ", "").replace(" JSON", "")} example you can edit, with strict syntax validation and pretty-print formatting.`,
    presetParams: { json: target.sample }
  });
});

// ==========================================
// 12. Firewall Validator Spokes with real rule sets
//     FirewallValidator reads prefillParams.rules, so each page opens with sample rules loaded.
// ==========================================
const firewallSamples = [
  { slug: "cisco-ios-acl-auditor", title: "Cisco IOS ACL Auditor",
    rules: "access-list 100 permit tcp 10.0.0.0 0.0.0.255 any eq 22\naccess-list 100 deny tcp any any eq 22\naccess-list 100 permit tcp any any eq 443\naccess-list 100 deny ip any any" },
  { slug: "iptables-nftables-auditor", title: "iptables & nftables Rule Auditor",
    rules: "-A INPUT -p tcp --dport 22 -s 10.0.0.0/8 -j ACCEPT\n-A INPUT -p tcp --dport 22 -j DROP\n-A INPUT -p tcp --dport 443 -j ACCEPT\n-A INPUT -j DROP" },
  { slug: "mikrotik-routeros-firewall-auditor", title: "MikroTik RouterOS Firewall Auditor",
    rules: "/ip firewall filter add chain=input protocol=tcp dst-port=22 src-address=10.0.0.0/8 action=accept\n/ip firewall filter add chain=input protocol=tcp dst-port=22 action=drop\n/ip firewall filter add chain=input action=accept" },
  { slug: "aws-network-acl-auditor", title: "AWS Network ACL Auditor",
    rules: "100 allow tcp 0.0.0.0/0 443 0.0.0.0/0\n110 deny tcp 0.0.0.0/0 22 0.0.0.0/0\n120 allow tcp 10.0.0.0/8 22 0.0.0.0/0\n32767 deny all all 0.0.0.0/0" },
  { slug: "windows-defender-firewall-auditor", title: "Windows Defender Firewall Auditor",
    rules: "netsh advfirewall firewall add rule name=\"Allow HTTPS\" dir=in action=allow protocol=TCP localport=443\nnetsh advfirewall firewall add rule name=\"Block Telnet\" dir=in action=block protocol=TCP localport=23" },
  { slug: "meraki-mx-l3-firewall-auditor", title: "Meraki MX L3 Firewall Auditor",
    rules: "Allow TCP any 10.0.0.0/8:443 Comment:internal-admin\nDeny TCP any any:22 Comment:block-external-ssh\nAllow Any any any:53" },
  { slug: "kubernetes-networkpolicy-auditor", title: "Kubernetes NetworkPolicy Auditor",
    rules: "{\"podSelector\":{\"matchLabels\":{\"app\":\"api\"}},\"policyTypes\":[\"Ingress\"],\"ingress\":[{\"from\":[{\"podSelector\":{\"matchLabels\":{\"app\":\"web\"}}}],\"ports\":[{\"protocol\":\"TCP\",\"port\":8080}]}]}" },
  { slug: "gcp-vpc-firewall-auditor", title: "GCP VPC Firewall Auditor",
    rules: "allow tcp:80,443 from 0.0.0.0/0\ndeny tcp:22 from 0.0.0.0/0\nallow tcp:22 from 10.128.0.0/9" }
];
firewallSamples.forEach(target => {
  allSpokes.push({
    spokeSlug: target.slug,
    toolSlug: "firewall-validator",
    title: target.title,
    description: `Detect shadowed rules, overlaps, and logic errors directly in your browser with our ${target.title} — preloaded with a sample rule set you can edit.`,
    presetParams: { rules: target.rules }
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
// UTC throughout: the drip schedule must not shift with the runner's timezone.
maxDate.setUTCDate(maxDate.getUTCDate() - 1); // fallback to yesterday if empty

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
    releaseDate.setUTCDate(maxDate.getUTCDate() + 1 + daysOffset);
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
