const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config/tool-constants.json');
const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const subnetGuides = data.tools['subnet-calculator'].guides;

// 1. cidr-notation-guide
subnetGuides['cidr-notation-guide'].content = [
  "### What is CIDR and Why Was It Created?",
  "Classless Inter-Domain Routing (CIDR) was introduced in 1993 to replace the older, rigid class-based routing system (Class A, B, and C). The internet was rapidly running out of IP addresses because assigning a full Class B network (65,534 hosts) to an organization that only needed 1,000 addresses resulted in massive waste.",
  "CIDR allows for variable-length subnet masking (VLSM), meaning network administrators can allocate IP address blocks that precisely match their requirements.",
  "### Understanding the Suffix Syntax",
  "A CIDR address looks like this: `192.168.1.0/24`. The number after the slash (`/24`) is the prefix length. It dictates how many bits (from left to right) of the 32-bit IPv4 address are locked as the *network portion*. The remaining bits are the *host portion*.",
  "Since an IPv4 address is 32 bits long, a `/24` prefix means:",
  "- **Network Bits**: 24",
  "- **Host Bits**: 32 - 24 = 8",
  "#### Binary Mask Breakdown for /24:",
  "`11111111 . 11111111 . 11111111 . 00000000`",
  "Translated to decimal, this binary sequence is exactly `255.255.255.0`.",
  "### Number of Hosts Calculation",
  "To calculate the total number of usable host addresses for a given CIDR suffix `N`, we use the following standard formula:",
  "\\[ \\text{Usable Hosts} = 2^{(32 - N)} - 2 \\]",
  "#### Why Subtract Two?",
  "In any IPv4 subnet, the very first and very last addresses cannot be assigned to hosts like computers or servers:",
  "1. **Network Address**: The first address (where all host bits are `0`). It identifies the network itself.",
  "2. **Broadcast Address**: The last address (where all host bits are `1`). It is used to send broadcast packets to all hosts on that subnet.",
  "### Real-World Example: /26 Subnet",
  "If you are assigned the network `10.0.0.0/26`:",
  "- Subnet Mask: `255.255.255.192`",
  "- Host Bits: `32 - 26 = 6`",
  "- Total IPs: `2^6 = 64`",
  "- Usable Hosts: `64 - 2 = 62`",
  "The usable IP range will be from `10.0.0.1` to `10.0.0.62`, with `10.0.0.63` serving as the broadcast address."
];
subnetGuides['cidr-notation-guide'].faqs = [
  { question: "What does the slash number mean in CIDR?", answer: "The slash number (e.g., /24) represents the number of leading 1-bits in the subnet mask. It tells routers how many bits represent the network identity, leaving the rest for individual devices." },
  { question: "Why do we subtract 2 when calculating usable hosts?", answer: "The first address in a subnet is reserved as the network identifier, and the last address is reserved as the broadcast address for sending packets to all hosts simultaneously." },
  { question: "Can a CIDR prefix be /32?", answer: "Yes. A /32 prefix indicates that all 32 bits are locked, meaning there are zero host bits. It represents a single, specific IP address, commonly called a host route." }
];

