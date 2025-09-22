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




// import { SWR_School_Year } from "../fatchdata/swrschool_year";
// import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
// import { SWR_School_Quarter } from "../fatchdata/swrschool_quarter";
// import { student_school_timetable_Create_Schema } from "@/actions/Create-Student_school_Timetable/schema";
// import { createStudentSchoolTimetable } from "@/actions/Create-Student_school_Timetable";
// import Image from "next/image";



// interface StudentData{
//     id : string;
//     name : string;
//     grade : number;
//     school : string;
// }

// interface Student_SchoolTimeTable_Create_FormProps{
//     studentId : string;
//     data : StudentData[]
// }

// const Student_SchoolTimeTable_Create_Form = ({studentId , data}:Student_SchoolTimeTable_Create_FormProps) =>{
    
    
//     //上傳圖片
//     const [previewImage, setPreviewImage] = useState<string | null>(null);
//     const [ error, setError ] = useState<string | undefined>("");
//     const [ success, setSuccess  ] = useState<string | undefined>("");
//     const [isPending , startTransition] = useTransition();
//     const param = useParams();
//     const parentId = param.parentdetailbyID as string;

//     const schooltimetable_create_form = useForm<z.infer<typeof student_school_timetable_Create_Schema>>({
//         resolver : zodResolver(student_school_timetable_Create_Schema),
//         defaultValues:{
//             name: "",
//             student_name: "",
//             year:"",
//             student_school_timetable_id: studentId,
//             img:"",
//             grade: 0,
//             quarter: 0,
//             school : "",
//             parentId: parentId
//         }
//     })

//     useEffect(()=>{
//         if(data && data[0] && data[0].name){
//             schooltimetable_create_form.setValue('student_name', data[0]?.name)
//         }
//         if(data && data[0] && data[0].school){
//             schooltimetable_create_form.setValue('school', data[0]?.school)
//         }
//     },[data[0]])



//   // 處理圖片上傳
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       const reader = new FileReader();

//       reader.onload = () => {
//         const base64String = reader.result as string;
//         schooltimetable_create_form.setValue("img", base64String);
//         setPreviewImage(base64String);
//       };
//       reader.readAsDataURL(file);
//     }
//   };


//     const schooltimetable_create_form_onSubmit = (values : z.infer<typeof student_school_timetable_Create_Schema>) => {
//         console.log("--  create schooltimetable -- : ", values ,"-- End --")
//         setError("");
//         setSuccess("");
//         startTransition(() => {
//             createStudentSchoolTimetable(values).then((data) => {
//                 setError(data?.error);
//                 setSuccess(data?.success);
//             })
//         })
//     }

//     return(
//         <>
//                 {error && <div className="text-red-500 mb-4">{error}</div>}
//                 {success && <div className="text-green-500 mb-4">{success}</div>}
// <Form {...schooltimetable_create_form}>
//                 <form
//                     onSubmit={schooltimetable_create_form.handleSubmit(schooltimetable_create_form_onSubmit)}
//                     className="space-y-6"
//                 >
                
//                 <div className="space-y-4">
//                 <FormField
//                     control={schooltimetable_create_form.control}
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
//                     control={schooltimetable_create_form.control}
//                     name="student_name"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 學生名稱 </FormLabel>
//                     <FormControl>
//                     <Input 
//                 {...field}
//                 disabled={isPending}
//                 placeholder="學生名稱"
//                 type="text"
//                 />
//                     </FormControl>
//                 </FormItem>
//                     )}
//                 />
//                 </div> 
//                 <div className="space-y-4" 
//                 hidden
//                 >
//                 <FormField
//                     control={schooltimetable_create_form.control}
//                     name="student_school_timetable_id"
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
//                     control={schooltimetable_create_form.control}
//                     name="school"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 學校名稱 </FormLabel>
//                     <FormControl>
//                     <Input 
//                 {...field}
//                 disabled={isPending}
//                 placeholder="學校名稱"
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
//                     control={schooltimetable_create_form.control}
//                     name="year"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 年份 </FormLabel>
//                     <FormControl>
//                         <SWR_School_Year  field={field} />
//                     </FormControl>
//                 </FormItem>
//                     )}
//                 />
//                 </div> 
                
