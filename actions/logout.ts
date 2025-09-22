"use server";

import { signOut } from "@/auth";

export const logout_action = async () => {
    await signOut();
}