const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config/tool-constants.json');
const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const fwGuides = data.tools['firewall-validator'].guides;

// 1. firewall-rule-order-proofs
fwGuides['firewall-rule-order-proofs'].content = [
  "### The Principle of First-Match Parsing",
  "The most critical concept in firewall architecture is 'First-Match'. Firewalls parse Access Control Lists (ACLs) sequentially from top to bottom. The very first rule that successfully matches a packet's metadata (source IP, destination IP, protocol, and port) dictates the firewall's action (Pass, Block, or Reject).",
  "Once a match is made, the firewall stops parsing the rest of the list. Any rules below the matching rule are completely ignored for that specific packet.",
  "### What is Rule Shadowing?",
  "Rule shadowing is a severe logical vulnerability that occurs when a broad rule is placed higher in the ACL than a narrower, more specific rule.",
  "Because of First-Match parsing, the broad rule intercepts all traffic that the specific rule was meant to handle. The specific rule becomes 'shadowed'—it is effectively dead code and will never be evaluated.",
  "#### Example of Shadowing Vulnerability:",
  "- **Rule 1 (Top):** `Pass Protocol TCP Source Any Destination Any Port 80`",
  "- **Rule 2 (Bottom):** `Block Protocol TCP Source 192.168.1.50 Destination Any Port 80`",
  "In this scenario, a network administrator intended to block IP `192.168.1.50` from accessing web traffic (Rule 2). However, because Rule 1 broadly permits all HTTP traffic and sits above Rule 2, the firewall will pass the malicious traffic and never reach the block command.",
  "### Redundancy vs. Shadowing",
  "It is important to distinguish between shadowing and redundancy:",
  "- **Shadowing:** A broad rule neutralizes a specific rule, potentially creating a massive security hole.",
  "- **Redundancy:** A rule is identical to, or narrower than, a rule above it that executes the *same action*. While redundancy doesn't alter the security policy, it bloats the firewall table, consuming CPU cycles and slowing down packet throughput.",
  "### Mitigation Strategy",
  "To prevent shadowing, always structure your ACLs from most specific at the top to most general at the bottom. Deny rules targeting specific malicious IPs should sit near the very top of the list."
];
fwGuides['firewall-rule-order-proofs'].faqs = [
  { question: "What does First-Match mean in firewall terms?", answer: "First-Match means the firewall processes rules top-down and immediately executes the action of the first rule that matches the packet, ignoring all subsequent rules." },
  { question: "Why is rule shadowing dangerous?", answer: "Shadowing can inadvertently expose networks by allowing broad 'pass' rules to override specific 'block' rules, neutralizing intended security policies." },
  { question: "How should I order my firewall rules?", answer: "Always place your most specific rules (like blocking a single IP) at the top of the list, and your most broad rules (like passing all outbound web traffic) at the bottom." }
];

// 2. common-port-vulnerabilities
fwGuides['common-port-vulnerabilities'].content = [
  "### The Anatomy of Network Ports",
  "A network port is a logical construct that identifies a specific process or service on a machine. While IP addresses identify the machine itself, ports identify the application receiving the data. There are 65,535 available ports in TCP/UDP.",
  "### High-Risk Ports Reference Matrix",
  "When validating firewall rules and performing threat modeling, ensure that the following ports are strictly denied from public internet ingress. They should only be accessible via trusted internal subnets or encrypted VPN tunnels:",
  "| Port | Protocol | Common Service | Primary Risk / Attack Vector |",
  "|---|---|---|---|",
  "| `20/21` | TCP | FTP | Cleartext transmission of usernames, passwords, and data payloads. Highly susceptible to packet sniffing. |",
  "| `22` | TCP | SSH | Automated botnet brute-force attacks and dictionary credentials guessing. |",
  "| `23` | TCP | Telnet | Completely unencrypted remote administration. Trivial to eavesdrop and hijack sessions. |",
  "| `3389` | TCP | RDP | Windows Remote Desktop is heavily targeted by ransomware syndicates for unauthorized entry. |",
  "| `445` | TCP | SMB | Used for Windows file sharing. Exploits like EternalBlue (WannaCry) spread laterally via this port. |",
  "| `1433` | TCP | MSSQL | Direct database exposure allows for SQL injection and brute-forcing of the 'sa' admin account. |",
  "### Hardening and Mitigation Recommendations",
  "To secure these services, implement a 'Default-Deny' inbound posture. If remote administration is required, never expose RDP or SSH directly to the internet.",
  "Instead, require administrators to authenticate to an IPsec or WireGuard VPN first. Once tunneled into the internal network, they can access the management ports securely.",
  "Additionally, implement Rate Limiting (fail2ban) on internal SSH ports to thwart lateral brute-force attempts."
];
fwGuides['common-port-vulnerabilities'].faqs = [
  { question: "Why is exposing port 3389 dangerous?", answer: "Port 3389 is the default for Windows RDP. It is highly targeted by automated ransomware scripts that brute-force passwords to gain full control of servers." },
  { question: "What does a Default-Deny posture mean?", answer: "Default-Deny is a security principle where the firewall automatically drops all inbound traffic unless a specific rule explicitly permits it." },
  { question: "How can I securely manage servers remotely?", answer: "Instead of opening management ports to the internet, use an encrypted VPN. Connect to the VPN first, then access the servers as if you were on the local network." }
];

