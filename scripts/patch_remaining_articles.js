const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config/tool-constants.json');
const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Freelance Tax Guides
const ftGuides = data.tools['freelance-tax'].guides;

ftGuides['freelance-deduction-tax-proofs'].content = [
  "### The Net Income Equation",
  "As a freelance software developer or independent consultant, you are taxed on your net profit, not your gross revenue. Understanding and tracking your allowable deductions is the single most effective way to lower your tax burden.",
  "The fundamental equation is:",
  "\\[ \\text{Net Profit} = \\text{Gross Revenue} - \\text{Allowable Deductions} \\]",
  "Reducing your net profit reduces both your state/federal income tax liability and your self-employment/social tax obligations.",
  "### Common Allowable Deductions for Tech Freelancers",
  "To be deductible, the IRS states an expense must be both 'ordinary and necessary' for your trade. For tech freelancers, this includes:",
  "1. **Software & Subscriptions**: IDE licenses (JetBrains), cloud hosting (AWS, Vercel), domain registration, and SaaS tools (GitHub, Figma, Notion).",
  "2. **Hardware & Gear**: Computers, monitors, mechanical keyboards, ergonomic desks, and chairs. These can be deducted immediately under Section 179 or depreciated over multiple years.",
  "3. **Home Office Deduction**: Calculated proportionally by the square footage of your dedicated workspace relative to your home's total square footage. Alternatively, use the IRS simplified flat-rate method ($5 per square foot up to 300 sq ft).",
  "4. **Professional Services**: CPA tax preparation fees, legal fees for drafting master service agreements (MSAs), and subcontractor costs.",
  "### The Self-Employment Tax Deduction Proof (US)",
  "In the United States, W-2 employees split payroll taxes with their employer (7.65% each). Self-employed individuals must pay the full 15.3% (Medicare + Social Security).",
  "However, the IRS allows you to deduct the employer-equivalent portion (half of your self-employment tax) when calculating your adjusted gross income (AGI):",
  "\\[ \\text{Net Earnings from Self-Employment} = \\text{Net Profit} \\times 0.9235 \\]",
  "\\[ \\text{SE Tax} = \\text{Net Earnings} \\times 0.153 \\]",
  "You then deduct 50% of the calculated SE Tax on Form 1040 (Schedule 1) before calculating your federal income tax bracket."
];
ftGuides['freelance-deduction-tax-proofs'].faqs = [
  { question: "What is the difference between gross revenue and net profit?", answer: "Gross revenue is the total amount of money clients pay you. Net profit is what remains after you subtract your business expenses. You only pay taxes on your net profit." },
  { question: "Can I deduct my home internet bill?", answer: "Yes, but only the percentage used for your business. If you use your home internet 60% for work and 40% for personal use, you can deduct 60% of the cost." },
  { question: "How does the self-employment tax deduction work?", answer: "The IRS allows you to deduct half of your 15.3% self-employment tax from your income before calculating your regular income tax, simulating the tax break given to traditional employers." }
];

