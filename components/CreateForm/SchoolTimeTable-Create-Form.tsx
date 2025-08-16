// "use client";


// import * as z from "zod";
// import { useState, useEffect ,useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useSearchParams } from "next/navigation";

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


// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { School_timetable_Create_Schema } from "@/actions/Create-School_Timetable/schema";
// import { SWR_School_Year } from "../fatchdata/swrschool_year";
// import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
// import { SWR_School_Quarter } from "../fatchdata/swrschool_quarter";
// import { createSchoolTimeTable } from "@/actions/Create-School_Timetable";
// import Image from "next/image";

// // interface SchoolID {
// //     SchoolId : string;
// // }

// interface SchoolData {
//     id: string;
//     school_name : string;
// }

// interface SchoolTimeTable_Create_FormProps{
//     SchoolId : string;
//     data: SchoolData[]
// }




// const SchoolTimeTable_Create_Form = ({SchoolId , data} : SchoolTimeTable_Create_FormProps) =>{
    
//     const [ error, setError ] = useState<string | undefined>("");
//     const [ success, setSuccess  ] = useState<string | undefined>("");
//     const [isPending , startTransition] = useTransition();
//     const [PreviewImage, setPreviewImage] = useState<string | null>(null);
    

//         //上傳圖片
//         // const [uploadedImageUrl, setUploadedImageUrl ] = useState();

//         // console.log("-- School Data : --",data[0],"-- end --")
    
//         const [ SchoolName , setSchoolName ] = useState('');

//         useEffect(()=>{
//             if(data && data[0] && data[0].school_name){
//              setSchoolName(data[0].school_name);
//              schooltimetable_create_form.setValue("school_name", data[0].school_name)
//             }
//          },[data ])        

//     const schooltimetable_create_form = useForm<z.infer<typeof School_timetable_Create_Schema>>({
//         resolver : zodResolver(School_timetable_Create_Schema),
//         defaultValues:{
//             name: "",
//             school_name: SchoolName ,
//             year:"",
//             school_school_timetable_id: SchoolId ,
//             img:"",
//             grade: 0,
//             quarter: 0,
//         }
//     })

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

//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };





//     const schooltimetable_create_form_onSubmit = (values : z.infer<typeof School_timetable_Create_Schema>) => {
//         console.log("--  create schooltimetable -- : ", values ,"-- End --")
//         setError("");
//         setSuccess("");
//         startTransition(() => {
//             createSchoolTimeTable(values).then((data) => {
//                 setError(data?.error);
//                 setSuccess(data?.success);
//             })
//         })


//     }

//     return(
//         <>
//                       {error && <div className="text-red-500 mb-4">{error}</div>}
//                       {success && <div className="text-green-500 mb-4">{success}</div>}
//             <Form {...schooltimetable_create_form}>
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

//                 {data.map((d)=>{
            
//             return(
                
//                 <>
            
//             <div className="space-y-4">
//                 <FormField
//                     control={schooltimetable_create_form.control}

//                     name="school_name"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 學校名稱 </FormLabel>
//                     <FormControl>

//                 <Input 
//                 {...field}
//                 placeholder={d.school_name}
//                 defaultValue={d.school_name}
//                 type="text"
//                 />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//                 </div> 
//                 </>
//             )
// })}

// <div className="space-y-4" 
// hidden
// >
//                 <FormField
//                     control={schooltimetable_create_form.control}
//                     name="school_school_timetable_id"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormControl>
//                         <Input 
//                             {...field}
//                             type="text"
//                             value={
//                                 SchoolId
//                             }
//                             disabled
//                         />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//             </div> 





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
//                 <FormField
//                     control={schooltimetable_create_form.control}
//                     name="img"
//                     render={({ field }) => (
//                         <>
//                 <FormItem> 
//             <FormLabel>上傳</FormLabel> 
//             <FormControl>

//                    <Input 
//                 {...field}
//                 disabled={isPending}
                
//                 type="hidden"
//                 className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
//             </FormControl> 
//             </FormItem>
//         <FormItem> 

//             <FormControl>

//                    <Input 