// 3. cisco-acl-syntax-guide
fwGuides['cisco-acl-syntax-guide'].content = [
  "### Demystifying Cisco Access Control Lists",
  "Cisco IOS firewalls and routers utilize Access Control Lists (ACLs) to filter traffic. Understanding their syntax is critical for network engineers.",
  "### Standard vs. Extended ACLs",
  "- **Standard ACLs (Numbered 1-99 and 1300-1999):** These are rudimentary filters that can *only* evaluate the source IP address. They cannot filter by destination or protocol type.",
  "- **Extended ACLs (Numbered 100-199 and 2000-2699):** Highly granular filters capable of evaluating source IP, destination IP, protocol (TCP/UDP/ICMP), and specific port numbers.",
  "### The Inverse Logic of Wildcard Masks",
  "Cisco ACLs do not use standard subnet masks (e.g., `255.255.255.0`). Instead, they use Wildcard Masks, which operate on inverse boolean logic.",
  "In a wildcard mask:",
  "- A `0` bit tells the router: **Match this exactly.**",
  "- A `1` bit tells the router: **Ignore this bit (I don't care).**",
  "#### Calculating a Wildcard Mask",
  "The fastest way to calculate a wildcard mask is to subtract the standard subnet mask from a theoretical `255.255.255.255` address.",
  "**Mathematical Proof for a /26 Subnet:**",
  "```",
  "  255.255.255.255 (Absolute Maximum)",
  "- 255.255.255.192 (Standard /26 Subnet Mask)",
  "-----------------",
  "  0  . 0 . 0 . 63 (Resulting Wildcard Mask)",
  "```",
  "### Syntax Examples in Production",
  "To permit web traffic (port 80) from a specific `/26` subnet to any external destination, the syntax is:",
  "`access-list 101 permit tcp 192.168.1.0 0.0.0.63 any eq 80`",
  "To block a single malicious host using the `host` keyword shortcut (equivalent to a `0.0.0.0` wildcard mask):",
  "`access-list 101 deny ip host 10.5.5.50 any`"
];
fwGuides['cisco-acl-syntax-guide'].faqs = [
  { question: "What is the difference between standard and extended Cisco ACLs?", answer: "Standard ACLs only filter based on the source IP address. Extended ACLs can filter based on source, destination, protocol, and port numbers." },
  { question: "How do wildcard masks differ from subnet masks?", answer: "Wildcard masks use inverse logic. A 0 means 'must match' and a 1 means 'ignore'. They are calculated by subtracting the subnet mask from 255.255.255.255." },
  { question: "What does the 'host' keyword do in a Cisco ACL?", answer: "The 'host' keyword is a shortcut that replaces a 0.0.0.0 wildcard mask. It tells the router to match that single specific IP address exactly." }
];

// 4. opnsense-alias-best-practices
fwGuides['opnsense-alias-best-practices'].content = [
  "### What are Firewall Aliases?",
  "Aliases in modern firewalls like OPNsense and pfSense are named, logical groups of network objects (IPs, CIDR subnets, port numbers, or hostnames).",
  "Instead of writing 50 separate firewall rules to block 50 known malicious IPs, an administrator can create a single alias named `Blacklisted_IPs`, populate it with the 50 addresses, and write a single firewall rule referencing that alias.",
  "### Architecture and Performance Benefits",
  "Under the hood, OPNsense uses the FreeBSD packet filter (`pf`). When an alias is utilized, `pf` compiles the contents of the alias into highly optimized, binary lookup tables in kernel memory.",
  "1. **CPU Efficiency**: Single rules matching against compiled binary tables execute logarithmically faster than parsing linear lists of individual rules.",
  "2. **Memory Conservation**: Multiple rules can reference the same alias table, dramatically reducing memory bloat compared to duplicating IP strings.",
  "3. **Dynamic Updates**: Table contents can be updated without forcing the entire firewall ruleset to reload and drop active stateful connections.",
  "### Types of Aliases in OPNsense",
  "- **Host(s)**: A static list of individual IP addresses.",
  "- **Network(s)**: A static list of CIDR subnets (e.g., `10.0.0.0/24`).",
  "- **Port(s)**: A list of TCP or UDP port numbers (e.g., `80, 443, 8080`).",
  "- **URL Table (IPs)**: An incredibly powerful alias type that periodically downloads a plaintext list of IPs from an external URL. This is the core mechanism used for integrating dynamic Threat Intelligence feeds and geo-blocking lists.",
  "### Best Practices for Maintenance",
  "Always nest your aliases logically. Create generic aliases (like `Web_Servers` and `DB_Servers`) and group them into larger meta-aliases (like `All_Internal_Servers`). This modular approach ensures your firewall rule page remains clean, readable, and highly auditable."
];
fwGuides['opnsense-alias-best-practices'].faqs = [
  { question: "What is a firewall alias?", answer: "An alias is a logical container that holds multiple IPs, subnets, or ports under a single name, simplifying rule creation and management." },
  { question: "Why do aliases improve firewall performance?", answer: "Aliases compile their contents into optimized binary lookup tables in the kernel. Checking a table is much faster and uses less CPU than parsing hundreds of separate text-based rules." },
  { question: "What is a URL Table alias in OPNsense?", answer: "A URL Table alias automatically fetches lists of IPs from a remote server on a schedule. It is widely used to block dynamic malicious IP feeds automatically." }
];

fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
console.log('Firewall guides patched.');
