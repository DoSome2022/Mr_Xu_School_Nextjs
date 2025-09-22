import { z } from "zod";

export const CreateClassRoomSchema = z.object({
    room : z.string()
})