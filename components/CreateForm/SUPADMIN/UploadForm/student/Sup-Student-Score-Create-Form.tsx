// "use client";


// import * as z from "zod";
// import { useState, useEffect ,useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useParams} from "next/navigation";

// import { Input } from "@/components/ui/input"; 

// import { Button } from "@/components/ui/button";

// import { 
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage
// } from "@/components/ui/form"



// import Image from "next/image";
// import { SWR_School_Subject } from "@/components/fatchdata/swrschool_subject";
// import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
// import { SWR_School_Year } from "@/components/fatchdata/swrschool_year";
// import { SWR_School_Quarter } from "@/components/fatchdata/swrschool_quarter";
// import { Supstudent_score_Create_Schema } from "@/actions/supadmin/Create-Student_Score/schema";
// import { SupcreateStudentScore } from "@/actions/supadmin/Create-Student_Score";


// interface StudentData{
//     id : string;
//     name : string;
//     grade : number;
//     school : string;
// }

// interface Student_Score_Create_FormProps{
//     studentId : string;
//     data : StudentData[]
// }



// const Student_Score_Create_Formbysupadmin = ({studentId , data}:Student_Score_Create_FormProps) =>{

//         //上傳圖片
//     const [previewImage, setPreviewImage] = useState<string | null>(null);
//     const [ error, setError ] = useState<string | undefined>("");
//     const [ success, setSuccess  ] = useState<string | undefined>("");
//     const param = useParams();
//     const parentId = param.parentdetailbyID as string;
//     const [isPending , startTransition] = useTransition();

//     const student_score_create_form = useForm<z.infer<typeof Supstudent_score_Create_Schema>>({
//         resolver : zodResolver(Supstudent_score_Create_Schema),
//         defaultValues:{
//             parentId: parentId,
//             subject: "",
//             student_name:"",
//             student_score_id: studentId,
//             grade:0,
//             quarter:0,
//             score:0,
//             year: "",
//             school:"",
//             name:"",
//         }
//     })

//     useEffect(()=>{
//         if(data && data[0] && data[0].name){
//             student_score_create_form.setValue('student_name', data[0]?.name)
//         }
//         if(data && data[0] && data[0].school){
//             student_score_create_form.setValue('school', data[0]?.school)
//         }
//     },[data[0]])

//   // 處理圖片上傳
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       const reader = new FileReader();

//       reader.onload = () => {
//         const base64String = reader.result as string;
//         student_score_create_form.setValue("img", base64String);
//         setPreviewImage(base64String);
//       };
//       reader.readAsDataURL(file);
//     }
//   };


//     const student_score_create_form_onSubmit = (values : z.infer<typeof Supstudent_score_Create_Schema>) => {
//         console.log("--  create student_score -- : ", values ,"-- End --")
//         setError("");
//         setSuccess("");
//         startTransition(() => {
//             SupcreateStudentScore(values).then((data) => {
//                 setError(data?.error);
//                 setSuccess(data?.success);
//             })
//         })
//     }


//     return(
//         <>
//         {error && <div className="text-red-500 mb-4">{error}</div>}
//         {success && <div className="text-green-500 mb-4">{success}</div>}
// <Form {...student_score_create_form}>
//                 <form
//                     onSubmit={student_score_create_form.handleSubmit(student_score_create_form_onSubmit)}
//                     className="space-y-6"
//                 >
                
//                 <div className="space-y-4">
//                 <FormField
//                     control={student_score_create_form.control}
//                     name="name"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 檔案名稱 </FormLabel>
//                     <FormControl>
//                     <Input 
//                 {...field}
//                 disabled={isPending}
//                 placeholder="檔案名稱"
//                 type="text"
//                 />
//                     </FormControl>
//                 </FormItem>
//                     )}
//                 />
//                 </div> 


//                 <div className="space-y-4">
//                 <FormField
//                     control={student_score_create_form.control}
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
//                     control={student_score_create_form.control}
//                     name="student_name"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 學生名字 </FormLabel>
//                     <FormControl>
//                     <Input 
//                         {...field}
//                         disabled={isPending}
//                         placeholder="學生名字"
//                         type="text"
//                     />
//                     </FormControl>
//                 </FormItem>
//                     )}
//                 />
//                 </div> 
//                 <div className="space-y-4" 
//                 hidden
//                 >
//                 <FormField
//                     control={student_score_create_form.control}
//                     name="student_score_id"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormControl>
//                         <Input 
//                             {...field}
//                             type="text"
//                             value={studentId}
                            
//                         />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//             </div> 
//             <div className="space-y-4">
//                 <FormField
//                     control={student_score_create_form.control}
//                     name="school"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 學校 </FormLabel>
//                     <FormControl>
//                     <Input 
//                 {...field}
//                 disabled={isPending}
//                 placeholder="學校"
//                 value={data[0]?.school}
//                 type="text"
//                 />
//                     </FormControl>
//                     <FormMessage />
                    
//                 </FormItem>
//                     )}
//                 />
//                 </div> 