ftGuides['gst-vat-thresholds-matrix'].content = [
  "### Global GST and VAT Registration Thresholds",
  "Tech freelancers selling digital goods or B2B services internationally must carefully track local sales tax registration thresholds. Once your gross turnover (revenue) exceeds these limits over a trailing 12-month period, you are legally required to register, collect, and remit sales tax/GST/VAT.",
  "| Jurisdiction | Sales Tax Name | Registration Threshold | Standard Rate |",
  "|---|---|---|---|",
  "| **United States** | Sales Tax (State-level) | Varies wildly. Usually $100k in gross sales or 200 separate transactions into a specific state (Economic Nexus). | 0% - 10% |",
  "| **United Kingdom** | Value Added Tax (VAT) | £90,000 (rolling 12 months) | 20% |",
  "| **Australia** | Goods and Services Tax (GST) | $75,000 AUD (annualized) | 10% |",
  "### Exporting Services & Zero-Rating",
  "For Australian and UK freelancers exporting software development services to overseas B2B clients (e.g., a UK developer contracting for a US-based corporation), the service is generally **zero-rated** (exempt from VAT/GST).",
  "However, there is a massive caveat: You must still track that zero-rated gross revenue. It counts toward your overall registration threshold. Once you cross the threshold, you must register for VAT/GST, even if all your clients are overseas and your effective tax collection rate remains 0%.",
  "### Reverse Charge Mechanism",
  "When providing B2B digital services internationally (especially within Europe), the 'Reverse Charge' mechanism shifts the liability of paying the VAT from the freelancer to the buyer. Always ensure your invoices explicitly state 'Reverse Charge Applies' when utilizing this."
];
ftGuides['gst-vat-thresholds-matrix'].faqs = [
  { question: "What happens if I cross the VAT/GST threshold mid-year?", answer: "Thresholds are usually calculated on a rolling 12-month basis. Once you exceed the limit, you generally have 30 days to officially register with the tax authority and begin charging tax on new invoices." },
  { question: "Do I charge VAT/GST to foreign clients?", answer: "Usually no. B2B services exported to foreign countries are typically 'zero-rated' or fall under the reverse charge mechanism. However, you must still be registered if your total global income exceeds the threshold." },
  { question: "What is Economic Nexus in the US?", answer: "In the US, you don't need a physical office in a state to owe them sales tax. Economic Nexus laws mean that if you sell a certain amount of digital goods into a state (e.g., $100,000), you must register and collect sales tax for that state." }
];

ftGuides['quarterly-estimated-tax-guide'].content = [
  "### What are Estimated Taxes?",
  "The tax system in most countries is 'pay-as-you-go'. Traditional W-2 employees have taxes automatically withheld from every paycheck. However, self-employed individuals and freelancers receive raw, untaxed payments from their clients.",
  "To comply with the pay-as-you-go system, freelancers must estimate their annual tax liability and pay it in four quarterly installments. This covers both regular income tax and self-employment/social security contributions.",
  "### US Quarterly Due Dates",
  "The IRS requires estimated payments on the following schedule (adjusted slightly if the date falls on a weekend or holiday):",
  "- **Q1 (Jan 1 - Mar 31):** Due April 15",
  "- **Q2 (Apr 1 - May 31):** Due June 15",
  "- **Q3 (Jun 1 - Aug 31):** Due September 15",
  "- **Q4 (Sep 1 - Dec 31):** Due January 15 (following year)",
  "### Calculating the Safe Harbor Rule",
  "Freelancer income is inherently volatile. How do you estimate taxes in April if you don't know what you'll earn in November? The IRS provides a 'Safe Harbor' rule to avoid underpayment penalties.",
  "To be shielded from penalties, your total quarterly payments must equal at least:",
  "1. **90%** of the tax you will actually owe for the current tax year, OR",
  "2. **100%** of the tax shown on your return for the *prior* year.",
  "*(Note: If your prior year's Adjusted Gross Income (AGI) was over $150,000, you must pay **110%** of the prior year's tax to qualify for the safe harbor).* Using the 100%/110% prior-year rule is the safest approach because the prior year's tax liability is a known, fixed number."
];
ftGuides['quarterly-estimated-tax-guide'].faqs = [
  { question: "What happens if I skip quarterly estimated taxes?", answer: "If you owe more than $1,000 at tax time and didn't make estimated payments, the IRS will assess an underpayment penalty, which accrues interest based on how late the payments were." },
  { question: "How do I calculate estimated taxes if my income fluctuates?", answer: "Use the 'Safe Harbor' rule based on the previous year's tax return. Simply divide last year's total tax liability by four and pay that amount each quarter to avoid penalties, regardless of current year fluctuations." },
  { question: "Do I have to pay estimated taxes in my first year of freelancing?", answer: "If you had zero tax liability in the previous year (e.g., you were a student), you generally do not have to pay estimated taxes in your first year. However, you will still owe a large lump sum in April." }
];

