import { programs } from "@/data/programs";

export const interestOptions: string[] = [
  ...programs.map((program) => program.title),
  "Campus tour",
];
