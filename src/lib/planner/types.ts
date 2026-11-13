import { z } from "zod";
import type { Country, RetreatType } from "@/data/site";

export const experienceIds = [
  "yoga",
  "art",
  "business",
  "golf",
  "interest",
  "scotland",
] as const satisfies readonly RetreatType[];
export const roomingOptions = [
  "Private rooms",
  "Shared rooms",
  "Flexible",
  "Help me decide",
] as const;
export const timingModes = ["dates", "month", "season", "flexible"] as const;
export const seasons = ["Spring", "Summer", "Autumn", "Winter"] as const;
export const cateringOptions = [
  "Let's discuss the options",
  "Fully catered with hosts",
  "Accommodation only (Buchlyvie)",
] as const;
export const budgetOptions = [
  "Not yet decided",
  "Under £10,000",
  "£10,000–£25,000",
  "£25,000–£50,000",
  "£50,000–£100,000",
  "£100,000+",
] as const;
export const addOnOptions = [
  { id: "dining", label: "Chef-prepared dining" },
  { id: "practice", label: "Yoga & wellness space" },
  { id: "workshops", label: "Creative workshops" },
  { id: "excursions", label: "Guided excursions" },
  { id: "transfers", label: "Airport transfers" },
  { id: "team", label: "Team activities" },
] as const;
export const planningStages = [
  "Just exploring",
  "Developing my retreat",
  "Ready to discuss venues",
  "Looking to secure dates",
] as const;

export type DestinationChoice = Country | "Help me choose";
export type AddOnId = (typeof addOnOptions)[number]["id"];

/** Everything the visitor chooses. Contains no personal contact details. */
export type PlannerAnswers = {
  experiences: RetreatType[];
  guests: number | null; // total including leaders; null = not sure yet
  leaders: number;
  leadersNeedRooms: boolean;
  rooming: (typeof roomingOptions)[number];
  destination: DestinationChoice;
  venue: string | null; // venue slug
  timingMode: (typeof timingModes)[number];
  startDate: string;
  endDate: string;
  month: number | null; // 1-12
  season: (typeof seasons)[number] | null;
  nights: number | null; // null = open to advice
  addOns: AddOnId[];
  catering: (typeof cateringOptions)[number];
  budget: (typeof budgetOptions)[number];
  planningStage: (typeof planningStages)[number] | null;
  ideaNotes: string;
};

export const defaultAnswers: PlannerAnswers = {
  experiences: [],
  guests: null,
  leaders: 1,
  leadersNeedRooms: true,
  rooming: "Flexible",
  destination: "Help me choose",
  venue: null,
  timingMode: "flexible",
  startDate: "",
  endDate: "",
  month: null,
  season: null,
  nights: null,
  addOns: [],
  catering: "Let's discuss the options",
  budget: "Not yet decided",
  planningStage: null,
  ideaNotes: "",
};

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please add your name.").max(120),
  email: z.string().trim().email("Please add a valid email address.").max(200),
  organisation: z.string().trim().max(160).optional().default(""),
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[+\d\s().-]*$/, "Please use digits, spaces and + only.")
    .optional()
    .default(""),
  requirements: z.string().trim().max(2000).optional().default(""),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please confirm you're happy for us to store your brief." }),
  }),
});
export type ContactDetails = z.input<typeof contactSchema>;

/** Server-side payload: answers are re-validated, plus anti-spam fields. */
export const enquirySchema = z.object({
  contact: contactSchema,
  answers: z.object({
    experiences: z.array(z.enum(experienceIds)).max(6),
    guests: z.number().int().min(1).max(200).nullable(),
    leaders: z.number().int().min(0).max(20),
    leadersNeedRooms: z.boolean(),
    rooming: z.enum(roomingOptions),
    destination: z.string().max(40),
    venue: z.string().max(60).nullable(),
    timingMode: z.enum(timingModes),
    startDate: z.string().max(20),
    endDate: z.string().max(20),
    month: z.number().int().min(1).max(12).nullable(),
    season: z.enum(seasons).nullable(),
    nights: z.number().int().min(1).max(60).nullable(),
    addOns: z.array(z.string().max(30)).max(10),
    catering: z.enum(cateringOptions),
    budget: z.enum(budgetOptions),
    planningStage: z.enum(planningStages).nullable(),
    ideaNotes: z.string().max(2000),
  }),
  brief: z.string().max(10000),
  website: z.string().max(0, "Spam check failed."), // honeypot: must stay empty
  startedAt: z.number().int(),
});
export type EnquiryPayload = z.infer<typeof enquirySchema>;