ftGuides['us-corp-vs-sole-proprietorship'].content = [
  "### Sole Proprietorship (Default)",
  "A sole proprietorship is the default state of freelancing. It requires no formal paperwork. All business income and expenses are reported on Schedule C of your personal tax return.",
  "The major downside: All net profits are subject to the full 15.3% self-employment tax, plus ordinary federal and state income tax. Furthermore, you have zero personal liability protection—if a client sues you, your personal assets (house, car) are at risk.",
  "### Single-Member LLC",
  "A single-member Limited Liability Company (LLC) establishes a legal wall between your personal assets and business liabilities. By default, the IRS treats a single-member LLC as a 'disregarded entity'. This means it is taxed exactly like a sole proprietorship.",
  "While it provides vital legal protection, forming a standard LLC provides absolutely no direct tax savings.",
  "### S-Corporation Election",
  "Once your net freelance earnings consistently exceed roughly $80,000 to $100,000, filing Form 2553 to elect S-Corp status can provide substantial, legal tax savings.",
  "#### The S-Corp Tax Saving Mechanism:",
  "1. You divide your business net income into two buckets: **Reasonable Salary** (W-2) and **Owner Distributions** (Dividends).",
  "2. You pay the heavy 15.3% self-employment/payroll taxes *only* on the Salary portion.",
  "3. The Distributions portion is completely exempt from self-employment taxes. It is only subject to regular income tax.",
  "#### S-Corp Drawbacks",
  "S-Corps come with significant overhead. You must run official payroll (using software like Gusto), file complex corporate tax returns (Form 1120-S), adhere to strict bookkeeping requirements, and pay unemployment taxes."
];
ftGuides['us-corp-vs-sole-proprietorship'].faqs = [
  { question: "Does forming an LLC save me money on taxes?", answer: "No. By default, a single-member LLC is a 'disregarded entity' and taxed exactly like a sole proprietorship. An LLC provides legal liability protection, not tax savings, unless you elect S-Corp status." },
  { question: "When should a freelancer switch to an S-Corp?", answer: "General consensus among CPAs is to consider an S-Corp when net profits exceed $80,000. Below that, the cost of running payroll and filing corporate tax returns outweighs the self-employment tax savings." },
  { question: "What is a 'reasonable salary' for an S-Corp?", answer: "The IRS requires S-Corp owners to pay themselves a salary comparable to what someone in their industry and geographic area would earn. You cannot pay yourself a $1 salary to evade payroll taxes." }
];

// Cron Visualizer Guides
const cvGuides = data.tools['cron-visualizer'].guides;
cvGuides['cron-syntax-ref-matrix'].content = [
  "### The Five Fields of standard Cron",
  "A standard Unix cron expression consists of five space-separated fields representing the time interval of execution. The scheduler evaluates these fields continuously to determine if a job should trigger.",
  "```",
  "*   *   *   *   *",
  "|   |   |   |   |",
  "|   |   |   |   +----- Day of the week (0 - 6) (Sunday=0)",
  "|   |   |   +--------- Month (1 - 12)",
  "|   |   +------------- Day of the month (1 - 31)",
  "|   +----------------- Hour (0 - 23)",
  "+--------------------- Minute (0 - 59)",
  "```",
  "### Special Operators",
  "- `*` (Asterisk): Matches any value in the field. For example, `*` in the hour field means 'run every hour'.",
  "- `,` (Comma): Separates a discrete list of values. `1,5` in the hour field means run exactly at 1:00 AM and 5:00 AM.",
  "- `-` (Hyphen): Defines an inclusive range of values. `1-5` in the day-of-week field means Monday through Friday.",
  "- `/` (Slash): Specifies step increments. `*/15` in the minute field means run every 15 minutes (0, 15, 30, 45).",
  "### Common Examples",
  "- `0 0 * * *`: Run once a day at midnight.",
  "- `0 2 * * 1-5`: Run at 2:00 AM every weekday.",
  "- `*/5 * * * *`: Run every 5 minutes.",
  "### The 'Day of Month' vs 'Day of Week' Conflict",
  "If both the Day of Month and Day of Week fields are restricted (not `*`), the command will execute when *either* field matches. For example, `0 0 13 * 5` runs at midnight on every Friday AND on the 13th of every month, not just on Friday the 13ths."
];
cvGuides['cron-syntax-ref-matrix'].faqs = [
  { question: "What does the asterisk (*) mean in cron?", answer: "The asterisk is a wildcard that means 'every'. If placed in the minute field, it means the job runs every minute. If placed in the month field, it runs every month." },
  { question: "How do I run a cron job every 15 minutes?", answer: "Use the step operator (/) in the minute field: '*/15 * * * *'. This tells the scheduler to execute the job at minute 0, 15, 30, and 45 of every hour." },
  { question: "What day is 0 in a cron expression?", answer: "In standard Unix cron, 0 represents Sunday. Interestingly, 7 also represents Sunday, making both valid." }
];

