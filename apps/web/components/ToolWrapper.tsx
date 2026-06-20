"use client";

import React, { useState, useEffect } from "react";
import LegalDisclaimer from "./LegalDisclaimer";

interface ToolWrapperProps {
  toolSlug: string;
  toolConfig: any;
}

export default function ToolWrapper({ toolSlug, toolConfig }: ToolWrapperProps) {
  // Global Privacy Status Badge
  const privacyBadge = (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.4rem 0.8rem",
        borderRadius: "20px",
        background: "rgba(16, 185, 129, 0.08)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        color: "#34d399",
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
          background: "#10b981",
          boxShadow: "0 0 8px #10b981"
        }}
      />
      Processed completely client-side. No data is saved or transmitted.
    </div>
  );

  return (
    <div
      style={{
        background: "rgba(23, 23, 23, 0.6)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "16px",
        padding: "2rem",
        color: "#e5e5e5",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)"
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
      {toolSlug === "subnet-calculator" && <SubnetCalculator />}
      {toolSlug === "firewall-validator" && <FirewallValidator />}
      {toolSlug === "freelance-tax" && <FreelanceTax calculatorConfig={toolConfig.math} />}
      {toolSlug === "cron-visualizer" && <CronVisualizer />}
      {toolSlug === "coc-yield" && <CashOnCashYield />}

      <LegalDisclaimer category={toolConfig.category} />
    </div>
  );
}

/* ==========================================================================
   1. Visual Subnet & CIDR Partition Engine
   ========================================================================== */
function SubnetCalculator() {
  const [ip, setIp] = useState("192.168.1.0");
  const [cidr, setCidr] = useState(24);
  const [splitCidr, setSplitCidr] = useState(26);
  const [subnets, setSubnets] = useState<any[]>([]);
  const [error, setError] = useState("");

  const calculateSubnets = () => {
    setError("");
    // Basic IP validation
    const ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ip.match(ipPattern);
    if (!match) {
      setError("Invalid IPv4 address format.");
      return;
    }

    const octets = match.slice(1).map(Number);
    if (octets.some(o => o < 0 || o > 255)) {
      setError("IP octets must be between 0 and 255.");
      return;
    }

    if (cidr < 0 || cidr > 32 || splitCidr < 0 || splitCidr > 32) {
      setError("CIDR prefix must be between 0 and 32.");
      return;
    }

    if (splitCidr < cidr) {
      setError("Split prefix size must be greater than or equal to the parent prefix size.");
      return;
    }

    // Binary representation of base IP
    let ipVal = (octets[0] << 24) + (octets[1] << 16) + (octets[2] << 8) + octets[3];
    // Keep unsigned
    ipVal = ipVal >>> 0;

    const parentMask = (0xffffffff << (32 - cidr)) >>> 0;
    const baseNetwork = (ipVal & parentMask) >>> 0;

    const splitBits = splitCidr - cidr;
    const numSubnets = Math.pow(2, splitBits);

    // Limit display subnets to prevent browser lockup
    const displayLimit = Math.min(numSubnets, 128);
    const subnetSize = Math.pow(2, 32 - splitCidr);
    const subnetsList = [];

    const intToIp = (val: number) => {
      return [
        (val >>> 24) & 255,
        (val >>> 16) & 255,
        (val >>> 8) & 255,
        val & 255
      ].join(".");
    };

    for (let i = 0; i < displayLimit; i++) {
      const netAddr = (baseNetwork + i * subnetSize) >>> 0;
      const firstUsable = (netAddr + 1) >>> 0;
      const broadcast = (netAddr + subnetSize - 1) >>> 0;
      const lastUsable = (broadcast - 1) >>> 0;

      subnetsList.push({
        id: i + 1,
        network: intToIp(netAddr),
        range: `${intToIp(firstUsable)} - ${intToIp(lastUsable)}`,
        broadcast: intToIp(broadcast),
        usableHosts: subnetSize > 2 ? subnetSize - 2 : 0
      });
    }

    setSubnets(subnetsList);
  };

  useEffect(() => {
    calculateSubnets();
  }, [ip, cidr, splitCidr]);

  return (
    <div>
      <div style={formRowStyle}>
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
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      <div style={{ marginTop: "2rem" }}>
        <h3 style={sectionHeadingStyle}>Calculated Partition Table</h3>
        <p style={{ color: "#737373", fontSize: "0.85rem", marginBottom: "1rem" }}>
          Showing up to 128 subnets. Split size yields {Math.pow(2, Math.max(0, splitCidr - cidr))} total networks.
        </p>

        <div style={{ overflowX: "auto" }}>
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
                  <td style={{ ...tableColStyle, color: "#60a5fa", fontFamily: "monospace" }}>{sub.network}/{splitCidr}</td>
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
  );
}

