import authConfig_stafflogin from "@/auth.config_stafflogin";
import NextAuth from "next-auth";

const {auth} = NextAuth(authConfig_stafflogin)

export const staffAuth = {auth};