cvGuides['non-standard-cron-implementations'].content = [
  "### Linux Vixie Cron vs. Modern Schedulers",
  "Standard Unix (Vixie) cron uses 5 fields. However, as cloud computing evolved, scheduling requirements became more precise, leading to non-standard implementations with 6 or 7 fields.",
  "#### AWS CloudWatch / EventBridge",
  "AWS cron syntax uses 6 fields: `cron(Minutes Hours Day-of-month Month Day-of-week Year)`. Notably, AWS requires that you cannot specify `*` in both the Day-of-month and Day-of-week fields simultaneously. One must be replaced with a question mark `?` to indicate 'no specific value'.",
  "#### Quartz Scheduler (Java / Spring)",
  "The Quartz scheduler uses 7 fields, adding a seconds field at the very beginning and an optional year field at the end. This allows for sub-minute precision, which standard cron cannot achieve.",
  "### systemd Timers: The Modern Linux Alternative",
  "On modern Linux systems, systemd timers (`.timer` units coupled with `.service` units) are rapidly replacing standard cron jobs. They offer massive advantages for sysadmins:",
  "1. **Monotonic Timers**: Timers can run tasks relative to boot time (`OnBootSec=`) or service activation, rather than relying on strict calendar time (`OnCalendar=`).",
  "2. **Detailed Logging**: Console output from triggered services is captured automatically in `journald`, eliminating the need to pipe output to `/var/log/syslog` manually.",
  "3. **Resource Control**: Jobs triggered by systemd can be heavily throttled using cgroups to prevent background tasks from starving the CPU of foreground applications."
];
cvGuides['non-standard-cron-implementations'].faqs = [
  { question: "Why does AWS cron use a question mark (?)", answer: "AWS uses 6 fields and requires the question mark to resolve conflicts between the Day-of-month and Day-of-week fields. If you specify a day of the month, you must use ? for the day of the week, and vice versa." },
  { question: "Can standard cron run jobs every second?", answer: "No. Standard Unix cron has a maximum resolution of one minute. To run jobs by the second, you must use systemd timers, the Quartz scheduler, or write a loop script with a sleep command." },
  { question: "Why are systemd timers better than cron?", answer: "Systemd timers integrate directly into journalctl for logging, can trigger based on system events rather than just clocks, and can restrict CPU and RAM usage via cgroups." }
];

