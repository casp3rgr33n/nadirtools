import {
  calculateSubnets,
  parseAndValidateFirewall,
  calculateFreelanceTaxes,
  parseCronExpression,
  calculateRealEstateYields,
  calculateNNN
} from "./calculations";

// Basic assertion helpers
let testsFailed = 0;
function assertEqual(actual: any, expected: any, message: string) {
  if (actual !== expected) {
    console.error(`❌ FAIL: ${message}`);
    console.error(`   Expected: ${expected}`);
    console.error(`   Actual:   ${actual}`);
    testsFailed++;
  } else {
    console.log(`✓ PASS: ${message}`);
  }
}

function assertNear(actual: number, expected: number, tolerance: number, message: string) {
  if (Math.abs(actual - expected) > tolerance) {
    console.error(`❌ FAIL: ${message}`);
    console.error(`   Expected: ${expected} (±${tolerance})`);
    console.error(`   Actual:   ${actual}`);
    testsFailed++;
  } else {
    console.log(`✓ PASS: ${message}`);
  }
}

// --------------------------------------------------------------------------
// 1. Subnet Calculator Tests
// --------------------------------------------------------------------------
function runSubnetTests() {
  console.log("\n--- Running Subnet Calculator Tests ---");
  const result = calculateSubnets("192.168.1.0", 24, 26);
  assertEqual(result.error, "", "No IP parsing errors");
  assertEqual(result.subnets.length, 4, "Split /24 to /26 yields exactly 4 subnets");

  const sub1 = result.subnets[0];
  assertEqual(sub1.id, 1, "First subnet ID is 1");
  assertEqual(sub1.network, "192.168.1.0", "First subnet network IP is correct");
  assertEqual(sub1.range, "192.168.1.1 - 192.168.1.62", "First subnet host range is correct");
  assertEqual(sub1.broadcast, "192.168.1.63", "First subnet broadcast IP is correct");
  assertEqual(sub1.usableHosts, 62, "Subnet size has 62 usable hosts");

  const sub4 = result.subnets[3];
  assertEqual(sub4.network, "192.168.1.192", "Last subnet network IP is correct");

  const invalidResult = calculateSubnets("256.100.100.1", 24, 26);
  assertEqual(
    invalidResult.error,
    "IP octets must be between 0 and 255.",
    "Correct error for out-of-range octets"
  );
}

// --------------------------------------------------------------------------
// 2. Firewall Validator Tests
// --------------------------------------------------------------------------
function runFirewallTests() {
  console.log("\n--- Running Firewall Validator Tests ---");
  const rules = `
    pass in quick on em0 proto tcp from any to any port 80
    block in on em0 proto tcp from 192.168.1.50 to any port 80
    access-list 101 permit tcp any any eq 80
  `;
  const report = parseAndValidateFirewall(rules);
  assertEqual(report.length, 3, "Parsed exactly 3 firewall rules");

  // Line 2 (block) should be shadowed by Line 1 (pass) since Line 1 matches 'any' source to port 80
  assertEqual(report[1].lineNum, 3, "Second rule is on line 3"); // 1-indexed, skipped comments
  assertEqual(report[1].shadowed, true, "Second rule is flagged as shadowed");
  assertEqual(report[1].shadowedBy, 2, "Second rule is shadowed by rule on line 2");

  assertEqual(report[2].shadowed, true, "Third rule is also shadowed by first rule");
}

// --------------------------------------------------------------------------
// 3. Freelance Tax Tests
// --------------------------------------------------------------------------
function runTaxTests() {
  console.log("\n--- Running Freelance Tax Tests ---");
  const bracketsConfig = {
    US: {
      brackets: [
        { limit: 11000, rate: 0.1 },
        { limit: 44725, rate: 0.12 },
        { limit: 95375, rate: 0.22 },
        { limit: 182100, rate: 0.24 },
        { limit: 9999999, rate: 0.32 }
      ],
      self_employment_rate: 0.153,
      se_deduction_factor: 0.9235
    }
  };

  // Gross $120,000, Expenses $20,000 -> Net $100,000
  const result = calculateFreelanceTaxes("US", 120000, 20000, bracketsConfig);
  assertEqual(result.netIncome, 100000, "Net income is correct");
  // Bracket 1: 11,000 * 0.1 = 1,100
  // Bracket 2: (44,725 - 11,000) * 0.12 = 4,047
  // Bracket 3: (95,375 - 44,725) * 0.22 = 11,143
  // Bracket 4: (100,000 - 95,375) * 0.24 = 1,110
  // Total Tax: 1,100 + 4,047 + 11,143 + 1,110 = 17,400
  assertEqual(result.taxOwed, 17400, "US Income tax estimate is correct");

  // US SE Tax: 100,000 * 0.9235 * 0.153 = 14,129.55
  assertNear(result.socialTax, 14129.55, 0.01, "US Social tax estimate is correct");
  assertNear(result.takeHome, 100000 - 17400 - 14129.55, 0.01, "US Net take-home matches calculations");
}

