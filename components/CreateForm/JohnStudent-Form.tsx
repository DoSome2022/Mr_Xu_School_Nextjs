// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState, useTransition } from "react";
// import * as z from "zod";
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
// import { JoinStudent_Create_Schema } from "@/actions/Create-John/schema";
// import { createJoinStudent } from "@/actions/Create-John";

// interface StudentType {
//   id: string;
//   name: string;
//   pay: boolean;
// }

// interface CourseData {
//   id: string;
//   course_name: string;
// }

// const John_Student_Form = () => {
//   const params = useParams();
//   const courseId = params?.coursedetailbyID as string;
//   const [GetStudentData, setGetStudentData] = useState<StudentType[]>([]);
//   const [GetCourseData, setGetCourseData] = useState<CourseData []>([]);
//   const [isPending, startTransition] = useTransition();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<StudentType[]>([]);

//   useEffect(() => {
//     // 獲取學生數據
//     const fetchStudentData = async () => {
//       try {
//         const res = await fetch(`/api/student/Student_AllLists`);
//         if (!res.ok) throw new Error("斷線！");
//         const result = await res.json();
//         setGetStudentData(result);
//       } catch (error) {
//         console.error("獲取學生數據失敗:", error);
//       }
//     };

//     // 獲取課程數據
//     const fetchCourseData = async (id: string) => {
//       try {
//         const res = await fetch(`/api/Course_detail_data_by_id_findMany/${id}`); // 假設這是課程詳情 API
//         if (!res.ok) throw new Error("斷線！");
//         const result = await res.json();
//         setGetCourseData(result);
//       } catch (error) {
//         console.error("獲取課程數據失敗:", error);
//       }
//     };

//     fetchStudentData();
//     if (courseId) {
//       fetchCourseData(courseId);
//     }
//   }, [courseId]);

//   console.log("GetCourseData :", GetCourseData)

//   // 當 GetCourseData 更新時，設置表單的 course_name
//   useEffect(() => {
//     if (GetCourseData) {
//       form.setValue("course_name", GetCourseData[0]?.course_name);
//     }
//   }, [GetCourseData]);

//   const form = useForm<z.infer<typeof JoinStudent_Create_Schema>>({
//     resolver: zodResolver(JoinStudent_Create_Schema),
//     defaultValues: {
//       courseid: courseId,
//       studentId: "",
//       student: [],
//       course_name: "",
//       targetcourseId: courseId,
//     },
//   });

//   const onSubmit = (values: z.infer<typeof JoinStudent_Create_Schema>) => {
//     console.log("-- JoinStudent -- : ", values, "-- End --");
//     startTransition(async () => {
//       const result = await createJoinStudent(values);
//       if (result?.error) {
//         console.error(result.error);
//         // alert(result.error); // 建議使用 toast 或其他 UI 組件顯示錯誤
//       } else {
//         alert("學生成功加入課程！"); // 建議使用 toast 或其他 UI 組件顯示成功
//       }
//     });
//   };

//   console.log("-- Bug -- :", form.formState.errors, "-- END --");

//   const handleSearch = async () => {
//     if (!searchQuery.trim()) {
//       setSearchResults([]); // 清空結果如果搜索欄為空
//       return;
//     }
//     try {
//       const response = await fetch(
//         `/api/AddStudent_Lists_search?query=${encodeURIComponent(searchQuery)}`
//       );
//       if (!response.ok) throw new Error("搜索請求失敗");
//       const data = await response.json();
//       setSearchResults(data);
//       console.log("搜索結果:", data);
//     } catch (error) {
//       console.error("搜尋失敗:", error);
//       setSearchResults([]);
//     }
//   };

//   const renderCheckbox = (student: StudentType) => {
//     if (student.pay === true) {
//       return (
//         <FormField
//           control={form.control}
//           name="student"
//           render={({ field }) => (
//             <FormItem className="flex items-center space-x-2">
//               <FormControl>
//                 <Checkbox
//                   checked={field.value.includes(student.name)}
//                   onCheckedChange={(checked) => {
//                     const currentStudents = [...field.value];
//                     if (checked) {
//                       // 添加學生姓名到 student 數組
//                       field.onChange([...currentStudents, student.name]);
//                       // 更新 studentId 為當前選中的學生 ID
//                       form.setValue("studentId", student.id);
//                     } else {
//                       // 從 student 數組移除學生姓名
//                       field.onChange(
//                         currentStudents.filter((item: string) => item !== student.name)
//                       );
//                       // 如果移除後 student 數組為空，清空 studentId
//                       if (currentStudents.length === 1) {
//                         form.setValue("studentId", "");
//                       }
//                     }
//                   }}
//                 />
//               </FormControl>
//               <FormLabel className="font-normal">{student.name}</FormLabel>
//             </FormItem>
//           )}
//         />
//       );
//     }
//     return null;
//   };

