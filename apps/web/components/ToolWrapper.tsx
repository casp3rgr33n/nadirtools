"use client";

import React, { useState, useEffect } from "react";
import LegalDisclaimer from "./LegalDisclaimer";
import {
  calculateSubnets,
  parseAndValidateFirewall,
  calculateFreelanceTaxes,
  parseCronExpression,
  calculateRealEstateYields,
  calculateNNN
} from "../utils/calculations";
import CopyButton from "./CopyButton";

interface ToolWrapperProps {
  toolSlug: string;
  toolConfig: any;
  prefillParams?: Record<string, string>;
}

export default function ToolWrapper({ toolSlug, toolConfig, prefillParams = {} }: ToolWrapperProps) {
  // Global Privacy Status Badge
  const privacyBadge = (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.4rem 0.8rem",
        borderRadius: "20px",
        background: "rgba(34, 197, 94, 0.08)",
        border: "1px solid rgba(34, 197, 94, 0.2)",
        color: "#22c55e",
        fontSize: "0.75rem",
        fontWeight: 500,
        marginBottom: "1.5rem"
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#22c55e",
          boxShadow: "0 0 8px #22c55e"
        }}
      />
      Processed completely client-side. No data is saved or transmitted.
    </div>
  );

  return (
    <div
      style={{
        background: "rgba(5, 7, 5, 0.6)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(223, 186, 107, 0.15)",
        borderRadius: "16px",
        padding: "2rem",
        color: "#e5e5e5",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.5)"
      }}
    >
      {privacyBadge}
      
      <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem", color: "#f5f5f5" }}>
        Interactive {toolConfig.name}
      </h2>
      <p style={{ color: "#a3a3a3", fontSize: "0.95rem", marginBottom: "2rem" }}>
        {toolConfig.description}
      </p>

      {/* Render the specific tool interface */}
      {toolSlug === "json-parser" && <JSONParser prefillParams={prefillParams} />}
      {toolSlug === "subnet-calculator" && <SubnetCalculator prefillParams={prefillParams} />}
      {toolSlug === "firewall-validator" && <FirewallValidator prefillParams={prefillParams} />}
      {toolSlug === "freelance-tax" && <FreelanceTax calculatorConfig={toolConfig.math} prefillParams={prefillParams} />}
      {toolSlug === "cron-visualizer" && <CronVisualizer prefillParams={prefillParams} />}
      {toolSlug === "coc-yield" && <CashOnCashYield prefillParams={prefillParams} />}
      {toolSlug === "nnn-calculator" && <NNNCalculator prefillParams={prefillParams} />}

      <LegalDisclaimer category={toolConfig.category} />
    </div>
  );
}

/* ==========================================================================
   6. Advanced JSON Parser & Schema Formatter
   ========================================================================== */
