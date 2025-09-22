// "use client";

// import * as z from "zod";
// import { useState, useEffect ,useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useSearchParams } from "next/navigation";

// import { Input } from "@/components/ui/input"; 

// import { Button } from "@/components/ui/button";

// import { Checkbox } from "@radix-ui/react-checkbox";

// import { 
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage
// } from "@/components/ui/form"

// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
//   } from "@/components/ui/select";


// import { Node_Create_Schema } from "@/actions/Create-Node/schema";
// import { SWR_School_Language } from "../fatchdata/swrschool_language";
// import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
// import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
// import { SWR_Class_Lesson } from "../fatchdata/swrclass_lesson";




// const Node_Create_Form = () => {

//     const [isPending , startTransition] = useTransition();

//         //為了拿老師data
//     const [ GetTeacherData , setgetTeacherData ] = useState([])

//         //拿老師data
//         useEffect(() => {
//             const getTeacherData = async () =>{
//                 //在app/api/Course_data/route.ts
//                 const res = await fetch('/api/Course_data');
//                 if(!res){
//                     throw new Error("斷線！")
//                 }
                
//                const result = await res.json()
    
//                setgetTeacherData(result)
    
//             }
//             getTeacherData()
//         },[])
    

//     const node_create_form = useForm<z.infer<typeof Node_Create_Schema>>({
//         resolver : zodResolver(Node_Create_Schema),
//         defaultValues:{
//             name: "",
//             title: "",
//             subject: "",
//             author: "",
//             img: "",
//             answer: false,
//             node_lesson: "",
//             grade: 0,
//             language: "",
//             teacher:""
//         }
//     })

//     const node_create_form_onSubmit = (values : z.infer<typeof Node_Create_Schema>) => {
//         console.log("-- create node -- : ", values ,"-- End --")
//     }

//     return(
//         <>
//             <Form {...node_create_form}>
//                 <form
//                     onSubmit={node_create_form.handleSubmit(node_create_form_onSubmit)}
//                     className="space-y-6"
//                 >
                
//                 <div className="space-y-4">
//                 <FormField
//                     control={node_create_form.control}
//                     name="name"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 姓名 </FormLabel>
//                     <FormControl>
//                     <Input 
//                 {...field}
//                 disabled={isPending}
//                 placeholder="姓名"
//                 type="text"
//                 />
//                     </FormControl>
//                 </FormItem>
//                     )}
//                 />
//                 </div> 

//                 <div className="space-y-4">
//                 <FormField
//                     control={node_create_form.control}
//                     name="title"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 標題 </FormLabel>
//                     <FormControl>
//                     <Input 
//                 {...field}
//                 disabled={isPending}
//                 placeholder="標題"
//                 type="text"
//                 />
//                     </FormControl>
//                 </FormItem>
//                     )}
//                 />
//                 </div> 

//                 <div className="space-y-4">
//                 <FormField
//                     control={node_create_form.control}
//                     name="subject"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 科目 </FormLabel>
//                     <FormControl>
//                         <SWR_School_Subject field={field} />
//                     </FormControl>
//                 </FormItem>
//                     )}
//                 />
//                 </div> 


//                 <div className="space-y-4">
//                 <FormField
//                     control={node_create_form.control}
//                     name="author"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 作者 </FormLabel>
//                     <FormControl>
//                     <Input 
//                 {...field}
//                 disabled={isPending}
//                 placeholder="作者"
//                 type="text"
//                 />
//                     </FormControl>
//                 </FormItem>
//                     )}
//                 />
//                 </div> 

//                 <div className="space-y-4">
//                 <FormField
//                     control={node_create_form.control}
//                     name="answer"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 是否有答案 </FormLabel>
//                     <FormControl>
//                         <div>
//                             <Checkbox 
//                                 checked={field.value}
//                                 onCheckedChange={field.onChange}
//                             />
//                             <label 
//                                 htmlFor="">
//                                 有答案    
//                             </label>
//                         </div>

//                         <div>
//                             <Checkbox 
//                                 checked={field.value}
//                                 onCheckedChange={field.onChange}                            
//                             />
//                             <label 
//                                 htmlFor="">
//                                 無答案    
//                             </label>
//                         </div>

//                     </FormControl>
//                 </FormItem>
//                     )}
//                 />
//                 </div> 

//                 <div className="space-y-4">
//                 <FormField
//                     control={node_create_form.control}
//                     name="node_lesson"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 筆記節數 </FormLabel>
//                     <FormControl>
//                         <SWR_Class_Lesson field={field} />
//                     </FormControl>
//                 </FormItem>
//                     )}
//                 />
//                 </div> 