//                 disabled={isPending}
//                 onChange={handleImageUpload}
//                 type="file"
//                 className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
//         </FormControl> 
//         </FormItem>
//                         </>
//                     )}
//                 />

//                 </div> 
                
//                 <Button disabled={isPending} type="submit">
//                     建立
//                 </Button>

//                 </form>
//             </Form>

//                 {PreviewImage && (
//           <Image
//             width={500}
//             height={500}
//             src={PreviewImage}
//             alt="預覽圖片"
//             className="mt-4"
//           />
//         )}

//         </>
//     )
// }
// export default SchoolTimeTable_Create_Form


"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { School_timetable_Create_Schema } from "@/actions/Create-School_Timetable/schema";
import { SWR_School_Year } from "../fatchdata/swrschool_year";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { SWR_School_Quarter } from "../fatchdata/swrschool_quarter";
import { createSchoolTimeTable } from "@/actions/Create-School_Timetable";

interface SchoolData {
    id: string;
    school_name: string;
}

interface SchoolTimeTable_Create_FormProps {
    SchoolId: string;
    data: SchoolData[];
}

const SchoolTimeTable_Create_Form = ({ SchoolId, data }: SchoolTimeTable_Create_FormProps) => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [PreviewImage, setPreviewImage] = useState<string | null>(null);
    const [SchoolName, setSchoolName] = useState('');

    useEffect(() => {
        if(data && data[0] && data[0].school_name) {
            setSchoolName(data[0].school_name);
            schooltimetable_create_form.setValue("school_name", data[0].school_name);
        }
    }, [data]);

    const schooltimetable_create_form = useForm<z.infer<typeof School_timetable_Create_Schema>>({
        resolver: zodResolver(School_timetable_Create_Schema),
        defaultValues: {
            name: "",
            school_name: SchoolName,
            year: "",
            school_school_timetable_id: SchoolId,
            img: "",
            grade: 0,
            quarter: 0,
        }
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                const base64String = reader.result as string;
                schooltimetable_create_form.setValue("img", base64String);
                setPreviewImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const schooltimetable_create_form_onSubmit = (values: z.infer<typeof School_timetable_Create_Schema>) => {
        setError("");
        setSuccess("");
        startTransition(() => {
            createSchoolTimeTable(values).then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            });
        });
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    {success}
                </div>
            )}

            <Form {...schooltimetable_create_form}>
                <form
                    onSubmit={schooltimetable_create_form.handleSubmit(schooltimetable_create_form_onSubmit)}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={schooltimetable_create_form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium text-gray-700">標題</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPending}
                                            placeholder="時間表標題"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                </FormItem>
                            )}
                        />

                        {data.map((d) => (
                            <FormField
                                key={d.id}
                                control={schooltimetable_create_form.control}
                                name="school_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-sm font-medium text-gray-700">學校名稱</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                placeholder={d.school_name}
                                                defaultValue={d.school_name}
                                                disabled
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs" />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                            control={schooltimetable_create_form.control}
                            name="year"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium text-gray-700">年份</FormLabel>
                                    <FormControl>
                                        <SWR_School_Year field={field} />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={schooltimetable_create_form.control}
                            name="grade"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium text-gray-700">年級</FormLabel>
                                    <FormControl>
                                        <SWR_School_Grade field={field} />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={schooltimetable_create_form.control}
                            name="quarter"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium text-gray-700">季度</FormLabel>
                                    <FormControl>
                                        <SWR_School_Quarter field={field} />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={schooltimetable_create_form.control}
                        name="img"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block text-sm font-medium text-gray-700">時間表圖片</FormLabel>
                                <FormControl>
                                    <div className="mt-1 flex items-center">
                                        <input
                                            type="file"
                                            onChange={handleImageUpload}
                                            disabled={isPending}
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                                <input type="hidden" {...field} />
                            </FormItem>
                        )}
                    />

                    {PreviewImage && (
                        <div className="mt-4 border rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">預覽圖片</h3>
                            <Image
                                width={800}
                                height={600}
                                src={PreviewImage}
                                alt="預覽圖片"
                                className="max-w-full h-auto rounded-md"
                            />
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {isPending ? "處理中..." : "建立時間表"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default SchoolTimeTable_Create_Form;