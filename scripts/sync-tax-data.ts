import fs from "fs";
import path from "path";

async function main() {
  console.log("Starting Automated Tax Data Sync...");
  
  // In a real scenario, you would fetch from an API like:
  // const response = await fetch("https://api.taxdata.io/v1/global");
  // const newTaxData = await response.json();
  
  // For Phase 1, we will mock the API response to demonstrate the Auto-PR pipeline.
  // We simulate the IRS updating the US Tax brackets for 2027.
  const newTaxData = {
    US: {
      federalBrackets: [
        { max: 12000, rate: 0.10 },
        { max: 48000, rate: 0.12 },
        { max: 105000, rate: 0.22 }, // Simulated inflation adjustment
        { max: 195000, rate: 0.24 },
        { max: 250000, rate: 0.32 },
        { max: Infinity, rate: 0.35 }
      ],
      selfEmploymentTaxRate: 0.153,
      stateAverageRate: 0.05
    },
    UK: {
      incomeTaxRate: 0.20,
      nationalInsuranceRate: 0.09,
      vatThreshold: 95000 // Simulated HMRC adjustment
    },
    AU: {
      incomeTaxRate: 0.325,
      medicareLevy: 0.02,
      gstThreshold: 85000 // Simulated ATO adjustment
    }
  };

  const configPath = path.resolve(__dirname, "../config/tool-constants.json");
  const rawData = fs.readFileSync(configPath, "utf-8");
  const config = JSON.parse(rawData);

  // Deep comparison logic would go here. For simplicity, we just inject the new simulated data.
  const oldHash = JSON.stringify(config.tools["freelance-tax"].math.regimes);
  const newHash = JSON.stringify(newTaxData);

  if (oldHash === newHash) {
    console.log("Tax data is already up to date. No changes required.");
    process.exit(0); // Exit successfully without modifying the file
  }

  // ── Schema guard (fail closed) ──
  // The calculator reads regimes[r].brackets[].limit/.rate plus currency, self_employment_rate and
  // se_deduction_factor. Refuse to write a shape that does not match: a mismatched write silently
  // breaks the tax math (this happened — see the closed PR #1, 2026-10-01).
  function assertCompatible(regime: string, incoming: any): void {
    const problems: string[] = [];
    if (!incoming || typeof incoming !== "object") {
      problems.push("not an object");
    } else {
      if (!Array.isArray(incoming.brackets)) {
        problems.push("missing brackets[] — the calculator reads brackets[].limit and .rate");
      } else {
        incoming.brackets.forEach((b: any, i: number) => {
          if (typeof b.limit !== "number") problems.push(`brackets[${i}].limit is not a number`);
          if (typeof b.rate !== "number") problems.push(`brackets[${i}].rate is not a number`);
        });
      }
      for (const key of ["currency", "self_employment_rate", "se_deduction_factor"]) {
        if (!(key in incoming)) problems.push(`missing ${key}`);
      }
    }
    if (problems.length) {
      console.error(`Refusing to write ${regime}: upstream data is not compatible with the calculator schema.`);
      problems.forEach(p => console.error(`  - ${p}`));
      console.error("No file was modified.");
      process.exit(1);
    }
  }

  Object.keys(newTaxData).forEach(regime => assertCompatible(regime, (newTaxData as any)[regime]));

  console.log("Changes detected! Updating tool-constants.json with new structural tax logic.");
  config.tools["freelance-tax"].math.regimes = newTaxData;

  // Re-escape non-ASCII so the diff shows real data changes instead of escape churn.
  const serialised = JSON.stringify(config, null, 2)
    .replace(/[^\x00-\x7F]/g, ch => "\\u" + ch.charCodeAt(0).toString(16).padStart(4, "0"));
  fs.writeFileSync(configPath, serialised, "utf-8");
  console.log("Successfully updated tax regimes. Ready for Auto-PR commit.");
}

main().catch(err => {
  console.error("Fatal Error during Tax Sync:", err);
  process.exit(1);
});