// 2. ipv4-subnetting-proofs
subnetGuides['ipv4-subnetting-proofs'].content = [
  "### Subnetting via Boolean Algebra",
  "Subnetting relies heavily on the bitwise Logical AND operation. When a computer or router wants to determine if another destination IP is on its local subnet (meaning it can communicate directly without a gateway), it performs a bitwise AND between the destination IP address and its own subnet mask.",
  "#### The AND Rule Basics:",
  "- `1 AND 1 = 1`",
  "- `1 AND 0 = 0`",
  "- `0 AND 1 = 0`",
  "- `0 AND 0 = 0`",
  "If the result of this AND operation matches the device's own network address, the destination is local. If it differs, the packet is sent to the default gateway.",
  "### Mathematical Proof of Subnet Counts",
  "When you 'borrow' bits from the host portion of an IP address to create smaller subnets, the math follows strict powers of two.",
  "Let `b` equal the number of borrowed bits.",
  "Let `h` equal the original number of host bits before borrowing.",
  "\\[ \\text{Created Subnets} = 2^b \\]",
  "\\[ \\text{Hosts per Subnet} = 2^{(h - b)} - 2 \\]",
  "### Example Proof: Breaking a /24 into /27s",
  "Imagine you start with a `/24` network (`192.168.1.0/24`). You need to create smaller `/27` subnets.",
  "1. **Borrowed Bits (`b`)**: You are moving from a `/24` to a `/27`. That means you borrowed `27 - 24 = 3` bits.",
  "2. **Subnets Created**: `2^3 = 8` subnets.",
  "3. **Hosts per Subnet**: The new suffix is 27, leaving `32 - 27 = 5` host bits. So, `2^5 - 2 = 30` usable hosts per subnet.",
  "### Magic Number Technique",
  "To quickly calculate subnet boundaries without binary math, network engineers use the 'Magic Number' method. The magic number is found by subtracting the interesting octet of the subnet mask from 256.",
  "For a `/27` mask (`255.255.255.224`), the interesting octet is 224.",
  "`256 - 224 = 32`",
  "Therefore, your subnets will increment in blocks of 32: `.0`, `.32`, `.64`, `.96`, and so on."
];
subnetGuides['ipv4-subnetting-proofs'].faqs = [
  { question: "What is the bitwise AND operation in networking?", answer: "It is a binary logic operation where the router compares an IP address and a subnet mask bit-by-bit. If both bits are 1, the result is 1; otherwise, it is 0. This reveals the underlying network address." },
  { question: "What is the 'Magic Number' in subnetting?", answer: "The magic number is a shortcut for finding subnet boundaries. By subtracting the non-255 octet of a subnet mask from 256, you determine the block size or increment of the subnets." },
  { question: "How many subnets are created if I borrow 4 bits?", answer: "Borrowing 4 bits creates 2^4, which equals 16 separate subnets." }
];

// 3. subnet-mask-reference-table
subnetGuides['subnet-mask-reference-table'].content = [
  "### CIDR to Subnet Mask Reference Table",
  "Use this comprehensive lookup table to quickly reference common subnet divisions for IPv4 routing. This covers prefixes from `/16` down to `/32`.",
  "| CIDR Prefix | Subnet Mask | Wildcard Mask | Total IPs | Usable Hosts | Typical Use Case |",
  "|---|---|---|---|---|---|",
  "| `/32` | `255.255.255.255` | `0.0.0.0` | 1 | 1 | Single Host Route / Loopback |",
  "| `/31` | `255.255.255.254` | `0.0.0.1` | 2 | 2 | Point-to-Point Links (RFC 3021) |",
  "| `/30` | `255.255.255.252` | `0.0.0.3` | 4 | 2 | Legacy Point-to-Point Router Links |",
  "| `/29` | `255.255.255.248` | `0.0.0.7` | 8 | 6 | Small Office WAN / Edge Interfaces |",
  "| `/28` | `255.255.255.240` | `0.0.0.15` | 16 | 14 | Small Department LAN |",
  "| `/27` | `255.255.255.224` | `0.0.0.31` | 32 | 30 | Medium Department / Server Racks |",
  "| `/26` | `255.255.255.192` | `0.0.0.63` | 64 | 62 | Large Floor / Guest Wi-Fi Segments |",
  "| `/25` | `255.255.255.128` | `0.0.0.127` | 128 | 126 | Half of a standard Class C block |",
  "| `/24` | `255.255.255.0` | `0.0.0.255` | 256 | 254 | Standard Home/Office Network |",
  "| `/23` | `255.255.254.0` | `0.0.1.255` | 512 | 510 | Enterprise Branch Campus |",
  "| `/22` | `255.255.252.0` | `0.0.3.255` | 1024 | 1022 | Large Enterprise LAN |",
  "| `/16` | `255.255.0.0` | `0.0.255.255` | 65536 | 65534 | Massive Corporate Wide Area Network |",
  "### Understanding /31 Point-to-Point Links",
  "Traditionally, a `/30` subnet was used to connect two routers together because it provided 4 IPs (1 network, 2 usable, 1 broadcast). However, RFC 3021 introduced the `/31` subnet specifically for point-to-point links.",
  "In a `/31` subnet, the network and broadcast address rules are suspended. There are only two IPs, and both are completely usable, saving address space on large ISP backbones."
];
subnetGuides['subnet-mask-reference-table'].faqs = [
  { question: "What is a /32 subnet used for?", answer: "A /32 represents a single, distinct IP address. It is frequently used for loopback interfaces on routers or defining specific host routes in routing tables." },
  { question: "How does a /31 subnet work without a broadcast address?", answer: "Under RFC 3021, on point-to-point links, broadcast addresses are unnecessary because there are only two endpoints on the wire. Thus, both IPs in a /31 are assigned to the two routers." },
  { question: "Why is /24 the most common subnet mask?", answer: "/24 aligns perfectly with the 8-bit octet boundaries of an IPv4 address, making it incredibly easy for humans to read and segment. It provides 254 usable hosts, which fits most standard office environments." }
];

