// "use client";


// import * as z from "zod";
// import { useState, useEffect ,useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useParams, useSearchParams } from "next/navigation";

// import { Input } from "@/components/ui/input"; 

// import { Button } from "@/components/ui/button";

// import { 
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage
//  } from "@/components/ui/form"


//  import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
//   } from "@/components/ui/select";


// import { SWR_Course_Level } from "../fatchdata/swrcourse_level";
// import { FormError } from "@/components/form-error"; 
// import { FormSuccess } from "@/components/form-success";
// import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
// import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
// import { Course_Update_Schema } from "@/actions/Update-Course/schema";
// import { update_Course } from "@/actions/Update-Course";



// const Course_Update_Form = () => {

//     const params = useParams();
//     const CourseID = params?.coursedetailbyID as string

//     const [isPending , startTransition] = useTransition();

//     const [ error, setError ] = useState<string | undefined>("");
//     const [ success, setSuccess  ] = useState<string | undefined>("");




//     //為了拿老師data
//     const [ GetTeacherData , setgetTeacherData ] = useState([]);

    
//     //拿老師的id來做course裹老師的定點
//     const [ GetSelectedTeacherID , setGetSelectedTeacherID ] = useState([]);

//     //拿老師data
//     useEffect(() => {
//         const getTeacherData = async () =>{
//             //在app/api/Course_data/route.ts
//             const res = await fetch('/api/Course_data_teacher');
//             if(!res){
//                 throw new Error("斷線！")
//             }
            
//            const result = await res.json()

//            setgetTeacherData(result)

//         }
//         getTeacherData()
//     },[])

//     const [ GetCourseData , setGetCourseData ] = useState([]);
//     useEffect(() => {
//         if(CourseID){
//         const getcoursedata = async (courseid : string) =>{
//             //在app/api/Course_data/route.ts
//             const res = await fetch(`/api/Course_detail_data_by_id_findMany/${courseid}`);
//             if(!res){
//                 throw new Error("斷線！")
//             }
            
//            const result = await res.json()

//            setGetCourseData(result)

//         }
//             getcoursedata(CourseID)
//         }


//     },[CourseID])

//     console.log(GetCourseData)

//     const [GetCourseName , setGetCourseName] = useState('')
//     const [GetCourseSubject ,setGetCourseSubject] = useState('')
//     const [GetCoursePersons , setGetCoursePersons] = useState(0)
//     const [GetCourseGrade , setGetCourseGrade] = useState(0)
//     const [GetCourseLevel , setGetCourseLevel] = useState('')
//     const [GetCourseTeacher , setGetCourseTeacher] = useState('')
//     const [GetCourseTeacher_data_id , setGetCourseTeacher_data_id] = useState([])



//     const course_create_form = useForm<z.infer<typeof Course_Update_Schema>>({
//         resolver: zodResolver(Course_Update_Schema),
//         defaultValues:{
//             courseId: CourseID,
//             course_name: "",
//             course_subject: "",
//             persons: 0,
//             grade: 0,
//             course_level: "",
//             teacher: "",
//             course_teacher_data_id: GetSelectedTeacherID,
//         }
//     }) 

//     useEffect(()=>{
//         if(GetCourseData && GetCourseData[0] && GetCourseData[0].course_name){
//             setGetCourseName(GetCourseData[0].course_name);
//             course_create_form.setValue("course_name", GetCourseData[0].course_name);
//         }
//         if(GetCourseData && GetCourseData[0] && GetCourseData[0].course_subject){
//             setGetCourseSubject(GetCourseData[0].course_subject);
//             course_create_form.setValue("course_subject", GetCourseData[0].course_subject);
//         }
//         if(GetCourseData && GetCourseData[0] && GetCourseData[0].persons){
//             setGetCoursePersons(GetCourseData[0].persons);
//             course_create_form.setValue("persons", GetCourseData[0].persons);
//         }
//         if(GetCourseData && GetCourseData[0] && GetCourseData[0].grade){
//             setGetCourseGrade(GetCourseData[0].grade);
//             course_create_form.setValue("grade", GetCourseData[0].grade);
//         }
//         if(GetCourseData && GetCourseData[0] && GetCourseData[0].course_level){
//             setGetCourseLevel(GetCourseData[0].course_level);
//             course_create_form.setValue("course_level", GetCourseData[0].course_level);
//         }
//         if(GetCourseData && GetCourseData[0] && GetCourseData[0].teacher){
//             setGetCourseTeacher(GetCourseData[0].teacher);
//             course_create_form.setValue("teacher", GetCourseData[0].teacher);
//         }
//         if(GetCourseData && GetCourseData[0] && GetCourseData[0].course_teacher_data_id
//         ){
//             setGetCourseTeacher_data_id(GetCourseData[0].course_teacher_data_id
//             );
//             course_create_form.setValue("course_teacher_data_id", GetCourseData[0].course_teacher_data_id
//             );
//         }
//     },[GetCourseData])

