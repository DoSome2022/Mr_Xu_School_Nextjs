//13-08-2025 原本


// Staff_User_login.tsx
// "use client";

// import * as z from "zod";
// import { useState, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { useSearchParams } from "next/navigation";
// import { staffUser_Login_Schema } from "@/schemas";
// import { StaffUser_login_action } from "@/actions/staffuser-login";
// import { FormError } from "@/components/form-error";
// import { FormSuccess } from "@/components/form-success";

// const Staff_User_login = () => {
//   const searchParams = useSearchParams();
//   const [isPending, startTransition] = useTransition();
//   const urlError = searchParams.get("error") === "AccountNotLinked" ? "用戶名已被其他提供者使用！" : "";
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");

//   const login_form = useForm<z.infer<typeof staffUser_Login_Schema>>({
//     resolver: zodResolver(staffUser_Login_Schema),
//     defaultValues: {
//       username: "",
//       password: "",
//       staff: false,
//       isadmin: false,
//     },
//   });

//   const login_form_onSubmit = (values: z.infer<typeof staffUser_Login_Schema>) => {
//     console.log("-- 職員用戶輸入 -- : ", values);
//     setError("");
//     setSuccess("");

//     startTransition(() => {
//       StaffUser_login_action(values).then((data) => {
//         setError(data?.error);
//         setSuccess(data?.success);
//         if (data?.success) {
//           // 可選：重定向到管理員頁面
//           window.location.href = "/admin";
//         }
//       });
//     });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#80A8BD] p-4">
//       <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-lg">
//         <h1 className="text-3xl font-bold text-white text-center mb-6">職員登入頁面</h1>
//         <Form {...login_form}>
//           <form onSubmit={login_form.handleSubmit(login_form_onSubmit)} className="space-y-6">
//             <div className="space-y-4">
//               <FormField
//                 control={login_form.control}
//                 name="username"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">用戶名稱</FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Input
//                           {...field}
//                           disabled={isPending}
//                           placeholder="輸入用戶名稱"
//                           type="text"
//                           className="pl-10 bg-white/20 text-white placeholder:text-gray-300 border-none rounded-md focus:ring-2 focus:ring-cyan-200 transition-all duration-300"
//                         />
//                         <svg
//                           className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
//                           />
//                         </svg>
//                       </div>
//                     </FormControl>
//                     <FormMessage className="text-cyan-200" />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="space-y-4">
//               <FormField
//                 control={login_form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">密碼</FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Input
//                           {...field}
//                           disabled={isPending}
//                           placeholder="輸入密碼"
//                           type="password"
//                           className="pl-10 bg-white/20 text-white placeholder:text-gray-300 border-none rounded-md focus:ring-2 focus:ring-cyan-200 transition-all duration-300"
//                         />
//                         <svg
//                           className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M12 11c0-1.1.9-2 2-2m-2 6c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4m4 2c0 2.2-1.8 4-4 4s-4-1.8-4-4m-6 0c0 2.2-1.8 4-4 4s-4-1.8-4-4m4-6c0-2.2 1.8-4 4-4"
//                           />
//                         </svg>
//                       </div>
//                     </FormControl>
//                     <FormMessage className="text-cyan-200" />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="space-y-4">
//               <FormField
//                 control={login_form.control}
//                 name="staff"
//                 render={({ field }) => (
//                   <FormItem className="flex items-center space-x-2">
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                         disabled={isPending}
//                         className="border-white/50 data-[state=checked]:bg-blue-300 data-[state=checked]:border-blue-300 transition-all duration-300"
//                       />
//                     </FormControl>
//                     <FormLabel className="text-white">職員</FormLabel>
//                     <FormMessage className="text-cyan-200" />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="space-y-4">
//               <FormField
//                 control={login_form.control}
//                 name="isadmin"
//                 render={({ field }) => (
//                   <FormItem className="flex items-center space-x-2">
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                         disabled={isPending}
//                         className="border-white/50 data-[state=checked]:bg-blue-300 data-[state=checked]:border-blue-300 transition-all duration-300"
//                       />
//                     </FormControl>
//                     <FormLabel className="text-white">管理員</FormLabel>
//                     <FormMessage className="text-cyan-200" />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <FormError message={error || urlError} />
//             <FormSuccess message={success} />
//             <Button
//               disabled={isPending}
//               type="submit"
//               className="w-full bg-blue-300 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
//             >
//               {isPending ? (
//                 <span className="flex items-center justify-center">
//                   <svg
//                     className="animate-spin h-5 w-5 mr-2 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v8z"
//                     ></path>
//                   </svg>
//                   正在登入...
//                 </span>
//               ) : (
//                 "登入"
//               )}
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default Staff_User_login;


// Staff_User_login.tsx
"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { staffUser_Login_Schema } from "@/schemas";
import { StaffUser_login_action } from "@/actions/staffuser-login";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import Link from "next/link";

