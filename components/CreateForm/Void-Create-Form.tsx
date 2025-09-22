// "use client";

// import * as z from "zod";
// import { useState ,useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Input } from "@/components/ui/input"; 

// import { Button } from "@/components/ui/button";

// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { VoidCreateSchema } from "@/actions/Create-Void/schema";
// import { CreateVoid_action } from "@/actions/Create-Void";


// const VoidCreateForm = () => {
//   const [isPending , startTransition] = useTransition();

//   const [ error, setError ] = useState<string | undefined>("");
//   const [ success, setSuccess  ] = useState<string | undefined>("");

//   const void_create_form = useForm<z.infer< typeof VoidCreateSchema >>({
//     resolver: zodResolver(VoidCreateSchema),
//     defaultValues:{
//       title  : "",
//       price : 0,
//     }
//   })

//   const void_create_form_onSubmit = async (data:z.infer< typeof VoidCreateSchema >) => {
//     console.log("--  create void -- : ", data ,"-- End --");
//     setError("");
//     setSuccess("");

//     startTransition(() => {
//       CreateVoid_action(data)
 
//     })

//   }

//   return (
//     <div>
//       <h1>VoidCreateForm</h1>
//       <Form {...void_create_form}>
//         <form onSubmit={void_create_form.handleSubmit(void_create_form_onSubmit)}>

//           <FormField
//             control={void_create_form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Title</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Title" {...field}  type="text" disabled={isPending} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={void_create_form.control}
//             name="price"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>price</FormLabel>
//                 <FormControl>
//                   <Input placeholder="price" {...field}  type="number" disabled={isPending} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />


//           <Button disabled={isPending} type="submit">
//             建立
//           </Button>

//         </form>
//       </Form>

      
//     </div>
//   );
// };

// export default VoidCreateForm;


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
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { VoidCreateSchema } from "@/actions/Create-Void/schema";
import { CreateVoid_action } from "@/actions/Create-Void";

const VoidCreateForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const void_create_form = useForm<z.infer<typeof VoidCreateSchema>>({
    resolver: zodResolver(VoidCreateSchema),
    defaultValues: {
      title: "",
      price: 0,
    },
  });

  const void_create_form_onSubmit = async (
    data: z.infer<typeof VoidCreateSchema>
  ) => {
    console.log("-- create void -- : ", data, "-- End --");
    setError("");
    setSuccess("");

    startTransition(() => {
      CreateVoid_action(data).then((result) => {
        if (result?.success) {
          setSuccess(
            typeof result.success === "string"
              ? result.success
              : "資料更新成功"
          );
          void_create_form.reset();
        } else {
          setError(result?.error || "建立補單失敗");
        }
      });
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold tracking-tight text-[#80A8BD] mb-6">
        建立新補單
      </h2>
      <Form {...void_create_form}>
        <form
          onSubmit={void_create_form.handleSubmit(void_create_form_onSubmit)}
          className="space-y-6"
        >
          <FormError message={error} />
          <FormSuccess message={success} />
          <FormField
            control={void_create_form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#80A8BD] font-medium">
                  標題
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="請輸入標題"
                    {...field}
                    type="text"
                    disabled={isPending}
                    className="w-full border-[#80A8BD] rounded-md px-3 py-2 text-gray-900 focus:ring-[#80A8BD] focus:border-[#80A8BD] transition-colors duration-300"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={void_create_form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#80A8BD] font-medium">
                  價錢
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="請輸入價錢"
                    {...field}
                    type="number"
                    disabled={isPending}
                    className="w-full border-[#80A8BD] rounded-md px-3 py-2 text-gray-900 focus:ring-[#80A8BD] focus:border-[#80A8BD] transition-colors duration-300"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : 0
                      )
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-[#80A8BD] text-white font-medium hover:bg-cyan-200 hover:text-gray-900 transition-colors duration-300 disabled:opacity-50"
          >
            {isPending ? "正在提交..." : "建立"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default VoidCreateForm;