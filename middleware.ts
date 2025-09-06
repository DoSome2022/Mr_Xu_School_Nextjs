
// import { auth } from "./auth";


// export default auth((req) => {

//     const publicRoutes = ["/", "/login", "/stafflogin","/hide/createMainAdmin"];
//     const currentPath = req.nextUrl.pathname;

//     if (!req.auth && !publicRoutes.includes(currentPath)) {
//         console.log("要登入")
//         const newUrl = new URL("/",req.nextUrl.origin)
//         return Response.redirect(newUrl)
//     }
// })




// export const config = {
//     matcher: ['/((?!.+\\.[\\w]+$|_next).*)','/','/(api|trpc)(.*)'],
// }


import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  const publicRoutes = ["/", "/login", "/stafflogin", "/hide/createMainAdmin", "/forgot-password", "/reset-password"];
  const adminRoutes = ["/admin", "/admin/(.*)"];
  const teacherRoutes = ["/teacher/(.*)"];
  const supadminRoutes = ["/supadmin/(.*)"];

  const currentPath = nextUrl.pathname;

  // 如果是公开路由，直接放行
  if (publicRoutes.includes(currentPath)) {
    return NextResponse.next();
  }

  // 如果未登录且不是公开路由，重定向到登录页
  if (!isLoggedIn) {
    console.log("需要登录");
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  // 获取用户角色
  const role = req.auth?.user?.role;
  console.log("当前用户角色:", role, "访问路径:", currentPath);

  // 检查管理员路由
  if (adminRoutes.some(route => currentPath.startsWith(route))) {
    if (role === "ADMIN") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/unauthorized", nextUrl.origin));
  }

  // 检查教师路由
  if (teacherRoutes.some(route => currentPath.startsWith(route))) {
    if (role === "TEACHER") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/unauthorized", nextUrl.origin));
  }

  // 检查超级管理员路由
  if (supadminRoutes.some(route => currentPath.startsWith(route))) {
    if (role === "SUPADMIN") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/unauthorized", nextUrl.origin));
  }

  // 默认放行其他已认证请求
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};