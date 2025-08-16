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



// import { student_score_Create_Schema } from "@/actions/Create-Student_Score/schema";
// import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
// import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
// import { SWR_School_Quarter } from "../fatchdata/swrschool_quarter";
// import { createStudentScore } from "@/actions/Create-Student_Score";
// import { SWR_School_Year } from "../fatchdata/swrschool_year";
// import Image from "next/image";


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



// const Student_Score_Create_Form = ({studentId , data}:Student_Score_Create_FormProps) =>{

//         //上傳圖片
//     const [previewImage, setPreviewImage] = useState<string | null>(null);
//     const [ error, setError ] = useState<string | undefined>("");
//     const [ success, setSuccess  ] = useState<string | undefined>("");
//     const param = useParams();
//     const parentId = param.parentdetailbyID as string;
//     const [isPending , startTransition] = useTransition();

//     const student_score_create_form = useForm<z.infer<typeof student_score_Create_Schema>>({
//         resolver : zodResolver(student_score_Create_Schema),
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


//     const student_score_create_form_onSubmit = (values : z.infer<typeof student_score_Create_Schema>) => {
//         console.log("--  create student_score -- : ", values ,"-- End --")
//         setError("");
//         setSuccess("");
//         startTransition(() => {
//             createStudentScore(values).then((data) => {
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
// export default Student_Score_Create_Form


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
    FormMessage
} from "@/components/ui/form";

import { student_score_Create_Schema } from "@/actions/Create-Student_Score/schema";
import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { SWR_School_Quarter } from "../fatchdata/swrschool_quarter";
import { createStudentScore } from "@/actions/Create-Student_Score";
import { SWR_School_Year } from "../fatchdata/swrschool_year";

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

const Student_Score_Create_Form = ({ studentId, data }: Student_Score_Create_FormProps) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const param = useParams();
    const parentId = param.parentdetailbyID as string;
    const [isPending, startTransition] = useTransition();

    const student_score_create_form = useForm<z.infer<typeof student_score_Create_Schema>>({
        resolver: zodResolver(student_score_Create_Schema),
        defaultValues: {
            parentId: parentId,
            subject: "",
            student_name: "",
            student_score_id: studentId,
            grade: 0,
            quarter: 0,
            score: 0,
            year: "",
            school: "",
            name: "",
        }
    });

    useEffect(() => {
        if (data && data[0] && data[0].name) {
            student_score_create_form.setValue('student_name', data[0]?.name);
        }
        if (data && data[0] && data[0].school) {
            student_score_create_form.setValue('school', data[0]?.school);
        }
    }, [data]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                const base64String = reader.result as string;
                student_score_create_form.setValue("img", base64String);
                setPreviewImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const student_score_create_form_onSubmit = (values: z.infer<typeof student_score_Create_Schema>) => {
        setError("");
        setSuccess("");
        startTransition(() => {
            createStudentScore(values).then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            });
        });
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                    {success}
                </div>
            )}

            <Form {...student_score_create_form}>
                <form
                    onSubmit={student_score_create_form.handleSubmit(student_score_create_form_onSubmit)}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={student_score_create_form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">檔案名稱</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPending}
                                            placeholder="檔案名稱"
                                            className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={student_score_create_form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">科目</FormLabel>
                                    <FormControl>
                                        <SWR_School_Subject field={field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={student_score_create_form.control}
                            name="student_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">學生名字</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPending}
                                            placeholder="學生名字"
                                            className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={student_score_create_form.control}
                            name="school"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">學校</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPending}
                                            placeholder="學校"
                                            className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={student_score_create_form.control}
                            name="grade"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">年級</FormLabel>
                                    <FormControl>
                                        <SWR_School_Grade field={field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={student_score_create_form.control}
                            name="year"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">年份</FormLabel>
                                    <FormControl>
                                        <SWR_School_Year field={field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={student_score_create_form.control}
                            name="quarter"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">季度</FormLabel>
                                    <FormControl>
                                        <SWR_School_Quarter field={field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={student_score_create_form.control}
                            name="img"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">上傳圖片</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            onChange={handleImageUpload}
                                            type="file"
                                            accept="image/*"
                                            className="block w-full text-sm text-gray-900 border border-[#e7915b] rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button 
                            disabled={isPending} 
                            type="submit"
                            className="bg-[#e7915b] hover:bg-[#d9824c] text-white"
                        >
                            {isPending ? "處理中..." : "建立成績記錄"}
                        </Button>
                    </div>
                </form>
            </Form>

            {previewImage && (
                <div className="mt-6 p-4 border border-[#e7915b] rounded-lg">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">預覽圖片</h3>
                    <div className="relative w-full h-64">
                        <Image
                            src={previewImage}
                            alt="預覽圖片"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Student_Score_Create_Form;