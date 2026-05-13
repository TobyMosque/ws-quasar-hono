import { faker } from "@faker-js/faker";
import { db, schema } from "./index.ts";

const TECHNOLOGIES = [
  "Vue.js", "Nuxt.js", "TypeScript", "JavaScript",
  "Pinia", "Vite", "Tailwind CSS", "GraphQL",
  "Node.js", "Hono", "PostgreSQL", "Docker",
];

const WORKPLACES = ["remote", "hybrid", "onsite"] as const;
const WORK_TYPES = ["full-time", "part-time", "contract"] as const;
const SENIORITIES = ["junior", "mid", "senior"] as const;
const COUNTRIES = ["United States", "Germany", "Netherlands", "Brazil", "Canada", "United Kingdom"];

async function seed() {
  const existing = await db.select().from(schema.jobs).limit(1);
  if (existing.length > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  // companies
  const insertedCompanies = await db
    .insert(schema.companies)
    .values(
      Array.from({ length: 10 }, () => ({
        name: faker.company.name(),
        logoUrl: faker.image.avatarGitHub(),
        website: faker.internet.url(),
      }))
    )
    .returning();

  // technologies
  const insertedTechs = await db
    .insert(schema.technologies)
    .values(TECHNOLOGIES.map(name => ({ name })))
    .returning();

  // jobs
  const insertedJobs = await db
    .insert(schema.jobs)
    .values(
      Array.from({ length: 50 }, () => {
        const company = faker.helpers.arrayElement(insertedCompanies);
        const country = faker.helpers.arrayElement(COUNTRIES);
        const salaryDisclosed = faker.datatype.boolean(0.6);
        const salaryMin = salaryDisclosed ? faker.number.int({ min: 40, max: 100 }) * 1000 : null;
        const salaryMax = salaryMin ? salaryMin + faker.number.int({ min: 10, max: 40 }) * 1000 : null;

        return {
          companyId: company.id,
          title: `${faker.helpers.arrayElement(["Senior", "Mid-Level", "Junior"])} Vue.js Developer`,
          description: faker.lorem.paragraphs(3),
          workplace: faker.helpers.arrayElement(WORKPLACES),
          workType: faker.helpers.arrayElement(WORK_TYPES),
          seniority: faker.helpers.arrayElement(SENIORITIES),
          country,
          city: faker.location.city(),
          salaryMin,
          salaryMax,
          isFeatured: faker.datatype.boolean(0.15),
          publishedAt: faker.date.recent({ days: 30 }),
        };
      })
    )
    .returning();

  // job_technologies (2-4 techs per job)
  await db.insert(schema.jobTechnologies).values(
    insertedJobs.flatMap(job => {
      const techs = faker.helpers.arrayElements(insertedTechs, { min: 2, max: 4 });
      return techs.map(tech => ({ jobId: job.id, technologyId: tech.id }));
    })
  );

  console.log(
    `Seeded: ${insertedCompanies.length} companies, ${insertedTechs.length} technologies, ${insertedJobs.length} jobs.`
  );
}

seed().catch(console.error);
