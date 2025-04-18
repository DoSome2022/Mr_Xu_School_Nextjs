import { z } from "zod";

export const Score_Create_Schema = z.object({
    school_score_id : z.string(),
    grade : z.number(),
    subject : z.string(),
    score : z .number(),
    quarter : z.number(),
    school_name : z.string(),
})