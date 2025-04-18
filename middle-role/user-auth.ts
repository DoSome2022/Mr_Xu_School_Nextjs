import authConfig_login from "@/auth.config_login";
import NextAuth from "next-auth";

const {auth} = NextAuth(authConfig_login)

export const UserAuth = {auth};
