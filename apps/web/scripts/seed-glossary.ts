import { prisma } from "../lib/prisma";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Seeding Database with AI Generated Glossary...");

  // Read the JSON file
  const dataPath = path.join(process.cwd(), "scripts", "glossary_data.json");
  const terms = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  // We want to drip publish 2 terms per day, starting from yesterday
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 1); // Yesterday

  let currentPublishDate = new Date(startDate);

  for (let i = 0; i < terms.length; i++) {
    const term = terms[i];
    
    // Assign the publish date
    term.publishAt = new Date(currentPublishDate);

    // Increment date by 1 day every 2 terms
    if ((i + 1) % 2 === 0) {
      currentPublishDate.setDate(currentPublishDate.getDate() + 1);
    }

    await prisma.glossaryTerm.upsert({
      where: { slug: term.slug },
      update: term,
      create: term,
    });

    console.log(`[Inserted] ${term.title} -> Publishes: ${term.publishAt.toDateString()}`);
  }

  console.log("Seeding complete! Staggered publishing dates applied.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
