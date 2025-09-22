
// "use client"


// import * as z from "zod";
// import { useState, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useSearchParams } from "next/navigation";

// import { Input } from "@/components/ui/input"; 
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";

// import { 
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage
//  } from "@/components/ui/form"

// import { Teacher_Create_Schema } from "@/actions/Create-Teacher/schema";
// import { createTeacher } from "@/actions/Create-Teacher";


// const Teacher_Create_Form = () => {

//     const [isPending , startTransition] = useTransition();
//     const [ error, setError ] = useState<string | undefined >("");


//     const teacher_register_form = useForm<z.infer<typeof Teacher_Create_Schema>>({
//         resolver: zodResolver(Teacher_Create_Schema),
//         defaultValues:{
//             username: "",
//             nickname: "",
//             email: "",
//             phone: "",
//             role: "TEACHER",
//             password: "",
//             staff: true,
//             isadmin: false,
//         }
//     })

//     const teacher_register_form_onSubmit =  (values:z.infer<typeof Teacher_Create_Schema>) =>{
//         console.log("-- teacher register輸入 -- : ",values,"-- End --")
//         startTransition( async () => {
//           const result = await createTeacher(values);
//           if (result.error) {
//             setError(result.error);
//           } else {
//             setError("")
//           }
//         } )
//     }


//     return(
//         <>
//         <p>
//             建立老師用戶
//         </p>
//         <br />
//         {error && <p className="error-message" >{error}</p>}
// <br />
//         <Form {...teacher_register_form} >

// <form 
//     onSubmit={teacher_register_form.handleSubmit(teacher_register_form_onSubmit)}
// className="space-y-6">

//     <div className="space-y-4">
//         <FormField
//             control={teacher_register_form.control}
//             name="username"
//             render={({ field }) => (
//         <FormItem>
//             <FormLabel> 用戶名稱 </FormLabel>
//             <FormControl>
//                 <Input 
//                     {...field}
//                     disabled={isPending}
//                     placeholder="輸入用戶名稱"
//                     type="text"
//                     />
//             </FormControl>
//             <FormMessage />
//         </FormItem>
//             )}
//         />
//     </div>
//     <div className="space-y-4">
//         <FormField
//             control={teacher_register_form.control}
//             name="nickname"
//             render={({ field }) => (
//         <FormItem>
//             <FormLabel> 暱稱 </FormLabel>
//             <FormControl>
//                 <Input 
//                     {...field}
//                     disabled={isPending}
//                     placeholder="輸入暱稱"
//                     type="text"
//                     />
//             </FormControl>
//             <FormMessage />
//         </FormItem>
//             )}
//         />
//     </div>
//     <div className="space-y-4">
//         <FormField
//             control={teacher_register_form.control}
//             name="email"
//             render={({ field }) => (
//         <FormItem>
//             <FormLabel> 電郵 </FormLabel>
//             <FormControl>
//                 <Input 
//                     {...field}
//                     disabled={isPending}
//                     placeholder="輸入電郵"
//                     type="text"
//                     />
//             </FormControl>
//             <FormMessage />
//         </FormItem>
//             )}
//         />
//     </div>
//     <div className="space-y-4">
//         <FormField
//             control={teacher_register_form.control}
//             name="phone"
//             render={({ field }) => (
//         <FormItem>
//             <FormLabel> 電話 </FormLabel>
//             <FormControl>
//                 <Input 
//                     {...field}
//                     disabled={isPending}
//                     placeholder="輸入電話 "
//                     type="number"
//                     />
//             </FormControl>
//             <FormMessage />
//         </FormItem>
//             )}
//         />
//     </div>
//     <div className="space-y-4">
//         <FormField
//             control={teacher_register_form.control}
//             name="password"
//             render={({ field }) => (
//         <FormItem>
//             <FormLabel> 密碼 </FormLabel>
//             <FormControl>
//                 <Input 
//                     {...field}
//                     disabled={isPending}
//                     placeholder="輸入密碼"
//                     type="text"
//                     />
//             </FormControl>
//             <FormMessage />
//         </FormItem>
//             )}
//         />
//     </div>