//     const course_create_form_onSubmit = (values: z.infer<typeof Course_Update_Schema>) => {
//         console.log("-- create course輸入 -- : ",values,"-- End --")
//         setError("");
//         setSuccess("");

//         startTransition(() => {
//             update_Course(values)
//         })
//     }

//     return(
//         <>
//             <Form {...course_create_form} >
//                 <form 
//                 onSubmit={course_create_form.handleSubmit(course_create_form_onSubmit)}
//                 className="space-y-6">

//             {GetCourseData.map((d)=>{
//                 return(
//                     <>
//             <div className="space-y-4">
//                 <FormField
//                     control={course_create_form.control}
//                     name="courseId"
//                     render={({ field }) => (
//                 <FormItem>

//                     <FormControl>
//                         <Input 
//                             {...field}
//                             disabled={isPending}
//                             placeholder={CourseID}
//                             defaultValue={CourseID}
//                             type="text"
//                             />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//             </div> 


//                    <div className="space-y-4">
//                 <FormField
//                     control={course_create_form.control}
//                     name="course_name"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 課程名稱 </FormLabel>
//                     <FormControl>
//                         <Input 
//                             {...field}
//                             disabled={isPending}
//                             placeholder={d.course_name}
//                             defaultValue={d.course_name}
//                             type="text"
//                             />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//             </div> 


//             <div className="space-y-4">
//                 <FormField
//                     control={course_create_form.control}
//                     name="course_subject"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 課程科目 : {d.course_subject}，下面更改</FormLabel>
//                     <FormControl>
//                         <SWR_School_Subject  field={field} />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//             </div> 


//             <div className="space-y-4">
//                 <FormField
//                     control={course_create_form.control}
//                     name="persons"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 人數 : {d.persons} ，下面更改</FormLabel>
//                     <FormControl>
//                         <Input 
//                             {...field}
//                             disabled={isPending}
//                             placeholder="輸入人數"
//                             type="number"
//                             onChange={(e) => field.onChange(parseInt(e.target.value, 10))}

//                             />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//             </div> 
//             <div className="space-y-4">
//                 <FormField
//                     control={course_create_form.control}
//                     name="grade"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 年級 : {d.grade} ，下面更改</FormLabel>
//                     <FormControl>
//                         <SWR_School_Grade  field={field} />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//             </div> 


//             <div className="space-y-4">
//                 <FormField
//                     control={course_create_form.control}
//                     name="course_level"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 課程難度 :{d.course_level} ，下面更改 </FormLabel>
//                     <FormControl>
                  
//                         <SWR_Course_Level field={field} />
                

//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//             </div> 


            
//             <div className="space-y-4">
//                 <FormField
//                     control={course_create_form.control}
//                     name="teacher"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 老師 : {d.teacher}  ，下面更改 </FormLabel>
//                     <FormControl>
//                         <Select 
//                         defaultValue={field.value}
//                         onValueChange={(value) => {
//                             field.onChange(value);
//                             const SelectedTeacherID = GetTeacherData.find((data) => data.username === value);
//                             // setGetSelectedTeacherID(SelectedTeacherID?.id || "");
//                             // course_create_form.setValue("course_teacher_data_id",SelectedTeacherID?.id || "" )
//                             if(SelectedTeacherID?.id) {
//                                 const updatedIDs = [...GetSelectedTeacherID, SelectedTeacherID.id ];
//                                 setGetSelectedTeacherID(updatedIDs);
//                                 course_create_form.setValue("course_teacher_data_id",updatedIDs)
//                             }
//                         }}
//                         >
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
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//             </div> 


//             <div className="space-y-4"
//             hidden>
//                 <FormField
//                     control={course_create_form.control}
//                     name="course_teacher_data_id"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormControl>
//                         <Input 
//                             {...field}
//                             type="text"
//                             value={GetSelectedTeacherID.join(", ")}
//                             disabled
//                         />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//             </div> 
//                     </>
//                 )
//             })}

            


//             <FormError message={error }/>
//             <FormSuccess message={success} />
//             <Button disabled={isPending} type="submit">
//                    更改
//             </Button>


//                 </form>

//             </Form>
//         </>
//     )
// }

// export default Course_Update_Form

"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SWR_Course_Level } from "../fatchdata/swrcourse_level";
import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { Course_Update_Schema } from "@/actions/Update-Course/schema";
import { update_Course } from "@/actions/Update-Course";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

// 定義介面
interface Teacher {
  id: string;
  username: string;
  role: string;
}