//   const displayData = searchQuery && searchResults.length > 0 ? searchResults : GetStudentData;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center space-x-2">
//         <Input
//           type="text"
//           placeholder="輸入搜索內容..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="flex-1"
//         />
//         <Button type="button" onClick={handleSearch}>
//           搜索
//         </Button>
//       </div>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <div className="space-y-4">
//             <FormLabel>學生</FormLabel>
//             {displayData.length === 0 ? (
//               <p>{searchQuery ? "沒有找到匹配的學生" : "沒有數據"}</p>
//             ) : (
//               displayData.map((student) => (
//                 <div key={student.id}>{renderCheckbox(student)}</div>
//               ))
//             )}
//           </div>

//           <Button disabled={isPending} type="submit">
//             加入
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default John_Student_Form;


"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import * as z from "zod";
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
import { JoinStudent_Create_Schema } from "@/actions/Create-John/schema";
import { createJoinStudent } from "@/actions/Create-John";

interface StudentType {
  id: string;
  name: string;
  pay: boolean;
}

interface CourseData {
  id: string;
  course_name: string;
}

const John_Student_Form = () => {
  const params = useParams();
  const courseId = params?.coursedetailbyID as string;
  const [GetStudentData, setGetStudentData] = useState<StudentType[]>([]);
  const [GetCourseData, setGetCourseData] = useState<CourseData | null>(null);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StudentType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await fetch(`/api/student/Student_AllLists`);
        if (!res.ok) throw new Error("無法連接到學生數據 API");
        const result = await res.json();
        setGetStudentData(result);
      } catch (error: any) {
        console.error("獲取學生數據失敗:", error);
        setError("無法加載學生數據");
      }
    };

    const fetchCourseData = async (id: string) => {
      try {
        const res = await fetch(`/api/Course_detail_data_by_id_findMany/${id}`);
        if (!res.ok) throw new Error("無法連接到課程數據 API");
        const result = await res.json();
        setGetCourseData(Array.isArray(result) ? result[0] : result);
      } catch (error: any) {
        console.error("獲取課程數據失敗:", error);
        setError("無法加載課程數據");
      }
    };

    fetchStudentData();
    if (courseId) {
      fetchCourseData(courseId);
    }
  }, [courseId]);

  useEffect(() => {
    if (GetCourseData && GetCourseData.course_name) {
      form.setValue("course_name", GetCourseData.course_name);
    } else {
      form.setValue("course_name", "");
    }
  }, [GetCourseData]);

  const form = useForm<z.infer<typeof JoinStudent_Create_Schema>>({
    resolver: zodResolver(JoinStudent_Create_Schema),
    defaultValues: {
      courseid: courseId || "",
      studentId: "",
      student: [],
      course_name: "",
      targetcourseId: courseId || "",
    },
  });

  const onSubmit = (values: z.infer<typeof JoinStudent_Create_Schema>) => {
    console.log("-- JoinStudent -- : ", values, "-- End --");
    startTransition(async () => {
      try {
        const result = await createJoinStudent(values);
        if (result?.error) {
          console.error(result.error);
          setError(result.error);
        } else {
          setError(null);
          // 客戶端不會到達這裡，因為服務器端會執行重定向
        }
      } catch (error: any) {
        console.error("提交失敗:", error);
        setError("提交表單時發生錯誤");
      }
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(
        `/api/AddStudent_Lists_search?query=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error("搜索請求失敗");
      const data = await response.json();
      setSearchResults(data);
      console.log("搜索結果:", data);
    } catch (error: any) {
      console.error("搜尋失敗:", error);
      setSearchResults([]);
      setError("搜尋學生失敗");
    }
  };

  const renderCheckbox = (student: StudentType) => {
    if (student.pay === true) {
      return (
        <FormField
          control={form.control}
          name="student"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value.includes(student.name)}
                  onCheckedChange={(checked) => {
                    const currentStudents = [...field.value];
                    if (checked) {
                      field.onChange([...currentStudents, student.name]);
                      form.setValue("studentId", student.id);
                    } else {
                      field.onChange(
                        currentStudents.filter((item: string) => item !== student.name)
                      );
                      if (currentStudents.length === 1) {
                        form.setValue("studentId", "");
                      }
                    }
                  }}
                />
              </FormControl>
              <FormLabel className="font-normal">{student.name}</FormLabel>
            </FormItem>
          )}
        />
      );
    }
    return null;
  };

  const displayData = searchQuery && searchResults.length > 0 ? searchResults : GetStudentData;

  return (
    <div className="space-y-6">
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="輸入搜索內容..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="button" onClick={handleSearch}>
          搜索
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormLabel>學生</FormLabel>
            {displayData.length === 0 ? (
              <p>{searchQuery ? "沒有找到匹配的學生" : "沒有數據"}</p>
            ) : (
              displayData.map((student) => (
                <div key={student.id}>{renderCheckbox(student)}</div>
              ))
            )}
          </div>

          <Button disabled={isPending} type="submit">
            加入
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default John_Student_Form;