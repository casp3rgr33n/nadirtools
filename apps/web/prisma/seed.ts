import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['info', 'query', 'warn', 'error'],
});

async function main() {
  console.log('Starting seeding...');
  
  const cisco = await prisma.brand.upsert({
    where: { slug: 'cisco' },
    update: {},
    create: {
      name: 'Cisco',
      slug: 'cisco',
      description: 'Enterprise networking and telecommunications equipment.',
    },
  });

  const catalyst9300 = await prisma.hardwareModel.upsert({
    where: { slug: 'catalyst-9300' },
    update: {},
    create: {
      name: 'Catalyst 9300 Series',
      slug: 'catalyst-9300',
      description: 'Enterprise-class stackable access switches.',
      brandId: cisco.id,
    },
  });

  await prisma.errorCode.upsert({
    where: { slug: 'err-disable-bpduguard' },
    update: {},
    create: {
      code: 'ERR-DISABLE-BPDUGUARD',
      slug: 'err-disable-bpduguard',
      description: 'Port was disabled due to receiving a BPDU when BPDU Guard was enabled.',
      severity: 'Critical',
      solution: 'Investigate the network topology for loops or rogue switches. Once resolved, run "shutdown" followed by "no shutdown" on the interface, or wait for the errdisable recovery timer if configured.',
      hardwareModelId: catalyst9300.id,
    },
  });
  
  await prisma.errorCode.upsert({
    where: { slug: 'poe-fault-4' },
    update: {},
    create: {
      code: 'ILPOWER-5-IEEE_DISCONNECT',
      slug: 'poe-fault-4',
      description: 'IEEE PD disconnected. A powered device (PD) was disconnected from the PoE port.',
      severity: 'Info',
      solution: 'No action required unless the disconnection was unexpected. Verify the cable and the PD.',
      hardwareModelId: catalyst9300.id,
    },
  });

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