interface Course {
  id: string;
  course_name: string;
  course_subject: string;
  persons: number;
  grade: number;
  course_level: string;
  teacher: string;
  course_teacher_data_id: string[];
}

const Course_Update_Form = () => {
  const params = useParams();
  const courseId = params?.coursedetailbyID as string;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [GetTeacherData, setGetTeacherData] = useState<Teacher[]>([]);
  const [GetCourseData, setGetCourseData] = useState<Course | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [teacherRes, courseRes] = await Promise.all([
          fetch("/api/Course_data_teacher"),
          fetch(`/api/Course_detail_data_by_id_findMany/${courseId}`),
        ]);

        if (!teacherRes.ok) throw new Error("無法獲取教師數據");
        const teacherResult = await teacherRes.json();
        setGetTeacherData(teacherResult);

        if (!courseRes.ok) throw new Error("無法獲取課程數據");
        const courseResult = await courseRes.json();
        setGetCourseData(courseResult); // 假設 API 返回單個物件
      } catch (error: any) {
        console.error("數據獲取失敗:", error);
        setError("無法載入數據");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    } else {
      setError("無效的課程ID");
      setLoading(false);
    }
  }, [courseId]);

  const course_create_form = useForm<z.infer<typeof Course_Update_Schema>>({
    resolver: zodResolver(Course_Update_Schema),
    defaultValues: {
      courseId: courseId,
      course_name: "",
      course_subject: "",
      persons: 0,
      grade: 0,
      // course_level: "",
      teacher: "",
      course_teacher_data_id: [],
    },
  });

  useEffect(() => {
    if (GetCourseData) {
      course_create_form.setValue("course_name", GetCourseData.course_name || "");
      course_create_form.setValue("course_subject", GetCourseData.course_subject || "");
      course_create_form.setValue("persons", GetCourseData.persons || 0);
      course_create_form.setValue("grade", GetCourseData.grade || 0);
      // course_create_form.setValue("course_level", GetCourseData.course_level || "");
      course_create_form.setValue("teacher", GetCourseData.teacher || "");
      course_create_form.setValue("course_teacher_data_id", GetCourseData.course_teacher_data_id || []);
    }
  }, [GetCourseData, course_create_form]);

  const course_create_form_onSubmit = (values: z.infer<typeof Course_Update_Schema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      update_Course(values).then((result) => {
        if (result?.success) {
          setSuccess("課程更新成功！");
          course_create_form.reset({
            courseId: courseId,
            course_name: values.course_name,
            course_subject: values.course_subject,
            persons: values.persons,
            grade: values.grade,
            // course_level: values.course_level,
            teacher: values.teacher,
            course_teacher_data_id: values.course_teacher_data_id,
          });
        } else {
          setError(result?.error || "更新失敗，請重試。");
        }
      });
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">
        課程名稱: {GetCourseData?.course_name || "載入中..."}
      </h2>
      <Form {...course_create_form}>
        <form onSubmit={course_create_form.handleSubmit(course_create_form_onSubmit)} className="space-y-6">
          <FormError message={error} />
          <FormSuccess message={success} />
          <div className="space-y-4">
            <FormField
              control={course_create_form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">課程ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled
                      placeholder={courseId}
                      type="text"
                      className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={course_create_form.control}
              name="course_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">課程名稱</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入課程名稱"
                      type="text"
                      className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={course_create_form.control}
              name="course_subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">課程科目</FormLabel>
                  <FormControl>
                    <SWR_School_Subject
                      field={field}
                      className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={course_create_form.control}
              name="persons"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">人數</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入人數"
                      type="number"
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={course_create_form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">年級</FormLabel>
                  <FormControl>
                    <SWR_School_Grade
                      field={field}
                      className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          {/* <div className="space-y-4">
            <FormField
              control={course_create_form.control}
              name="course_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">課程難度</FormLabel>
                  <FormControl>
                    <SWR_Course_Level
                      field={field}
                      className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div> */}
          <div className="space-y-4">
            <FormField
              control={course_create_form.control}
              name="teacher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">老師</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        const selectedTeacher = GetTeacherData.find((data) => data.username === value);
                        if (selectedTeacher?.id) {
                          course_create_form.setValue("course_teacher_data_id", [selectedTeacher.id]);
                        }
                      }}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300">
                        <SelectValue placeholder="選擇老師" />
                      </SelectTrigger>
                      <SelectContent>
                        {GetTeacherData.map(
                          (data) =>
                            data.role === "TEACHER" && (
                              <SelectItem key={data.id} value={data.username}>
                                {data.username}
                              </SelectItem>
                            )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-[#e7915b] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            {isPending ? "正在提交..." : "更改課程"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Course_Update_Form;