cvGuides['cron-edge-cases-simulations'].content = [
  "### The Leap Year Edge Case",
  "Scheduling logic often breaks on edge cases related to month lengths. If a cron job is scheduled with `0 0 29 2 *` (Midnight on February 29th), the standard scheduler will literally only execute it once every four years. If you meant 'the last day of February', standard cron has no built-in operator for 'last day of the month'.",
  "*(Note: Some advanced schedulers like Quartz support the `L` character to indicate the last day).* ",
  "### Daylight Saving Time (DST) Disasters",
  "DST transitions are the source of major scheduler bugs and data corruption:",
  "1. **Spring Forward (The Lost Hour)**: During the spring transition, the clock typically skips from 1:59 AM straight to 3:00 AM. Any cron job scheduled during that 2:XX AM window (e.g., `30 2 * * *`) **may never execute**. The system clock simply steps over it.",
  "2. **Fall Back (The Duplicate Hour)**: During the autumn transition, the clock repeats the hour from 1:00 AM to 2:00 AM. Any job scheduled in this window **will run twice**.",
  "### The Universal Mitigation Strategy",
  "For mission-critical production servers, the golden rule of sysadmin architecture is to always configure server system clocks and application cron schedulers to run on **Coordinated Universal Time (UTC)**. UTC does not observe daylight saving shifts, guaranteeing that every minute occurs exactly once per day, forever."
];
cvGuides['cron-edge-cases-simulations'].faqs = [
  { question: "What happens to cron jobs when Daylight Saving Time springs forward?", answer: "Because the clock skips an hour (usually from 2 AM to 3 AM), any cron job scheduled specifically during that lost hour will be skipped entirely for that day." },
  { question: "How do I ensure cron jobs run reliably despite DST?", answer: "The standard industry practice is to set all server hardware clocks, operating system time zones, and cron daemon configurations exclusively to UTC." },
  { question: "How do I schedule a cron job for the last day of the month?", answer: "Standard cron cannot do this natively. You must schedule the job to run every day between the 28th and 31st, and use a bash evaluation within the command itself: `[ \"$(date +%d -d tomorrow)\" = \"01\" ] && ./script.sh`" }
];

cvGuides['optimizing-cron-load-distribution'].content = [
  "### The Midnight CPU Spike Problem",
  "A common anti-pattern among developers is defaulting to scheduling daily cron tasks exactly at midnight: `0 0 * * *`. If a server hosts 50 distinct cron tasks, or if you have a fleet of 100 servers all pulling updates, triggering them all at exactly `00:00:00` causes massive thundering-herd problems.",
  "This leads to severe CPU spikes, database table locking, and potential API rate-limiting failures from upstream providers.",
  "### The Staggering Principle",
  "To optimize infrastructure load, distribute your cron executions evenly across off-peak minutes. Shift the minutes and hours manually:",
  "- **Database Backup Job**: `12 2 * * *` (2:12 AM)",
  "- **Log Cleanup Routine**: `37 3 * * *` (3:37 AM)",
  "- **Analytics Compilation**: `43 4 * * *` (4:43 AM)",
  "This ensures the CPU and disk I/O return to idle states between heavy tasks.",
  "### Adding Random Jitter",
  "For clustered services running identical cron schedules (like 50 load-balanced web servers all trying to hit a central database for configuration updates), manually staggering schedules is tedious.",
  "Instead, add a random start delay (jitter) within the script execution itself. This forces the nodes to spread their load over a defined window:",
  "```bash\n#!/bin/bash\n# Sleep for a random number of seconds between 1 and 60\nsleep $(( RANDOM % 60 + 1 ))\n# Run the actual task\npython3 heavy_database_sync.py\n```"
];
cvGuides['optimizing-cron-load-distribution'].faqs = [
  { question: "What is the thundering herd problem in scheduling?", answer: "It occurs when many automated processes or servers are scheduled to execute exactly at the same time (e.g., midnight), causing massive resource spikes that can crash databases or network switches." },
  { question: "How do I avoid overlapping cron jobs?", answer: "Stagger the start times by using unusual minute values (like 17 or 42) instead of round numbers, and ensure long-running scripts use lock files (like `flock`) to prevent multiple instances from running concurrently." },
  { question: "What is cron jitter?", answer: "Jitter is a technique where a script intentionally pauses for a random amount of time before executing its primary payload. It helps distribute server load organically across a cluster." }
];

// Write back
fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
console.log('FT and CV guides patched.');
