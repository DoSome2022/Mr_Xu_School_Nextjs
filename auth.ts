import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";

import { UserRole } from "@prisma/client";
import { getStaffUserById, getUserById } from "./data/user";
import authConfig from "./auth.config";

export const {
    handlers: {GET, POST},
    auth,
    signIn,
    signOut,
    
} = NextAuth({
    callbacks:{
        async session({token , session}) {
            console.log("-- Session token -- : " , { sessionToken: token.staff } ," -- End --")

            if(session.user && token.sub) {
                session.user.id = token.sub;
            }
            //session自定Field
            // session.user.customField = "自定Field"

            if(token.role && session.user) {
                session.user.role = token.role as UserRole
            }

            if(typeof token.staff !== "undefined" && session.user){
                session.user.staff = token.staff
            }

            if(typeof token.isadmin !== "undefined" && session.user){
                session.user.isadmin = token.isadmin
            }


            return session

        },
    
        async jwt({token}){
            if(!token.sub) return token

            const existingUser = await getStaffUserById(token.sub);
            if ( !existingUser ) return token;

            token.role = existingUser.role;

            // 將 staff 和 isadmin 添加到 token 
            token.staff = existingUser.Staff; 
            token.isadmin = existingUser.ISADMIN;

            return token

        },



    
},
    adapter: PrismaAdapter(db),
    session:{strategy:"jwt"},
    ...authConfig,

})