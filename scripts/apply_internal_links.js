const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config/tool-constants.json');
const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// The dictionary maps specific keywords to the relative URLs of related guides.
const internalLinks = [
  { keyword: "CIDR", url: "/tools/subnet-calculator/cidr-notation-guide" },
  { keyword: "subnet mask", url: "/tools/subnet-calculator/subnet-mask-reference-table" },
  { keyword: "DSCR", url: "/tools/coc-yield/dscr-guidelines-banks" },
  { keyword: "Cap Rate", url: "/tools/coc-yield/cap-rate-vs-coc-yield" },
  { keyword: "Triple Net", url: "/tools/nnn-calculator/nnn-vs-gross-lease" },
  { keyword: "First-Match", url: "/tools/firewall-validator/firewall-rule-order-proofs" },
  { keyword: "systemd", url: "/tools/cron-visualizer/non-standard-cron-implementations" }
];

let replacementCount = 0;

// Iterate through all tools and their guides
Object.values(data.tools).forEach((tool) => {
  if (!tool.guides) return;
  
  Object.values(tool.guides).forEach((guide) => {
    if (!guide.content) return;
    
    // Process each markdown block in the guide
    guide.content = guide.content.map(block => {
      // Don't link inside code blocks or headers
      if (block.startsWith('###') || block.startsWith('`') || block.startsWith('|')) return block;
      
      let newBlock = block;
      
      internalLinks.forEach(link => {
        // Skip linking to the exact same page we are currently on
        if (guide.title.toLowerCase().includes(link.keyword.toLowerCase())) return;

        // Regex to find the keyword strictly as a standalone word (case insensitive), 
        // ensuring it is not already inside a markdown link [keyword](url).
        // Negative lookahead (?![^\[]*\]) ensures we don't match words inside brackets
        const regex = new RegExp(`\\b(${link.keyword})\\b(?![^\\[]*\\])`, "i");
        
        if (regex.test(newBlock)) {
          // Replace only the first occurrence per block to avoid keyword stuffing
          newBlock = newBlock.replace(regex, `[$1](${link.url})`);
          replacementCount++;
        }
      });
      
      return newBlock;
    });
  });
});

fs.writeFileSync(configPath, JSON.stringify(data, null, 2));

console.log(`Internal linking complete! Inserted ${replacementCount} new contextual markdown links across the JSON configuration.`);
