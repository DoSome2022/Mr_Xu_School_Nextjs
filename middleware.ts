
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";
import { auth } from "./auth";


export default auth((req) => {

    const publicRoutes = ["/", "/login", "/stafflogin","/hide/createMainAdmin"];
    const currentPath = req.nextUrl.pathname;

    if (!req.auth && !publicRoutes.includes(currentPath)) {
        console.log("要登入")
        const newUrl = new URL("/",req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
})




export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)','/','/(api|trpc)(.*)'],
}