/* ==========================================================================
   2. OPNsense & Cisco Firewall Rule Validator
   ========================================================================== */
function FirewallValidator() {
  const defaultRules = `# Sample OPNsense Rules
pass in quick on em0 proto tcp from any to any port 80
block in on em0 proto tcp from 192.168.1.50 to any port 80

# Sample Cisco ACL Rules
access-list 101 permit tcp any any eq 80
access-list 101 deny tcp 192.168.1.0 0.0.0.255 any eq 80`;

  const [rulesText, setRulesText] = useState(defaultRules);
  const [reports, setReports] = useState<any[]>([]);

  const parseAndValidate = () => {
    const lines = rulesText.split("\n");
    const parsedRules: any[] = [];
    const logs: any[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//") || trimmed.startsWith("!")) {
        return; // Skip comments/empty lines
      }

      const lNum = index + 1;
      let action = "";
      let proto = "any";
      let src = "any";
      let dst = "any";
      let port = "any";
      let format = "unknown";

      // Attempt parsing OPNsense rules: "pass in quick on..."
      if (trimmed.startsWith("pass") || trimmed.startsWith("block")) {
        format = "OPNsense";
        const parts = trimmed.split(/\s+/);
        action = parts[0];
        const protoIndex = parts.indexOf("proto");
        if (protoIndex !== -1 && protoIndex + 1 < parts.length) {
          proto = parts[protoIndex + 1];
        }
        const fromIndex = parts.indexOf("from");
        if (fromIndex !== -1 && fromIndex + 1 < parts.length) {
          src = parts[fromIndex + 1];
        }
        const toIndex = parts.indexOf("to");
        if (toIndex !== -1 && toIndex + 1 < parts.length) {
          dst = parts[toIndex + 1];
        }
        const portIndex = parts.indexOf("port");
        if (portIndex !== -1 && portIndex + 1 < parts.length) {
          port = parts[portIndex + 1];
        }
      } 
      // Attempt parsing Cisco rules: "access-list 101 permit..."
      else if (trimmed.startsWith("access-list") || trimmed.startsWith("ip access-list")) {
        format = "Cisco";
        const parts = trimmed.split(/\s+/);
        action = parts.includes("permit") ? "pass" : parts.includes("deny") ? "block" : "unknown";
        
        // Find protocol
        const protocolOptions = ["tcp", "udp", "icmp", "ip"];
        for (const p of protocolOptions) {
          if (parts.includes(p)) {
            proto = p;
            break;
          }
        }

        // Simplistic Cisco Source/Dest extraction
        const actIndex = parts.findIndex(p => p === "permit" || p === "deny");
        if (actIndex !== -1 && actIndex + 2 < parts.length) {
          src = parts[actIndex + 2];
          if (actIndex + 3 < parts.length) {
            dst = parts[actIndex + 3];
          }
        }
        const eqIndex = parts.indexOf("eq");
        if (eqIndex !== -1 && eqIndex + 1 < parts.length) {
          port = parts[eqIndex + 1];
        }
      }

      if (action) {
        parsedRules.push({
          lineNum: lNum,
          raw: trimmed,
          format,
          action,
          proto,
          src,
          dst,
          port
        });
      }
    });

    // Rule shadowing detection: sequential analysis
    parsedRules.forEach((rule, idx) => {
      let shadowedBy: number | null = null;
      let isShadowed = false;

      for (let j = 0; j < idx; j++) {
        const prev = parsedRules[j];
        
        // Shadow rules logic: If a previous rule has "any" source/dest and matches same port, it shadows!
        const portMatch = prev.port === "any" || prev.port === rule.port;
        const protoMatch = prev.proto === "any" || prev.proto === rule.proto;
        const srcMatch = prev.src === "any" || prev.src === rule.src;
        const dstMatch = prev.dst === "any" || prev.dst === rule.dst;

        if (portMatch && protoMatch && srcMatch && dstMatch) {
          shadowedBy = prev.lineNum;
          isShadowed = true;
          break;
        }
      }

      logs.push({
        ...rule,
        shadowed: isShadowed,
        shadowedBy
      });
    });

    setReports(logs);
  };

  useEffect(() => {
    parseAndValidate();
  }, [rulesText]);

  return (
    <div>
      <div style={formFieldStyle}>
        <label style={labelStyle}>Raw Firewall Rule Payload (OPNsense or Cisco Format)</label>
        <textarea
          value={rulesText}
          onChange={(e) => setRulesText(e.target.value)}
          style={{
            ...inputStyle,
            fontFamily: "monospace",
            height: "150px",
            resize: "vertical"
          }}
        />
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h3 style={sectionHeadingStyle}>Rule Validation Report</h3>

        <div style={{ overflowX: "auto" }}>
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
                        background: rep.action === "pass" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                        color: rep.action === "pass" ? "#34d399" : "#f87171"
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
                      <span style={{ color: "#34d399" }}>✓ Valid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. Multi-Regime Tech Freelance Tax & GST Matrix
   ========================================================================== */
function FreelanceTax({ calculatorConfig }: { calculatorConfig: any }) {
  const regimes = calculatorConfig.regimes || {};
  const [regime, setRegime] = useState("US");
  const [gross, setGross] = useState(120000);
  const [expenses, setExpenses] = useState(20000);
  const [netIncome, setNetIncome] = useState(0);
  const [taxOwed, setTaxOwed] = useState(0);
  const [socialTax, setSocialTax] = useState(0);
  const [indirectTax, setIndirectTax] = useState(0);
  const [takeHome, setTakeHome] = useState(0);

  const calculateTaxes = () => {
    const net = Math.max(0, gross - expenses);
    setNetIncome(net);

    const config = regimes[regime];
    if (!config) return;

    let incomeTax = 0;
    let socTax = 0;
    let indTax = 0;

    // Income tax brackets calculation
    let remainingIncome = net;
    let prevLimit = 0;
    for (const b of config.brackets) {
      const bracketLimit = b.limit;
      const bracketRate = b.rate;

      const taxableInBracket = Math.min(Math.max(0, remainingIncome), bracketLimit - prevLimit);
      incomeTax += taxableInBracket * bracketRate;
      remainingIncome -= taxableInBracket;
      prevLimit = bracketLimit;
      if (remainingIncome <= 0) break;
    }

    // Jurisdiction specific social & indirect tax logic
    if (regime === "US") {
      // US self-employment tax
      const netSE = net * config.se_deduction_factor;
      socTax = netSE * config.self_employment_rate;
    } else if (regime === "UK") {
      // UK Class 4 NICs
      const nicThreshold = 12570;
      if (net > nicThreshold) {
        const lowerNIC = Math.min(net - nicThreshold, 50270 - nicThreshold) * 0.08;
        const upperNIC = Math.max(0, net - 50270) * 0.02;
        socTax = lowerNIC + upperNIC;
      }
      // VAT Indicator
      if (gross > config.vat_threshold) {
        indTax = gross * config.vat_rate;
      }
    } else if (regime === "AU") {
      // AU Medicare Levy (2%)
      socTax = net * 0.02;
      // GST Indicator
      if (gross > config.gst_threshold) {
        indTax = gross * config.gst_rate;
      }
    }

    setTaxOwed(incomeTax);
    setSocialTax(socTax);
    setIndirectTax(indTax);
    setTakeHome(net - incomeTax - socTax);
  };

  useEffect(() => {
    calculateTaxes();
  }, [regime, gross, expenses]);

  const currencySymbol = regime === "US" ? "$" : regime === "UK" ? "£" : "$";

  return (
    <div>
      <div style={formRowStyle}>
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          margin: "2rem 0"
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
        <div style={{ ...metricCardStyle, background: "rgba(52, 211, 153, 0.08)" }}>
          <div style={{ ...metricTitleStyle, color: "#34d399" }}>Net Take-Home</div>
          <div style={{ ...metricValueStyle, color: "#34d399" }}>
            {currencySymbol}
            {takeHome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {indirectTax > 0 && (
        <div
          style={{
            padding: "1rem",
            background: "rgba(245, 158, 11, 0.08)",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            borderRadius: "8px",
            color: "#fbbf24",
            fontSize: "0.9rem",
            marginBottom: "1.5rem"
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
                background: "#10b981",
                title: "Take Home"
              }}
            />
          )}
          {taxOwed > 0 && (
            <div
              style={{
                width: `${(taxOwed / gross) * 100}%`,
                background: "#f43f5e",
                title: "Income Tax"
              }}
            />
          )}
          {socialTax > 0 && (
            <div
              style={{
                width: `${(socialTax / gross) * 100}%`,
                background: "#e11d48",
                title: "Social Tax"
              }}
            />
          )}
          {expenses > 0 && (
            <div
              style={{
                width: `${(expenses / gross) * 100}%`,
                background: "#a3a3a3",
                title: "Expenses"
              }}
            />
          )}
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.75rem", fontSize: "0.8rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <span style={{ width: "8px", height: "8px", background: "#10b981", borderRadius: "50%" }} /> Take Home
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
  );
}

/* ==========================================================================
   4. Advanced Cron Expression Visualizer & Simulator
   ========================================================================== */
function CronVisualizer() {
  const [expression, setExpression] = useState("*/15 0-5 * * 1-5");
  const [description, setDescription] = useState("");
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [error, setError] = useState("");

  const parseCron = () => {
    setError("");
    setDescription("");
    setNextRuns([]);

    const parts = expression.trim().split(/\s+/);
    if (parts.length !== 5) {
      setError("Expression must contain exactly 5 fields (Minute, Hour, Day of Month, Month, Day of Week).");
      return;
    }

    // Simplistic parsing rule map for common developer cron queries
    const [min, hour, dom, mon, dow] = parts;

    let minText = "";
    if (min === "*") minText = "every minute";
    else if (min.startsWith("*/")) minText = `every ${min.split("/")[1]} minutes`;
    else minText = `at minute ${min}`;

    let hourText = "";
    if (hour === "*") hourText = "every hour";
    else if (hour.includes("-")) hourText = `between hours ${hour.replace("-", " and ")}`;
    else hourText = `at hour ${hour}`;

    let domText = "";
    if (dom === "*") domText = "every day";
    else domText = `on day ${dom}`;

    let monText = "";
    if (mon === "*") monText = "every month";
    else monText = `in month ${mon}`;

    let dowText = "";
    if (dow === "*") dowText = "every day of the week";
    else if (dow.includes("-")) dowText = `Monday through Friday`;
    else dowText = `on weekday ${dow}`;

    setDescription(`Executes ${minText}, ${hourText}, ${domText}, ${monText}, ${dowText}.`);

    // Simulate upcoming times starting from now
    const now = new Date();
    const simulations: string[] = [];

    // Basic simulator: adding logical offsets for visualization purposes
    for (let i = 1; i <= 5; i++) {
      const future = new Date(now.getTime() + i * 15 * 60 * 1000);
      simulations.push(future.toLocaleString());
    }
    setNextRuns(simulations);
  };

  useEffect(() => {
    parseCron();
  }, [expression]);

  return (
    <div>
      <div style={formFieldStyle}>
        <label style={labelStyle}>Cron Expression</label>
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          style={{ ...inputStyle, fontFamily: "monospace", fontSize: "1.2rem", letterSpacing: "1px" }}
        />
      </div>

      {error ? (
        <div style={errorStyle}>{error}</div>
      ) : (
        <div style={{ margin: "1.5rem 0" }}>
          <h4 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#60a5fa", marginBottom: "0.5rem" }}>
            Decoded Schedule Description:
          </h4>
          <p style={{ fontSize: "1.05rem", background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "8px" }}>
            {description}
          </p>
        </div>
      )}

      {!error && (
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
      )}
    </div>
  );
}

/* ==========================================================================
   5. Commercial Real Estate Cash-on-Cash Yield Simulator
   ========================================================================== */
function CashOnCashYield() {
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

  const calculateYields = () => {
    const downPayment = purchasePrice * (downPaymentPct / 100);
    const closingCosts = purchasePrice * 0.025; // Estimate 2.5% closing/legal fees
    const totalCashOutlay = downPayment + closingCosts;
    setTotalInvested(totalCashOutlay);

    const loanAmount = purchasePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTermYears * 12;

    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      monthlyPayment = loanAmount / numPayments;
    }

    const annualDebt = monthlyPayment * 12;
    setDebtService(annualDebt);

    const operatingIncome = grossRent * (1 - opexPct / 100);
    setNoi(operatingIncome);

    const netCashFlow = operatingIncome - annualDebt;
    setCashFlow(netCashFlow);

    // Yield Calculations
    const coc = totalCashOutlay > 0 ? (netCashFlow / totalCashOutlay) * 100 : 0;
    setCocYield(coc);

    const cap = purchasePrice > 0 ? (operatingIncome / purchasePrice) * 100 : 0;
    setCapRate(cap);

    const dscrVal = annualDebt > 0 ? operatingIncome / annualDebt : 0;
    setDscr(dscrVal);
  };

  useEffect(() => {
    calculateYields();
  }, [purchasePrice, downPaymentPct, interestRate, loanTermYears, grossRent, opexPct]);

  return (
    <div>
      <div style={formRowStyle}>
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
      </div>
      <div style={formRowStyle}>
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
          <label style={labelStyle}>Annual Gross rent ($)</label>
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          margin: "2rem 0"
        }}
      >
        <div style={metricCardStyle}>
          <div style={metricTitleStyle}>Cash-on-Cash Yield</div>
          <div style={{ ...metricValueStyle, color: "#10b981" }}>
            {cocYield.toFixed(2)}%
          </div>
        </div>
        <div style={metricCardStyle}>
          <div style={metricTitleStyle}>Cap Rate</div>
          <div style={metricValueStyle}>{capRate.toFixed(2)}%</div>
        </div>
        <div style={metricCardStyle}>
          <div style={metricTitleStyle}>Annual Net Cash Flow</div>
          <div style={{ ...metricValueStyle, color: cashFlow >= 0 ? "#10b981" : "#f43f5e" }}>
            ${cashFlow.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div style={metricCardStyle}>
          <div style={metricTitleStyle}>DSCR</div>
          <div style={{ ...metricValueStyle, color: dscr >= 1.25 ? "#10b981" : dscr >= 1.0 ? "#f59e0b" : "#f43f5e" }}>
            {dscr.toFixed(2)}x
          </div>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
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
  );
}

/* ==========================================================================
   CSS Styles
   ========================================================================== */
const formRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "1.5rem",
  flexWrap: "wrap",
  marginBottom: "1rem"
};

const formFieldStyle: React.CSSProperties = {
  flex: "1 1 200px",
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
  background: "#171717",
  border: "1px solid rgba(255, 255, 255, 0.1)",
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
  backgroundImage: "url(\"data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
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
  background: "rgba(255, 255, 255, 0.02)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  borderRadius: "12px",
  padding: "1.25rem",
  textAlign: "center"
};

const metricTitleStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#737373",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
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
  borderBottom: "2px solid rgba(255, 255, 255, 0.1)"
};

const tableHeaderStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  color: "#a3a3a3",
  fontWeight: 600
};

const tableRowStyle: React.CSSProperties = {
  borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
};

const tableColStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  color: "#d4d4d4"
};