const Staff_User_login = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const urlError = searchParams.get("error") === "AccountNotLinked" ? "用戶名已被其他提供者使用！" : "";
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const login_form = useForm<z.infer<typeof staffUser_Login_Schema>>({
    resolver: zodResolver(staffUser_Login_Schema),
    defaultValues: {
      username: "",
      password: "",
      staff: false,
      isadmin: false,
    },
  });

  // Staff_User_login.tsx (部分程式碼)
const login_form_onSubmit = (values: z.infer<typeof staffUser_Login_Schema>) => {
  console.log("-- 職員用戶輸入 -- : ", values);
  setError("");
  setSuccess("");

  // 确保转换为布尔值
  const formValues = {
    ...values,
    staff: Boolean(values.staff),
    isadmin: Boolean(values.isadmin)
  };


  if (!values.staff && !values.isadmin) {
    setError("必須至少選擇職員或管理員身份");
    return;
  }

//   startTransition(() => {
//  StaffUser_login_action(formValues).then((data) => {
//       console.log("-- StaffUser_login_action response -- : ", data);
//       setError(data?.error);
//       setSuccess(data?.success);
//       if (data?.success && data?.role && data?.id) {
//         switch (data.role) {
//           case "ADMIN":
//             router.push("/admin");
//             break;
//           case "SUPADMIN":
//             router.push(`/supadmin/${data.id}`);
//             break;
//           case "TEACHER":
//             router.push(`/teacher/${data.id}`);
//             break;
//           default:
//             setError("無效的角色");
//             break;
//         }
//       }
//     });
//   });


startTransition(() => {
    StaffUser_login_action(formValues).then((data) => {
      setError(data?.error);
      setSuccess(data?.success);
      
      // 添加重定向前的日志
      console.log("登录结果:", {
        success: data?.success,
        role: data?.role,
        id: data?.id,
        error: data?.error
      });

      if (data?.success && data?.role && data?.id) {
        // 添加重定向前的小延迟确保session已更新
        setTimeout(() => {
          switch (data.role) {
            case "ADMIN":
              window.location.href = "/admin"; // 使用window.location确保完全刷新
              break;
            case "SUPADMIN":
              window.location.href = `/supadmin/${data.id}`;
              break;
            case "TEACHER":
              window.location.href = `/teacher/${data.id}`;
              break;
            default:
              setError("無效的角色");
              break;
          }
        }, 100);
      }
    });
  });



};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#80A8BD] p-4">
      <Link href="/" className="absolute top-4 left-4 text-white">
        返回
      </Link>
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">職員登入頁面</h1>
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

            <div className="space-y-4">
              <FormField
                control={login_form.control}
                name="staff"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                        className="border-white/50 data-[state=checked]:bg-blue-300 data-[state=checked]:border-blue-300 transition-all duration-300"
                      />
                    </FormControl>
                    <FormLabel className="text-white">職員</FormLabel>
                    <FormMessage className="text-cyan-200" />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={login_form.control}
                name="isadmin"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                        className="border-white/50 data-[state=checked]:bg-blue-300 data-[state=checked]:border-blue-300 transition-all duration-300"
                      />
                    </FormControl>
                    <FormLabel className="text-white">管理員</FormLabel>
                    <FormMessage className="text-cyan-200" />
                  </FormItem>
                )}
              />
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

export default Staff_User_login;



// // app/sign-in/page.tsx
// "use client";

// import { useState } from "react";
// import { StaffUser_login_action } from "@/actions/staffuser-login";
// import { getCsrfToken } from "next-auth/react";

// export default function SignInPage() {
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   const handleSubmit = async (formData: FormData) => {
//     const result = await StaffUser_login_action({
//       username: formData.get("username") as string,
//       password: formData.get("password") as string,
//       staff: formData.get("staff") === "on",
//       isadmin: formData.get("isadmin") === "on",
//     });

//     if (result.error) {
//       setError(result.error);
//       setSuccess(null);
//     } else if (result.success) {
//       setSuccess(result.success);
//       setError(null);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center">
//       <form action={handleSubmit} className="flex flex-col gap-4">
//         <h1 className="text-2xl font-bold">職員登錄</h1>
//         {error && <div className="text-red-500">{error}</div>}
//         {success && <div className="text-green-500">{success}</div>}
//         <input type="hidden" name="csrfToken" value={getCsrfToken()} />
//         <label>
//           用戶名
//           <input name="username" type="text" required className="border p-2" />
//         </label>
//         <label>
//           密碼
//           <input name="password" type="password" required className="border p-2" />
//         </label>
//         <label>
//           職員
//           <input name="staff" type="checkbox" />
//         </label>
//         <label>
//           管理員
//           <input name="isadmin" type="checkbox" />
//         </label>
//         <button type="submit" className="bg-blue-500 text-white p-2 rounded">
//           登錄
//         </button>
//       </form>
//     </div>
//   );
// }