import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DIRECT_URL!,
  },
  migrations: {
    adapter: () =>
      Promise.resolve(
        new PrismaPg({ connectionString: process.env.DIRECT_URL! }),
      ),
  },
});