// 4. supernetting-vs-subnetting
subnetGuides['supernetting-vs-subnetting'].content = [
  "### Subnetting: Dividing and Conquering",
  "Subnetting is the process of taking a single, large block of IP addresses and partitioning it into multiple smaller, logically isolated networks. This is the foundation of local area network (LAN) design.",
  "**Primary Goals of Subnetting:**",
  "1. **Reduce Broadcast Domains**: Large networks with thousands of hosts suffer from 'broadcast storms' that cripple performance. Subnetting restricts broadcasts to smaller groups.",
  "2. **Enhance Security**: By separating traffic (e.g., HR data vs. Guest Wi-Fi), you can place firewalls and access control lists (ACLs) between the subnets.",
  "3. **Address Conservation**: Avoid wasting large blocks of IPs on small departments.",
  "### Supernetting: Aggregation and Efficiency",
  "Supernetting (also known as Route Aggregation or CIDR Blocks) is the exact opposite of subnetting. It involves combining multiple contiguous smaller networks into a single larger routing entry with a shorter prefix.",
  "For example, instead of a router advertising four separate `/24` networks to the internet core:",
  "- `192.168.0.0/24`",
  "- `192.168.1.0/24`",
  "- `192.168.2.0/24`",
  "- `192.168.3.0/24`",
  "It can advertise a single supernet route: `192.168.0.0/22`.",
  "**Primary Goals of Supernetting:**",
  "1. **Reduce Routing Table Size**: Without route aggregation, core internet routers would run out of memory trying to store millions of individual subnet routes.",
  "2. **Increase Routing Speed**: Smaller routing tables mean faster lookup times and lower latency for packets.",
  "### The Strict Rules of Supernetting",
  "You cannot simply combine random subnets. To create a valid supernet, the target networks must meet three mathematical conditions:",
  "1. **Contiguous Block**: The networks must be perfectly sequential in address space with no gaps.",
  "2. **Power of Two Count**: You can only combine networks in multiples of powers of two (2, 4, 8, 16, etc.). You cannot supernet three /24s into a single clean route.",
  "3. **Boundary Alignment**: The first subnet in the block must start on a boundary address that is cleanly divisible by the total number of subnets being combined."
];
subnetGuides['supernetting-vs-subnetting'].faqs = [
  { question: "What is route aggregation?", answer: "Route aggregation is another term for supernetting. It is the process of summarizing multiple smaller IP prefixes into a single larger prefix to reduce the size of routing tables." },
  { question: "Why can't I supernet three /24 networks together?", answer: "Because supernetting relies on binary logic, the number of combined networks must be a power of two. Three is not a power of two, so it cannot be summarized cleanly with a single subnet mask." },
  { question: "Does supernetting affect local LAN traffic?", answer: "No. Supernetting is primarily a routing protocol optimization (BGP, OSPF). It affects how routers advertise paths to other routers, not how local hosts communicate." }
];

fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
console.log('Subnet guides patched.');