//                 <div className="space-y-4">
//                 <FormField
//                     control={node_create_form.control}
//                     name="grade"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 年級 </FormLabel>
//                     <FormControl>
//                         <SWR_School_Grade  field={field} />
//                     </FormControl>
//                 </FormItem>
//                     )}
//                 />
//                 </div>                 

//                 <div className="space-y-4">
//                 <FormField
//                     control={node_create_form.control}
//                     name="language"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 語言 </FormLabel>
//                     <FormControl>
//                         <SWR_School_Language field={field}  />
//                     </FormControl>
//                 </FormItem>
//                     )}
//                 />
//                 </div> 


//                 <div className="space-y-4">
//                 <FormField
//                     control={node_create_form.control}
//                     name="teacher"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 老師 </FormLabel>
//                     <FormControl>
//                     <Select defaultValue={field.value}>
//                             <SelectTrigger>
//                             <SelectValue placeholder="選擇老師"/>
//                             </SelectTrigger>
//                             <SelectContent>
//                             {GetTeacherData.map((data)=>{
//                                 if( data.role === "TEACHER" )
//                                     {
//                                         return(
//                                             <>
//                                             <SelectItem value={data.username} key={data.id} >
//                                             名：{data.username}
//                                             </SelectItem>
//                                             </>
//                                         )
//                                     }

//                             })}
//                             </SelectContent>
//                         </Select>
//                     </FormControl>
//                 </FormItem>
//                     )}
//                 />
//                 </div>   


//                 <button disabled={isPending} type="submit">
//                     建立
//                 </button>

//                 </form>
//             </Form>
//         </>
//     )
// }

// export default Node_Create_Form


"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // 修正為 Shadcn 的 Checkbox
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Node_Create_Schema } from "@/actions/Create-Node/schema";
import { createNode } from "@/actions/Create-Node"; // 假設的動作
import { SWR_School_Language } from "../fatchdata/swrschool_language";
import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { SWR_Class_Lesson } from "../fatchdata/swrclass_lesson";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

// 定義 User 型別
interface User {
  id: string;
  username: string;
  email: string | null;
  nickname: string | null;
  role: "PARENT" | "TEACHER" | "ADMIN" | "SUPADMIN";
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

const Node_Create_Form = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [GetTeacherData, setGetTeacherData] = useState<User[]>([]);

  // 獲取教師數據
  useEffect(() => {
    const getTeacherData = async () => {
      try {
        const res = await fetch("/api/teachers");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const result: User[] = await res.json();
        setGetTeacherData(result);
      } catch (error) {
        console.error("獲取教師數據失敗:", error);
        setError("無法載入教師資料");
      }
    };
    getTeacherData();
  }, []);

  const node_create_form = useForm<z.infer<typeof Node_Create_Schema>>({
    resolver: zodResolver(Node_Create_Schema),
    defaultValues: {
      name: "",
      title: "",
      subject: "",
      author: "",
      img: "",
      answer: false,
      node_lesson: "",
      grade: 0,
      language: "",
      teacher: "",
    },
  });

  const node_create_form_onSubmit = (values: z.infer<typeof Node_Create_Schema>) => {
    console.log("-- create node -- : ", values, "-- End --");
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await createNode(values);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("筆記創建成功");
      }
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <Form {...node_create_form}>
        <form onSubmit={node_create_form.handleSubmit(node_create_form_onSubmit)} className="space-y-6">
          <FormError message={error} />
          <FormSuccess message={success} />

          <FormField
            control={node_create_form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>姓名</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="姓名" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={node_create_form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>標題</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="標題" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={node_create_form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>科目</FormLabel>
                <FormControl>
                  <SWR_School_Subject field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={node_create_form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>作者</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="作者" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={node_create_form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>是否有答案</FormLabel>
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={node_create_form.control}
            name="node_lesson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>筆記節數</FormLabel>
                <FormControl>
                  <SWR_Class_Lesson field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={node_create_form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>年級</FormLabel>
                <FormControl>
                  <SWR_School_Grade field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={node_create_form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>語言</FormLabel>
                <FormControl>
                  <SWR_School_Language field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={node_create_form.control}
            name="teacher"
            render={({ field }) => (
              <FormItem>
                <FormLabel>老師</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇老師" />
                    </SelectTrigger>
                    <SelectContent>
                      {GetTeacherData.filter((data) => data.role === "TEACHER").map((data) => (
                        <SelectItem value={data.username} key={data.id}>
                          名：{data.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "正在創建..." : "建立"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Node_Create_Form;