function JSONParser({ prefillParams = {} }: { prefillParams?: Record<string, string> }) {
  const defaultJson = `{\n  "status": "success",\n  "message": "Welcome to the JSON Parser",\n  "data": [\n    { "id": 1, "active": true }\n  ]\n}`;
  const [inputJson, setInputJson] = useState(defaultJson);
  const [outputJson, setOutputJson] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (prefillParams.json) {
      try {
        // Handle encoded JSON
        const decoded = decodeURIComponent(prefillParams.json);
        setInputJson(decoded);
      } catch (e) {
        setInputJson(prefillParams.json);
      }
    }
  }, []);

  useEffect(() => {
    if (!inputJson.trim()) {
      setOutputJson("");
      setError(null);
      return;
    }
    
    try {
      const parsed = JSON.parse(inputJson);
      // Format with 2 spaces
      const formatted = JSON.stringify(parsed, null, 2);
      setOutputJson(formatted);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutputJson("");
    }
  }, [inputJson]);

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setInputJson(minified);
    } catch (e) {
      // Ignored: Cannot minify invalid JSON
    }
  };

  const handleFormat = () => {
    if (outputJson) {
      setInputJson(outputJson);
    }
  };

  return (
    <div style={toolSplitterStyle}>
      <div style={toolLeftColStyle}>
        <div style={formFieldStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={labelStyle}>Raw JSON Input</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleFormat} style={toolActionBtnStyle}>Format</button>
              <button onClick={handleMinify} style={toolActionBtnStyle}>Minify</button>
            </div>
          </div>
          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            style={{
              ...inputStyle,
              fontFamily: "monospace",
              height: "400px",
              resize: "vertical",
              fontSize: "0.9rem",
              lineHeight: "1.5",
              whiteSpace: "pre",
              overflowWrap: "normal",
              overflowX: "auto"
            }}
            placeholder="Paste raw JSON string here..."
          />
        </div>
      </div>

      <div style={toolRightColStyle}>
        <div>
          <h3 style={{ ...sectionHeadingStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Parsed Output
            {outputJson && !error && <CopyButton text={outputJson} />}
          </h3>
          
          {error ? (
            <div style={{ ...errorStyle, fontFamily: "monospace" }}>
              <strong>Syntax Error:</strong><br/>
              {error}
            </div>
          ) : (
            <div style={{ position: "relative", animation: "fadeUp 0.4s ease-out forwards" }}>
              <pre
                style={{
                  background: "#0f172a",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                  borderRadius: "8px",
                  padding: "1rem",
                  overflowX: "auto",
                  color: "#93c5fd",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                  lineHeight: "1.5",
                  height: "400px",
                  margin: 0
                }}
              >
                <code>{outputJson || "Valid JSON will appear here..."}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   1. Visual Subnet & CIDR Partition Engine
   ========================================================================== */
function SubnetCalculator({ prefillParams = {} }: { prefillParams?: Record<string, string> }) {
  const [ip, setIp] = useState("192.168.1.0");
  const [cidr, setCidr] = useState(24);
  const [splitCidr, setSplitCidr] = useState(26);
  const [subnets, setSubnets] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (prefillParams.ip || params.has('ip')) setIp(prefillParams.ip || params.get('ip')!);
    if (prefillParams.cidr || params.has('cidr')) setCidr(Number(prefillParams.cidr || params.get('cidr')));
    if (prefillParams.splitCidr || params.has('splitCidr')) setSplitCidr(Number(prefillParams.splitCidr || params.get('splitCidr')));
  }, []);

  useEffect(() => {
    const { error: calcError, subnets: calcSubnets } = calculateSubnets(ip, cidr, splitCidr);
    setError(calcError);
    setSubnets(calcSubnets);
    
    // Sync to URL
    const params = new URLSearchParams(window.location.search);
    params.set('ip', ip);
    params.set('cidr', cidr.toString());
    params.set('splitCidr', splitCidr.toString());
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [ip, cidr, splitCidr]);

  return (
    <div style={toolSplitterStyle}>
      <div style={toolLeftColStyle}>
        <div style={formFieldStyle}>
          <label style={labelStyle}>Base Network IP</label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={formFieldStyle}>
          <label style={labelStyle}>Parent CIDR (/{cidr})</label>
          <input
            type="number"
            min="0"
            max="32"
            value={cidr}
            onChange={(e) => setCidr(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div style={formFieldStyle}>
          <label style={labelStyle}>Split Subnet CIDR (/{splitCidr})</label>
          <input
            type="number"
            min="0"
            max="32"
            value={splitCidr}
            onChange={(e) => setSplitCidr(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        {error && <div style={errorStyle}>{error}</div>}
      </div>

      <div style={toolRightColStyle}>
        <div>
          <h3 style={sectionHeadingStyle}>Calculated Partition Table</h3>
          <p style={{ color: "#737373", fontSize: "0.85rem", marginBottom: "1rem" }}>
            Showing up to 128 subnets. Split size yields {Math.pow(2, Math.max(0, splitCidr - cidr))} total networks.
          </p>

          <div style={{ overflowX: "auto", animation: "fadeUp 0.4s ease-out forwards" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRowStyle}>
                  <th style={tableHeaderStyle}>Subnet #</th>
                  <th style={tableHeaderStyle}>Network Address</th>
                  <th style={tableHeaderStyle}>Usable IP Range</th>
                  <th style={tableHeaderStyle}>Broadcast IP</th>
                  <th style={tableHeaderStyle}>Usable Hosts</th>
                </tr>
              </thead>
              <tbody>
                {subnets.map((sub) => (
                  <tr key={sub.id} style={tableRowStyle}>
                    <td style={tableColStyle}>Subnet {sub.id}</td>
                    <td style={{ ...tableColStyle, color: "#22c55e", fontFamily: "monospace" }}>
                      {sub.network}/{splitCidr}
                      <CopyButton text={`${sub.network}/${splitCidr}`} />
                    </td>
                    <td style={{ ...tableColStyle, fontFamily: "monospace" }}>{sub.range}</td>
                    <td style={{ ...tableColStyle, fontFamily: "monospace" }}>{sub.broadcast}</td>
                    <td style={{ ...tableColStyle, fontWeight: "bold" }}>{sub.usableHosts.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. OPNsense & Cisco Firewall Rule Validator
   ========================================================================== */
function FirewallValidator({ prefillParams = {} }: { prefillParams?: Record<string, string> }) {
  const defaultRules = `# Sample OPNsense Rules
pass in quick on em0 proto tcp from any to any port 80
block in on em0 proto tcp from 192.168.1.50 to any port 80

# Sample Cisco ACL Rules
access-list 101 permit tcp any any eq 80
access-list 101 deny tcp 192.168.1.0 0.0.0.255 any eq 80`;

  const [rulesText, setRulesText] = useState(defaultRules);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (prefillParams.rules) setRulesText(prefillParams.rules);
  }, []);

  useEffect(() => {
    const logs = parseAndValidateFirewall(rulesText);
    setReports(logs);
  }, [rulesText]);

  return (
    <div style={toolSplitterStyle}>
      <div style={toolLeftColStyle}>
        <div style={formFieldStyle}>
          <label style={labelStyle}>Raw Firewall Rule Payload (OPNsense or Cisco Format)</label>
          <textarea
            value={rulesText}
            onChange={(e) => setRulesText(e.target.value)}
            style={{
              ...inputStyle,
              fontFamily: "monospace",
              height: "280px",
              resize: "vertical"
            }}
          />
        </div>
      </div>

      <div style={toolRightColStyle}>
        <div>
          <h3 style={sectionHeadingStyle}>Rule Shadowing Validation Report</h3>

          <div style={{ overflowX: "auto", animation: "fadeUp 0.4s ease-out forwards" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRowStyle}>
                  <th style={tableHeaderStyle}>Line</th>
                  <th style={tableHeaderStyle}>Format</th>
                  <th style={tableHeaderStyle}>Parsed Action</th>
                  <th style={tableHeaderStyle}>Match Metrics</th>
                  <th style={tableHeaderStyle}>Audit Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((rep, idx) => (
                  <tr
                    key={idx}
                    style={{
                      ...tableRowStyle,
                      background: rep.shadowed ? "rgba(239, 68, 68, 0.05)" : "transparent"
                    }}
                  >
                    <td style={tableColStyle}>{rep.lineNum}</td>
                    <td style={tableColStyle}>{rep.format}</td>
                    <td style={tableColStyle}>
                      <span
                        style={{
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          background: rep.action === "pass" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          color: rep.action === "pass" ? "#22c55e" : "#f87171"
                        }}
                      >
                        {rep.action.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ ...tableColStyle, fontFamily: "monospace", fontSize: "0.85rem" }}>
                      Proto: {rep.proto} | Src: {rep.src} | Dst: {rep.dst} | Port: {rep.port}
                    </td>
                    <td style={tableColStyle}>
                      {rep.shadowed ? (
                        <span style={{ color: "#f87171", fontWeight: 600 }}>
                          ⚠️ Shadowed by Line {rep.shadowedBy} (Rule Ineffective)
                        </span>
                      ) : (
                        <span style={{ color: "#22c55e" }}>✓ Valid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. Multi-Regime Tech Freelance Tax & GST Matrix
   ========================================================================== */
function FreelanceTax({ calculatorConfig, prefillParams = {} }: { calculatorConfig: any, prefillParams?: Record<string, string> }) {
  const regimes = calculatorConfig.regimes || {};
  const [regime, setRegime] = useState("US");
  const [gross, setGross] = useState(120000);
  const [expenses, setExpenses] = useState(20000);
  const [netIncome, setNetIncome] = useState(0);
  const [taxOwed, setTaxOwed] = useState(0);
  const [socialTax, setSocialTax] = useState(0);
  const [indirectTax, setIndirectTax] = useState(0);
  const [takeHome, setTakeHome] = useState(0);

  useEffect(() => {
    if (prefillParams.regime) setRegime(prefillParams.regime);
    if (prefillParams.gross) setGross(Number(prefillParams.gross));
  }, []);

  useEffect(() => {
    const results = calculateFreelanceTaxes(regime, gross, expenses, regimes);
    setNetIncome(results.netIncome);
    setTaxOwed(results.taxOwed);
    setSocialTax(results.socialTax);
    setIndirectTax(results.indirectTax);
    setTakeHome(results.takeHome);
  }, [regime, gross, expenses, regimes]);

  const currencySymbol = regime === "US" ? "$" : regime === "UK" ? "£" : "$";

  return (
    <div style={toolSplitterStyle}>
      <div style={toolLeftColStyle}>
        <div style={formFieldStyle}>
          <label style={labelStyle}>Tax Regime / Region</label>
          <select
            value={regime}
            onChange={(e) => setRegime(e.target.value)}
            style={selectStyle}
          >
            <option value="US">United States (USD)</option>
            <option value="UK">United Kingdom (GBP)</option>
            <option value="AU">Australia (AUD)</option>
          </select>
        </div>
        <div style={formFieldStyle}>
          <label style={labelStyle}>Annual Gross Income</label>
          <input
            type="number"
            min="0"
            value={gross}
            onChange={(e) => setGross(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div style={formFieldStyle}>
          <label style={labelStyle}>Business Expenses</label>
          <input
            type="number"
            min="0"
            value={expenses}
            onChange={(e) => setExpenses(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={toolRightColStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem"
          }}
        >
          <div style={metricCardStyle}>
            <div style={metricTitleStyle}>Net Operating Profit</div>
            <div style={metricValueStyle}>
              {currencySymbol}
              {netIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricTitleStyle}>Income Tax Estimate</div>
            <div style={metricValueStyle}>
              {currencySymbol}
              {taxOwed.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricTitleStyle}>Social / Medicare Tax</div>
            <div style={metricValueStyle}>
              {currencySymbol}
              {socialTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div style={{ ...metricCardStyle, background: "rgba(34, 197, 94, 0.08)" }}>
            <div style={{ ...metricTitleStyle, color: "#22c55e" }}>Net Take-Home</div>
            <div style={{ ...metricValueStyle, color: "#22c55e" }}>
              {currencySymbol}
              {takeHome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        {indirectTax > 0 && (
          <div
            style={{
              padding: "1rem",
              background: "rgba(223, 186, 107, 0.08)",
              border: "1px solid rgba(223, 186, 107, 0.2)",
              borderRadius: "8px",
              color: "#dfba6b",
              fontSize: "0.9rem"
            }}
          >
            ⚠️ **VAT/GST Alert:** Your gross income ({currencySymbol}
            {gross.toLocaleString()}) exceeds the registration threshold. You may need to charge/register for sales taxes. Projected annual sales tax obligation is {currencySymbol}
            {indirectTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}.
          </div>
        )}

        {/* Visual Income Breakdown Bar */}
        <div>
          <h4 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.75rem" }}>Income Distribution</h4>
          <div
            style={{
              height: "24px",
              borderRadius: "12px",
              display: "flex",
              overflow: "hidden",
              width: "100%",
              background: "#262626"
            }}
          >
            {takeHome > 0 && (
              <div
                style={{
                  width: `${(takeHome / gross) * 100}%`,
                  background: "#22c55e"
                }}
                title="Take Home"
              />
            )}
            {taxOwed > 0 && (
              <div
                style={{
                  width: `${(taxOwed / gross) * 100}%`,
                  background: "#f43f5e"
                }}
                title="Income Tax"
              />
            )}
            {socialTax > 0 && (
              <div
                style={{
                  width: `${(socialTax / gross) * 100}%`,
                  background: "#e11d48"
                }}
                title="Social Tax"
              />
            )}
            {expenses > 0 && (
              <div
                style={{
                  width: `${(expenses / gross) * 100}%`,
                  background: "#a3a3a3"
                }}
                title="Expenses"
              />
            )}
          </div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.75rem", fontSize: "0.8rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ width: "8px", height: "8px", background: "#22c55e", borderRadius: "50%" }} /> Take Home
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ width: "8px", height: "8px", background: "#f43f5e", borderRadius: "50%" }} /> Income Tax
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ width: "8px", height: "8px", background: "#e11d48", borderRadius: "50%" }} /> Social Tax
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ width: "8px", height: "8px", background: "#a3a3a3", borderRadius: "50%" }} /> Expenses
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. Advanced Cron Expression Visualizer & Simulator
   ========================================================================== */
function CronVisualizer({ prefillParams = {} }: { prefillParams?: Record<string, string> }) {
  const [expression, setExpression] = useState("*/15 0-5 * * 1-5");
  const [description, setDescription] = useState("");
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (prefillParams.q || params.has('cron')) setExpression(prefillParams.q || params.get('cron')!);
  }, []);

  useEffect(() => {
    const { error: calcError, description: calcDesc, nextRuns: calcRuns } = parseCronExpression(expression);
    setError(calcError);
    setDescription(calcDesc);
    setNextRuns(calcRuns.map((run) => new Date(run).toLocaleString()));

    const params = new URLSearchParams(window.location.search);
    params.set('cron', expression);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [expression]);

  return (
    <div style={toolSplitterStyle}>
      <div style={toolLeftColStyle}>
        <div style={formFieldStyle}>
          <label style={labelStyle}>Cron Expression</label>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            style={{ ...inputStyle, fontFamily: "monospace", fontSize: "1.2rem", letterSpacing: "1px" }}
          />
        </div>
        {error && <div style={errorStyle}>{error}</div>}
      </div>

      <div style={toolRightColStyle}>
        {!error && (
          <div style={{ animation: "fadeUp 0.4s ease-out forwards" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#22c55e", marginBottom: "0.5rem" }}>
                Decoded Schedule Description:
                <CopyButton text={description} style={{ float: 'right' }} />
              </h4>
              <p style={{ fontSize: "1.05rem", background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "8px" }}>
                {description}
              </p>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                Next 5 Projected Execution Triggers:
              </h4>
              <ul style={{ paddingLeft: "1.5rem", color: "#a3a3a3", fontFamily: "monospace" }}>
                {nextRuns.map((run, index) => (
                  <li key={index} style={{ marginBottom: "0.4rem" }}>
                    {run}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   5. Commercial Real Estate Cash-on-Cash Yield Simulator
   ========================================================================== */
function CashOnCashYield({ prefillParams = {} }: { prefillParams?: Record<string, string> }) {
  const [purchasePrice, setPurchasePrice] = useState(1200000);
  const [downPaymentPct, setDownPaymentPct] = useState(25);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [grossRent, setGrossRent] = useState(150000);
  const [opexPct, setOpexPct] = useState(35);

  const [cocYield, setCocYield] = useState(0);
  const [capRate, setCapRate] = useState(0);
  const [dscr, setDscr] = useState(0);
  const [cashFlow, setCashFlow] = useState(0);
  const [noi, setNoi] = useState(0);
  const [debtService, setDebtService] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);

  useEffect(() => {
    if (prefillParams.price) setPurchasePrice(Number(prefillParams.price));
    if (prefillParams.rent) setGrossRent(Number(prefillParams.rent));
  }, []);

  useEffect(() => {
    const results = calculateRealEstateYields(
      purchasePrice,
      downPaymentPct,
      interestRate,
      loanTermYears,
      grossRent,
      opexPct
    );
    setTotalInvested(results.totalInvested);
    setDebtService(results.debtService);
    setNoi(results.noi);
    setCashFlow(results.cashFlow);
    setCocYield(results.cocYield);
    setCapRate(results.capRate);
    setDscr(results.dscr);
  }, [purchasePrice, downPaymentPct, interestRate, loanTermYears, grossRent, opexPct]);

  return (
    <div style={toolSplitterStyle}>
      <div style={toolLeftColStyle}>
        <div style={formFieldStyle}>
          <label style={labelStyle}>Purchase Price ($)</label>
          <input
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div style={formFieldStyle}>
          <label style={labelStyle}>Down Payment (%)</label>
          <input
            type="number"
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div style={formFieldStyle}>
          <label style={labelStyle}>Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div style={formFieldStyle}>
          <label style={labelStyle}>Loan Term (Years)</label>
          <input
            type="number"
            value={loanTermYears}
            onChange={(e) => setLoanTermYears(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div style={formFieldStyle}>
          <label style={labelStyle}>Annual Gross Rent ($)</label>
          <input
            type="number"
            value={grossRent}
            onChange={(e) => setGrossRent(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div style={formFieldStyle}>
          <label style={labelStyle}>Operating Expenses (%)</label>
          <input
            type="number"
            value={opexPct}
            onChange={(e) => setOpexPct(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={toolRightColStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem"
          }}
        >
          <div style={metricCardStyle}>
            <div style={metricTitleStyle}>Cash-on-Cash Yield</div>
            <div style={{ ...metricValueStyle, color: "#22c55e" }}>
              {cocYield.toFixed(2)}%
            </div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricTitleStyle}>Cap Rate</div>
            <div style={metricValueStyle}>{capRate.toFixed(2)}%</div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricTitleStyle}>Annual Net Cash Flow</div>
            <div style={{ ...metricValueStyle, color: cashFlow >= 0 ? "#22c55e" : "#f43f5e" }}>
              ${cashFlow.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricTitleStyle}>DSCR</div>
            <div style={{ ...metricValueStyle, color: dscr >= 1.25 ? "#22c55e" : dscr >= 1.0 ? "#dfba6b" : "#f43f5e" }}>
              {dscr.toFixed(2)}x
            </div>
          </div>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <h3 style={sectionHeadingStyle}>Underwriting Calculations Matrix</h3>
          <table style={tableStyle}>
            <tbody>
              <tr style={tableRowStyle}>
                <td style={tableColStyle}>Net Operating Income (NOI)</td>
                <td style={tableColStyle}>${noi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
              <tr style={tableRowStyle}>
                <td style={tableColStyle}>Annual Debt Service (P&I)</td>
                <td style={tableColStyle}>${debtService.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
              <tr style={tableRowStyle}>
                <td style={tableColStyle}>Total Cash Invested (Inc. 2.5% Closing Costs)</td>
                <td style={tableColStyle}>${totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   CSS Styles
   ========================================================================== */
const toolSplitterStyle: React.CSSProperties = {
  display: "flex",
  gap: "2.5rem",
  flexWrap: "wrap",
  alignItems: "flex-start"
};

const toolActionBtnStyle: React.CSSProperties = {
  background: "rgba(223, 186, 107, 0.1)",
  border: "1px solid rgba(223, 186, 107, 0.2)",
  borderRadius: "4px",
  color: "#dfba6b",
  fontSize: "0.75rem",
  fontWeight: 600,
  padding: "0.25rem 0.5rem",
  cursor: "pointer",
  transition: "all 0.2s ease"
};

const toolLeftColStyle: React.CSSProperties = {
  flex: "1 1 320px",
  display: "flex",
  flexDirection: "column",
  gap: "1.25rem"
};

const toolRightColStyle: React.CSSProperties = {
  flex: "1.5 1 450px",
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem"
};

const formRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "1.5rem",
  flexWrap: "wrap",
  marginBottom: "1rem"
};

const formFieldStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem"
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#a3a3a3"
};

const inputStyle: React.CSSProperties = {
  background: "#0b0f0b",
  border: "1px solid rgba(223, 186, 107, 0.15)",
  borderRadius: "8px",
  padding: "0.75rem 1rem",
  color: "#f5f5f5",
  fontSize: "0.95rem",
  outline: "none",
  width: "100%",
  boxSizing: "border-box"
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%23dfba6b' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center"
};

const errorStyle: React.CSSProperties = {
  color: "#f87171",
  background: "rgba(239, 68, 68, 0.1)",
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  border: "1px solid rgba(239, 68, 68, 0.2)",
  fontSize: "0.9rem",
  margin: "1rem 0"
};

const metricCardStyle: React.CSSProperties = {
  background: "rgba(223, 186, 107, 0.02)",
  border: "1px solid rgba(223, 186, 107, 0.1)",
  borderRadius: "12px",
  padding: "1.25rem",
  textAlign: "center"
};

const metricTitleStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#a3a3a3",
  textTransform: "capitalize",
  letterSpacing: "0.2px",
  marginBottom: "0.5rem"
};

const metricValueStyle: React.CSSProperties = {
  fontSize: "1.6rem",
  fontWeight: 700,
  color: "#f5f5f5"
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  fontWeight: 600,
  marginBottom: "1rem",
  color: "#e5e5e5"
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "0.5rem",
  fontSize: "0.9rem",
  textAlign: "left"
};

const tableHeaderRowStyle: React.CSSProperties = {
  borderBottom: "2px solid rgba(223, 186, 107, 0.15)"
};

const tableHeaderStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  color: "#a3a3a3",
  fontWeight: 600
};

const tableRowStyle: React.CSSProperties = {
  borderBottom: "1px solid rgba(223, 186, 107, 0.08)"
};

const tableColStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  color: "#d4d4d4"
};

/* ==========================================================================
   11. Triple Net (NNN) Lease Calculator
   ========================================================================== */
function NNNCalculator({ prefillParams = {} }: { prefillParams?: Record<string, string> }) {
  const [baseRent, setBaseRent] = useState(parseFloat(prefillParams.baseRent || "25"));
  const [rentType, setRentType] = useState<"annual_psf" | "annual_total" | "monthly_total">(
    (prefillParams.rentType as any) || "annual_psf"
  );
  const [sqft, setSqft] = useState(parseFloat(prefillParams.sqft || "5000"));
  const [taxes, setTaxes] = useState(parseFloat(prefillParams.taxes || "12000"));
  const [insurance, setInsurance] = useState(parseFloat(prefillParams.insurance || "3500"));
  const [cam, setCam] = useState(parseFloat(prefillParams.cam || "8500"));

  const results = calculateNNN(baseRent, rentType, sqft, taxes, insurance, cam);

  // Auto-update URL params without reloading
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("baseRent", baseRent.toString());
    params.set("rentType", rentType);
    params.set("sqft", sqft.toString());
    params.set("taxes", taxes.toString());
    params.set("insurance", insurance.toString());
    params.set("cam", cam.toString());
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [baseRent, rentType, sqft, taxes, insurance, cam]);

  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const psfFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  return (
    <div style={toolSplitterStyle}>
      <div style={toolLeftColStyle}>
        <h3 style={sectionHeadingStyle}>Lease Parameters</h3>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Base Rent Amount</label>
            <input
              type="number"
              style={inputStyle}
              value={baseRent}
              onChange={(e) => setBaseRent(parseFloat(e.target.value) || 0)}
              min="0"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Rent Type</label>
            <select
              style={inputStyle}
              value={rentType}
              onChange={(e) => setRentType(e.target.value as any)}
            >
              <option value="annual_psf">Annual Per Sq. Ft.</option>
              <option value="annual_total">Annual Total</option>
              <option value="monthly_total">Monthly Total</option>
            </select>
          </div>
        </div>

        <div style={formFieldStyle}>
          <label style={labelStyle}>Total Square Footage</label>
          <input
            type="number"
            style={inputStyle}
            value={sqft}
            onChange={(e) => setSqft(parseFloat(e.target.value) || 0)}
            min="0"
          />
        </div>

        <h3 style={{ ...sectionHeadingStyle, marginTop: "2rem" }}>Triple Net (NNN) Expenses</h3>
        <p style={{ color: "#a3a3a3", fontSize: "0.85rem", marginBottom: "1rem" }}>Enter your estimated or actual annual operating expenses for the property.</p>

        <div style={formFieldStyle}>
          <label style={labelStyle}>Annual Property Taxes (N1)</label>
          <input
            type="number"
            style={inputStyle}
            value={taxes}
            onChange={(e) => setTaxes(parseFloat(e.target.value) || 0)}
            min="0"
          />
        </div>

        <div style={formFieldStyle}>
          <label style={labelStyle}>Annual Building Insurance (N2)</label>
          <input
            type="number"
            style={inputStyle}
            value={insurance}
            onChange={(e) => setInsurance(parseFloat(e.target.value) || 0)}
            min="0"
          />
        </div>

        <div style={formFieldStyle}>
          <label style={labelStyle}>Annual CAM / Maintenance (N3)</label>
          <input
            type="number"
            style={inputStyle}
            value={cam}
            onChange={(e) => setCam(parseFloat(e.target.value) || 0)}
            min="0"
          />
        </div>
      </div>

      <div style={toolRightColStyle}>
        <h3 style={sectionHeadingStyle}>Lease Cost Breakdown</h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={metricCardStyle}>
            <div style={metricTitleStyle}>Total Monthly Payment</div>
            <div style={{ ...metricValueStyle, color: "#dfba6b" }}>{formatter.format(results.monthlyTotal)}</div>
            <div style={{ fontSize: "0.8rem", color: "#a3a3a3", marginTop: "0.25rem" }}>Base + NNN</div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricTitleStyle}>Total Annual Payment</div>
            <div style={{ ...metricValueStyle, color: "#22c55e" }}>{formatter.format(results.annualTotal)}</div>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "1.5rem" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#e5e5e5", marginBottom: "1rem" }}>Cost Per Square Foot</h4>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "#a3a3a3" }}>Annual Base Rent:</span>
            <span style={{ color: "#f5f5f5", fontWeight: 500 }}>{psfFormatter.format(results.annualBase / (sqft || 1))} / SF</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "#a3a3a3" }}>Annual NNN Fees:</span>
            <span style={{ color: "#f5f5f5", fontWeight: 500 }}>{psfFormatter.format(results.annualNnnPsf)} / SF</span>
          </div>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "0.75rem 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#dfba6b", fontWeight: 600 }}>Total Annual Cost:</span>
            <span style={{ color: "#dfba6b", fontWeight: 600 }}>{psfFormatter.format(results.annualTotalPsf)} / SF</span>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#e5e5e5", marginBottom: "1rem" }}>Monthly Payment Breakdown</h4>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "#a3a3a3" }}>Monthly Base Rent:</span>
            <span style={{ color: "#f5f5f5", fontWeight: 500 }}>{formatter.format(results.monthlyBase)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#a3a3a3" }}>Monthly NNN Fees:</span>
            <span style={{ color: "#f5f5f5", fontWeight: 500 }}>{formatter.format(results.monthlyTripleNet)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
