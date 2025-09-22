// "use client";

// import * as z from "zod";
// import { useState, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Input } from "@/components/ui/input";

// import { Button } from "@/components/ui/button";

// import { 
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage 
// } from "@/components/ui/form";
// import { useSearchParams } from "next/navigation";
// import { Login_Schema } from "@/schemas"; 
// import { User_login_action } from "@/actions/user-login ";
// import { Checkbox } from "@/components/ui/checkbox";

// const userlogin = () => {

//     const searchParams = useSearchParams();
//     const [ isPending, startTransition ] = useTransition(); 

//     const stafflogin_form = useForm<z.infer<typeof Login_Schema>>({
//         resolver: zodResolver(Login_Schema),
//         defaultValues:{
//             username: "",
//             password: "",
//         }
//     })

//     const login_form_onSubmit = (values:z.infer<typeof Login_Schema>) => {
//         console.log("-- 用家輸入 -- : ",values,"-- End --")

//         startTransition(() => {
//             User_login_action(values)
//         })

//     }

//    return (
//     <div className="min-h-screen flex items-center justify-center bg-[#80A8BD] p-4">
//       <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-lg">
//         <h1 className="text-3xl font-bold text-white text-center mb-6">登入頁面</h1>
//         <Form {...stafflogin_form}>
//           <form
//             onSubmit={stafflogin_form.handleSubmit(login_form_onSubmit)}
//             className="space-y-6"
//           >
//             <div className="space-y-4">
//               <FormField
//                 control={stafflogin_form.control}
//                 name="username"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">用戶名稱</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入用戶名稱"
//                         type="text"
//                         className="bg-white/20 text-white placeholder:text-gray-300 border-none rounded-md focus:ring-2 focus:ring-cyan-200 transition-all duration-300"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-cyan-200" />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="space-y-4">
//               <FormField
//                 control={stafflogin_form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">密碼</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入密碼"
//                         type="password"
//                         className="bg-white/20 text-white placeholder:text-gray-300 border-none rounded-md focus:ring-2 focus:ring-cyan-200 transition-all duration-300"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-cyan-200" />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <Button
//               disabled={isPending}
//               type="submit"
//               className="w-full bg-blue-300 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
//             >
//               登入
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }

// export default userlogin


// User_login.tsx
"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSearchParams, useRouter } from "next/navigation";
import { Login_Schema } from "@/schemas";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

import Link from "next/link";
import { User_login_action } from "@/actions/user-login ";

const User_login = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const urlError = searchParams.get("error") === "AccountNotLinked" ? "用戶名已被其他提供者使用！" : "";
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const login_form = useForm<z.infer<typeof Login_Schema>>({
    resolver: zodResolver(Login_Schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const login_form_onSubmit = (values: z.infer<typeof Login_Schema>) => {
    console.log("-- 用戶輸入 -- : ", values, "-- End --");
    setError("");
    setSuccess("");

    startTransition(() => {
      User_login_action(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
        if (data?.success && data?.role && data?.id) {
          switch (data.role) {
            case "PARENT":
              router.push(`/parent/${data.id}`);
              break;
            case "USER":
              router.push(`/user/${data.id}`);
              break;
            default:
              setError("無效的角色");
              break;
          }
        }
      });
    });
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#80A8BD] p-4">
      <Link href="/" className="absolute top-4 left-4 text-white">
        返回
      </Link>
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">用戶登入頁面</h1>
        <Form {...login_form}>
          <form onSubmit={login_form.handleSubmit(login_form_onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={login_form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">用戶名稱</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="輸入用戶名稱"
                          type="text"
                          className="pl-10 bg-white/20 text-white placeholder:text-gray-300 border-none rounded-md focus:ring-2 focus:ring-cyan-200 transition-all duration-300"
                        />
                        <svg
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                          />
                        </svg>
                      </div>
                    </FormControl>
                    <FormMessage className="text-cyan-200" />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={login_form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">密碼</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="輸入密碼"
                          type="password"
                          className="pl-10 bg-white/20 text-white placeholder:text-gray-300 border-none rounded-md focus:ring-2 focus:ring-cyan-200 transition-all duration-300"
                        />
                        <svg
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 11c0-1.1.9-2 2-2m-2 6c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4m4 2c0 2.2-1.8 4-4 4s-4-1.8-4-4m-6 0c0 2.2-1.8 4-4 4s-4-1.8-4-4m4-6c0-2.2 1.8-4 4-4"
                          />
                        </svg>
                      </div>
                    </FormControl>
                    <FormMessage className="text-cyan-200" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                className="text-white hover:text-cyan-200"
                onClick={handleForgotPassword}
                disabled={isPending}
              >
                忘記密碼？
              </Button>
            </div>

            <FormError message={error || urlError} />
            <FormSuccess message={success} />
            <Button
              disabled={isPending}
              type="submit"
              className="w-full bg-blue-300 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
            >
              {isPending ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  正在登入...
                </span>
              ) : (
                "登入"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default User_login;