// --------------------------------------------------------------------------
// 4. Cron Visualizer Tests
// --------------------------------------------------------------------------
function runCronTests() {
  console.log("\n--- Running Cron Visualizer Tests ---");
  const result = parseCronExpression("*/15 0-5 * * 1-5");
  assertEqual(result.error, "", "No cron syntax errors");
  assertEqual(
    result.description,
    "Executes every 15 minutes, between hours 0 and 5, every day, every month, Monday through Friday.",
    "Decoded cron description matches expected text"
  );
  assertEqual(result.nextRuns.length, 5, "Simulated 5 projected triggers");
}

// --------------------------------------------------------------------------
// 5. Cash-on-Cash Yield Tests
// --------------------------------------------------------------------------
function runCashOnCashTests() {
  console.log("\n--- Running Cash-on-Cash Yield Tests ---");
  // Purchase: $1,200,000, 25% down ($300k), 6.5% interest, 30yr term, $150k gross rent, 35% opex
  const result = calculateRealEstateYields(1200000, 25, 6.5, 30, 150000, 35);

  assertEqual(result.totalInvested, 330000, "Total invested is correct (Down Payment + 2.5% Closing Costs)");
  assertNear(result.noi, 97500, 0.1, "Net Operating Income (NOI) is correct");

  // Annual Debt Service:
  // Loan amount = $900,000
  // Monthly payment = 900,000 * (0.065/12) / (1 - (1 + 0.065/12)^-360) = 5,688.61
  // Annual = 5688.61 * 12 = 68,263.32
  assertNear(result.debtService, 68263.32, 1.0, "Annual Debt Service matches standard amortization math");
  assertNear(result.cashFlow, 97500 - 68263.32, 1.0, "Net Cash Flow matches NOI minus Debt Service");

  // Coc Yield = CashFlow / TotalInvested = 29,236.68 / 330,000 = 8.86%
  assertNear(result.cocYield, 8.86, 0.1, "Cash-on-Cash Yield calculation is correct");

  // DSCR = NOI / DebtService = 97,500 / 68,263.32 = 1.43
  assertNear(result.dscr, 1.43, 0.01, "Debt Service Coverage Ratio (DSCR) calculation is correct");
}

function runNNNTests() {
  console.log("Running NNN Lease Calculator Tests...");
  const result = calculateNNN(20, "annual_psf", 5000, 10000, 2500, 5000);

  // Base rent = 20 * 5000 = 100,000
  assertNear(result.annualBase, 100000, 0.01, "Annual Base Rent (PSF) calculation is correct");

  // Triple Net Fees = 10000 + 2500 + 5000 = 17500
  assertNear(result.annualTripleNetFees, 17500, 0.01, "Annual Triple Net Fees calculation is correct");

  // Annual Total = 117,500
  assertNear(result.annualTotal, 117500, 0.01, "Annual Total calculation is correct");

  // Monthly Total = 117500 / 12 = 9791.67
  assertNear(result.monthlyTotal, 9791.66, 0.02, "Monthly Total calculation is correct");

  // Annual NNN PSF = 17500 / 5000 = 3.5
  assertNear(result.annualNnnPsf, 3.5, 0.01, "Annual NNN PSF calculation is correct");
}

// --------------------------------------------------------------------------
// Main runner execution
// --------------------------------------------------------------------------
try {
  runSubnetTests();
  runFirewallTests();
  runTaxTests();
  runCronTests();
  runCashOnCashTests();
  runNNNTests();

  console.log("\n----------------------------------------");
  if (testsFailed > 0) {
    console.error(`❌ Automated tests finished with ${testsFailed} failure(s).`);
    process.exit(1);
  } else {
    console.log("🚀 All calculator tests completed successfully!");
    process.exit(0);
  }
} catch (err: any) {
  console.error("Fatal error running test suite:", err);
  process.exit(1);
}