//                 <div className="space-y-4">
//                 <FormField
//                     control={student_score_create_form.control}
//                     name="grade"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 年級 </FormLabel>
//                     <FormControl>
//                         <SWR_School_Grade field={field} />
//                     </FormControl>
//                 </FormItem>
//                     )}
//                 />
//                 </div> 

//             <div className="space-y-4">
//                 <FormField
//                     control={student_score_create_form.control}
//                     name="year"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 年份 </FormLabel>
//                     <FormControl>
//                         <SWR_School_Year field={field} />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//                 </div> 

//                 <div className="space-y-4">
//                 <FormField
//                     control={student_score_create_form.control}
//                     name="grade"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 年級 </FormLabel>
//                     <FormControl>
//                         <SWR_School_Grade field={field} />
//                     </FormControl>
//                 </FormItem>
//                     )}
//                 />
//                 </div> 

//                 <div className="space-y-4">
//                 <FormField
//                     control={student_score_create_form.control}
//                     name="quarter"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 季度 </FormLabel>
//                     <FormControl>
//                         <SWR_School_Quarter field={field} />
//                     </FormControl>
//                 </FormItem>
//                     )}
//                 />
//                 </div> 

//                 <div className="space-y-4">
//             <FormField
//               control={student_score_create_form.control}
//               name="img"
//               render={() => (
//                 <FormItem>
//                   <FormLabel>上傳圖片</FormLabel>
//                   <FormControl>
//                     <Input
//                       disabled={isPending}
//                       onChange={handleImageUpload}
//                       type="file"
//                       accept="image/*"
//                       className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div> 
                
//                 <Button disabled={isPending} type="submit">
//                     建立
//                 </Button>

//                 </form>
//                 {previewImage && (
//           <Image
//             width={500}
//             height={500}
//             src={previewImage}
//             alt="預覽圖片"
//             className="mt-4"
//           />
//         )}
//             </Form>
//         </>
//     )
// }
// export default Student_Score_Create_Formbysupadmin


"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import Image from "next/image";
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
import { SWR_School_Subject } from "@/components/fatchdata/swrschool_subject";
import { SWR_School_Grade } from "@/components/fatchdata/swrschool_grade";
import { SWR_School_Year } from "@/components/fatchdata/swrschool_year";
import { SWR_School_Quarter } from "@/components/fatchdata/swrschool_quarter";
import { Supstudent_score_Create_Schema } from "@/actions/supadmin/Create-Student_Score/schema";
import { SupcreateStudentScore } from "@/actions/supadmin/Create-Student_Score";

interface StudentData {
  id: string;
  name: string;
  grade: number;
  school: string;
}

interface Student_Score_Create_FormProps {
  studentId: string;
  data: StudentData[];
}

const Student_Score_Create_Formbysupadmin = ({ studentId, data }: Student_Score_Create_FormProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
  }>();
  const supadminId = params?.supadminid;
  const parentId = params?.parentdetailbyID;
    const StudentID = params?.studentdetailbyID;

  // 驗證路由參數
  if (!supadminId || !parentId || !StudentID) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const form = useForm<z.infer<typeof Supstudent_score_Create_Schema>>({
    resolver: zodResolver(Supstudent_score_Create_Schema),
    defaultValues: {
      parentId,
      student_score_id: studentId,
      student_name: "",
      school: "",
      name: "",
      subject: "",
      grade: 0,
      year: "",
      quarter: 0,
      score: 0,
      img: "",
    },
  });

  useEffect(() => {
    if (data && data[0] && data[0].name && data[0].school) {
      form.setValue("student_name", data[0].name);
      form.setValue("school", data[0].school);
    }
  }, [data, form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        form.setValue("img", base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: z.infer<typeof Supstudent_score_Create_Schema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      SupcreateStudentScore(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">檔案名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入檔案名稱"
                    className="border-blue-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">科目</FormLabel>
                <FormControl>
                  <SWR_School_Subject field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="student_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">學生姓名</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={true}
                    placeholder="學生姓名"
                    className="border-blue-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">學校</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={true}
                    placeholder="學校"
                    className="border-blue-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">年級</FormLabel>
                <FormControl>
                  <SWR_School_Grade field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">學年</FormLabel>
                <FormControl>
                  <SWR_School_Year field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quarter"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">季度</FormLabel>
                <FormControl>
                  <SWR_School_Quarter field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-600">分數</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入分數 (0-100)"
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="border-blue-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="img"
            render={() => (
              <FormItem>
                <FormLabel className="text-blue-600">上傳成績圖片</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    onChange={handleImageUpload}
                    type="file"
                    accept="image/*"
                    className="border-blue-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {previewImage && (
            <Image
              width={500}
              height={500}
              src={previewImage}
              alt="成績圖片預覽"
              className="object-contain rounded-lg max-w-full h-auto mt-4"
            />
          )}

          <Button
            disabled={isPending}
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending ? "提交中..." : "建立成績"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Student_Score_Create_Formbysupadmin;