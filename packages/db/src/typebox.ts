import { Type, type Static } from "@sinclair/typebox";

export const CompanySchema = Type.Object({
  id:      Type.Number(),
  name:    Type.String(),
  logoUrl: Type.Union([Type.String(), Type.Null()]),
  website: Type.Union([Type.String(), Type.Null()]),
});

export const TechnologySchema = Type.Object({
  id:   Type.Number(),
  name: Type.String(),
});

export const JobBaseSchema = Type.Object({
  id:          Type.Number(),
  title:       Type.String(),
  description: Type.String(),
  workplace:   Type.Union([Type.Literal("remote"), Type.Literal("hybrid"), Type.Literal("onsite")]),
  workType:    Type.Union([Type.Literal("full-time"), Type.Literal("part-time"), Type.Literal("contract")]),
  seniority:   Type.Union([Type.Literal("junior"), Type.Literal("mid"), Type.Literal("senior")]),
  country:     Type.Union([Type.String(), Type.Null()]),
  city:        Type.Union([Type.String(), Type.Null()]),
  salaryMin:   Type.Union([Type.Number(), Type.Null()]),
  salaryMax:   Type.Union([Type.Number(), Type.Null()]),
  isFeatured:  Type.Union([Type.Boolean(), Type.Null()]),
  publishedAt: Type.Union([Type.String(), Type.Null()]),
});

export type Company    = Static<typeof CompanySchema>;
export type Technology = Static<typeof TechnologySchema>;
export type JobBase    = Static<typeof JobBaseSchema>;