//     <div className="space-y-4"
//                         hidden
//                     >
//                         <FormField 
//                             control={teacher_register_form.control}
//                             name="staff"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel> 職員 </FormLabel>
//                                     <FormControl>
//                                         <Checkbox 
//                                             checked={field.value}
//                                             onCheckedChange={field.onChange}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}  
//                         />
//                     </div>

//                     <div className="space-y-4"
//                         hidden
//                     >
//                         <FormField 
//                             control={teacher_register_form.control}
//                             name="isadmin"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel> 是否ADMIN </FormLabel>
//                                     <FormControl>
//                                         <Checkbox 
//                                             checked={field.value}
//                                             onCheckedChange={field.onChange}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}  
//                         />
//                     </div>

//     <Button disabled={isPending} type="submit" >

//     建立
//             </Button>

// </form>

// </Form>

//         </>
//     )
// }

// export default Teacher_Create_Form



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
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Teacher_Create_Schema } from "@/actions/Create-Teacher/schema";
import { createTeacher } from "@/actions/Create-Teacher";

const Teacher_Create_Form = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const teacher_register_form = useForm<z.infer<typeof Teacher_Create_Schema>>({
    resolver: zodResolver(Teacher_Create_Schema),
    defaultValues: {
      username: "",
      nickname: "",
      email: "",
      phone: "",
      role: "TEACHER",
      password: "",
      staff: true,
      isadmin: false,
    },
  });

  const teacher_register_form_onSubmit = (values: z.infer<typeof Teacher_Create_Schema>) => {
    console.log("-- 老師用戶創建輸入 -- : ", values, "-- End --");
    setError("");
    setSuccess("");
    startTransition(() => {
      createTeacher(values).then((data) => {
        setError(data?.error);
        setSuccess(typeof data?.success === "string" ? data?.success : data?.success ? "資料更新成功" : undefined);
      });
    });
  };

  return (
    <Form {...teacher_register_form}>
      <form onSubmit={teacher_register_form.handleSubmit(teacher_register_form_onSubmit)} className="space-y-6">
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
        <FormField
          control={teacher_register_form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-medium">用戶名稱</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="輸入用戶名稱"
                  type="text"
                  className="border-0 bg-white text-[#80A8BD] placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-200"
                />
              </FormControl>
              <FormMessage className="text-cyan-200" />
            </FormItem>
          )}
        />
        <FormField
          control={teacher_register_form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-medium">暱稱</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="輸入暱稱"
                  type="text"
                  className="border-0 bg-white text-[#80A8BD] placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-200"
                />
              </FormControl>
              <FormMessage className="text-cyan-200" />
            </FormItem>
          )}
        />
        <FormField
          control={teacher_register_form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-medium">電郵</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="輸入電郵"
                  type="email"
                  className="border-0 bg-white text-[#80A8BD] placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-200"
                />
              </FormControl>
              <FormMessage className="text-cyan-200" />
            </FormItem>
          )}
        />
        <FormField
          control={teacher_register_form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-medium">電話</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="輸入電話"
                  type="tel"
                  className="border-0 bg-white text-[#80A8BD] placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-200"
                />
              </FormControl>
              <FormMessage className="text-cyan-200" />
            </FormItem>
          )}
        />
        <FormField
          control={teacher_register_form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-medium">密碼</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="輸入密碼"
                  type="password"
                  className="border-0 bg-white text-[#80A8BD] placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-200"
                />
              </FormControl>
              <FormMessage className="text-cyan-200" />
            </FormItem>
          )}
        />
        <FormField
          control={teacher_register_form.control}
          name="staff"
          render={({ field }) => (
            <FormItem hidden>
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled />
              </FormControl>
              <FormMessage className="text-cyan-200" />
            </FormItem>
          )}
        />
        <FormField
          control={teacher_register_form.control}
          name="isadmin"
          render={({ field }) => (
            <FormItem hidden>
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled />
              </FormControl>
              <FormMessage className="text-cyan-200" />
            </FormItem>
          )}
        />
        <Button
          disabled={isPending}
          type="submit"
          className="w-full bg-white text-[#80A8BD] font-medium hover:bg-cyan-200 hover:text-[#80A8BD] transition-colors duration-300"
        >
          建立
        </Button>
      </form>
    </Form>
  );
};

export default Teacher_Create_Form;