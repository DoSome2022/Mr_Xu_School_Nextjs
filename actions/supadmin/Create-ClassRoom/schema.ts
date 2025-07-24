import { z } from "zod";

export const SupCreateClassRoomSchema = z.object({
    room : z.string(),
    supadminId : z.string(),
})