//                 <div className="space-y-4">
//                 <FormField
//                     control={schooltimetable_create_form.control}
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
//                     control={schooltimetable_create_form.control}
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
//               control={schooltimetable_create_form.control}
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
// export default Student_SchoolTimeTable_Create_Form


"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
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
    FormMessage
} from "@/components/ui/form";
import { SWR_School_Year } from "../fatchdata/swrschool_year";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { SWR_School_Quarter } from "../fatchdata/swrschool_quarter";
import { student_school_timetable_Create_Schema } from "@/actions/Create-Student_school_Timetable/schema";
import { createStudentSchoolTimetable } from "@/actions/Create-Student_school_Timetable";
import Image from "next/image";
import { useParams } from "next/navigation";

interface StudentData {
    id: string;
    name: string;
    grade: number;
    school: string;
}

interface Student_SchoolTimeTable_Create_FormProps {
    studentId: string;
    data: StudentData[];
}

const Student_SchoolTimeTable_Create_Form = ({ studentId, data }: Student_SchoolTimeTable_Create_FormProps) => {
    const [isPending, startTransition] = useTransition();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const param = useParams();
    const parentId = param.parentdetailbyID as string;

    const form = useForm<z.infer<typeof student_school_timetable_Create_Schema>>({
        resolver: zodResolver(student_school_timetable_Create_Schema),
        defaultValues: {
            name: "",
            student_name: "",
            year: "",
            student_school_timetable_id: studentId,
            img: "",
            grade: 0,
            quarter: 0,
            school: "",
            parentId: parentId
        }
    });

    useEffect(() => {
        if (data && data[0] && data[0].name) {
            form.setValue('student_name', data[0]?.name);
        }
        if (data && data[0] && data[0].school) {
            form.setValue('school', data[0]?.school);
        }
    }, [data]);

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

    const onSubmit = (values: z.infer<typeof student_school_timetable_Create_Schema>) => {
        setError("");
        setSuccess("");
        startTransition(() => {
            createStudentSchoolTimetable(values).then((data) => {
                setError(data?.error);
                setSuccess(typeof data?.success === "string" ? data?.success : data?.success ? "資料更新成功" : undefined);
                if (data?.success) {
                    form.reset();
                    setPreviewImage(null);
                }
            });
        });
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-700">{error}</span>
                    </div>
                </div>
            )}
            
            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-700">{success}</span>
                    </div>
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 左側表單 */}
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">檔案名稱</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="輸入檔案名稱"
                                                className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD]"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="student_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">學生名稱</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="學生名稱"
                                                className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD]"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="school"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">學校名稱</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="學校名稱"
                                                className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD]"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* 右側表單 */}
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">年份</FormLabel>
                                        <FormControl>
                                            <SWR_School_Year field={field} />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="grade"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">年級</FormLabel>
                                        <FormControl>
                                            <SWR_School_Grade field={field} />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="quarter"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">季度</FormLabel>
                                        <FormControl>
                                            <SWR_School_Quarter field={field} />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* 圖片上傳 */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="img"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">上傳圖片</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center space-x-4">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">點擊上傳</span> 或拖放檔案
                                                    </p>
                                                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (最大 5MB)</p>
                                                </div>
                                                <Input
                                                    disabled={isPending}
                                                    onChange={handleImageUpload}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        {previewImage && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">預覽圖片:</p>
                                <div className="border border-gray-200 rounded-lg p-2 inline-block">
                                    <Image
                                        width={300}
                                        height={300}
                                        src={previewImage}
                                        alt="預覽圖片"
                                        className="rounded-md object-contain max-h-64"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button
                            disabled={isPending}
                            type="submit"
                            className="bg-[#80A8BD] hover:bg-[#d6824a] text-white font-medium py-2 px-6 rounded-md shadow-sm transition-colors duration-300"
                        >
                            {isPending ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    處理中...
                                </span>
                            ) : "建立學校時間表"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Student_SchoolTimeTable_Create_Form;