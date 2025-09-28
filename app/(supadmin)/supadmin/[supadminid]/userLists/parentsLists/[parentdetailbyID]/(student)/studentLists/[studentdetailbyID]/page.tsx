"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Invoice_Create_Schema } from "@/actions/Create-Invoice/schema";
import { createInvoice_action } from "@/actions/Create-Invoice";
import { z } from "zod";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { SWR_Payment_Methods_checkbox } from "@/components/fatchdata/swrpayment_methods";
import { SWR_Server_Type } from "@/components/fatchdata/swrserver_type";

// 定義年級對應對象
const gradeMapping: { [key: string]: string } = {
  "1": "小學1年級",
  "2": "小學2年級",
  "3": "小學3年級",
  "4": "小學4年級",
  "5": "小學5年級",
  "6": "小學6年級",
  "7": "初中1年級",
  "8": "初中2年級",
  "9": "初中3年級",
  "10": "高中1年級",
  "11": "高中2年級",
  "12": "高中3年級",
};

interface StudentData {
  id: string;
  name: string;
  grade: string;
  school: string;
  course: StudentCourse[];
}

interface StudentCourse {
  course_name: string;
  course_subject: string;
  classroom: string;
  start_time: string;
  end_time: string;
  class: StudentClass[];
}

interface StudentClass {
  class_date: string;
  class_subject: string;
  classroom: string;
  class_start_time: string;
  class_end_time: string;
}

const StudentDetailbysupadmin = () => {
  const params = useParams<{ parentdetailbyID: string; studentdetailbyID: string ; supadminid: string}>();
  const ParentId = params?.parentdetailbyID as string;
  const supadminId = params?.supadminid as string;
  const StudentId = params?.studentdetailbyID as string; // 新增：取得學生 ID

  // 學生資料狀態
  const [GetStudentData, setGetStudentData] = useState<StudentData[]>([]);
  // 當前選擇的年份和月份
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  // 控制課程展開/收起狀態
  const [expandedCourses, setExpandedCourses] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  // 控制發票表單顯示
  const [showInvoiceForm, setShowInvoiceForm] = useState<boolean>(false);

  // 獲取學生資料
  useEffect(() => {
    if (ParentId) {
      const fetchStudentData = async (parentdataid: string) => {
        const res = await fetch(`/api/student/Student_Lists/${parentdataid}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) {
          console.error("獲取學生資料失敗:", res.statusText);
          alert("無法獲取學生資料，請稍後重試");
          return;
        }
        const result = await res.json();
        // 處理 classroom 字段，假設從 class.classroom 取第一個值
        const transformedData = result.map((student: StudentData) => ({
          ...student,
          course: student.course.map((course: StudentCourse) => ({
            ...course,
            classroom: course.class[0]?.classroom || "未指定",
          })),
        }));
        setGetStudentData(transformedData);
      };
      fetchStudentData(ParentId);
    }
  }, [ParentId]);

  // 提取所有唯一的年份和月份
  const getUniqueYearsAndMonths = (courses: StudentCourse[]): { years: string[]; months: string[] } => {
    const years = new Set<string>();
    const months = new Set<string>();
    courses.forEach((course) => {
      course.class.forEach((cls) => {
        const date = new Date(cls.class_date);
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        years.add(year);
        months.add(month);
      });
    });
    return {
      years: ["all", ...Array.from(years).sort()],
      months: ["all", ...Array.from(months).sort()],
    };
  };

  // 過濾課程和課堂數據
  const filterCourses = (courses: StudentCourse[], year: string, month: string): StudentCourse[] => {
    return courses
      .map((course) => {
        const filteredClasses = course.class.filter((cls) => {
          const date = new Date(cls.class_date);
          const classYear = date.getFullYear().toString();
          const classMonth = (date.getMonth() + 1).toString().padStart(2, "0");
          const yearMatch = year === "all" || year === classYear;
          const monthMatch = month === "all" || month === classMonth;
          return yearMatch && monthMatch;
        });
        return { ...course, class: filteredClasses };
      })
      .filter((course) => course.class.length > 0);
  };

  // 切換課程展開/收起狀態
  const toggleCourse = (courseId: string) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  // 初始化表單
  const invoice_student_create_form = useForm<z.infer<typeof Invoice_Create_Schema>>({
    resolver: zodResolver(Invoice_Create_Schema),
    defaultValues: {
      title: "",
      content: [],
      studentname: "",
      student_id: "",
      price: 0,
      PaymentMethods: [],
      Invoice_id: "",
      servetype: "",
      DB:0,  //折扣金額
      adminFee: 0, //行政費
    },
  });

  // 當學生數據或篩選條件改變時，更新表單
  useEffect(() => {
    if (GetStudentData.length > 0) {
      const student = GetStudentData[0];
      const filteredCourses = filterCourses(student.course, selectedYear, selectedMonth);
      
      // 生成 content 字段內容
      const content = filteredCourses.flatMap((course) =>
        course.class.map(
          (cls) =>
            `${course.course_name} | 日期: ${cls.class_date} | 科目: ${cls.class_subject} | 課室: ${cls.classroom} | 時間: ${cls.class_start_time}-${cls.class_end_time}`
        )
      );

      // 更新表單字段
      invoice_student_create_form.setValue("studentname", student.name, { shouldValidate: true });
      invoice_student_create_form.setValue("student_id", student.id, { shouldValidate: true });
      invoice_student_create_form.setValue("content", content, { shouldValidate: true });
    }
  }, [GetStudentData, selectedYear, selectedMonth, invoice_student_create_form]);

  // 表單提交處理
  const invoice_student_create_form_onSubmit = (values: z.infer<typeof Invoice_Create_Schema>) => {
    console.log("-- create invoice -- : ", values, "-- End --");
    setError("");
    setSuccess("");
    startTransition(() => {
      createInvoice_action(values).then((data) => {
        setError(data?.error ?? undefined);
        setSuccess(data?.success ? "發票創建成功" : data?.success === false ? "發票創建失敗" : undefined); // 轉換為字符串
      });
    });
  };


console.log("Bug : ",invoice_student_create_form.formState.errors,"-- END --")


  // 過濾匹配的學生資料
  const filteredStudent = GetStudentData.find((student) => student.id === StudentId);


  return (
    <div>
      {/* 主要內容 */}
      <div className="p-5 max-w-4xl mx-auto pt-20">
        <h2 className="text-2xl font-bold mb-4">Student Detail</h2>

        {filteredStudent ? (
          <div className="mb-8">
            <Link
              href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${filteredStudent.id}/edit`}
              className="block text-[#80A8BD] hover:text-cyan-200 transition-colors duration-300"
            >
              修改學生
            </Link>

            <p className="font-semibold"><strong>學生名:</strong> {filteredStudent.name}</p>
            <p className="font-semibold"><strong>學校:</strong> {filteredStudent.school}</p>
            <p className="font-semibold"><strong>年級:</strong> {gradeMapping[filteredStudent.grade]}</p>

            {/* 年份和月份選擇器 */}
            <div className="my-5 flex items-center gap-4">
              <label htmlFor="yearFilter" className="mr-2">選擇年份:</label>
              <select
                id="yearFilter"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setSelectedMonth("all");
                }}
                className="p-2 rounded border border-gray-300"
              >
                {getUniqueYearsAndMonths(filteredStudent.course).years.map((year) => (
                  <option key={year} value={year}>
                    {year === "all" ? "全部年份" : year}
                  </option>
                ))}
              </select>

              <label htmlFor="monthFilter" className="mr-2">選擇月份:</label>
              <select
                id="monthFilter"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="p-2 rounded border border-gray-300 disabled:opacity-50"
                disabled={selectedYear === "all"}
              >
                {getUniqueYearsAndMonths(filteredStudent.course).months.map((month) => (
                  <option key={month} value={month}>
                    {month === "all" ? "全部月份" : `${month}月`}
                  </option>
                ))}
              </select>
            </div>

            {/* 課程列表 */}
            <h3 className="mt-5 mb-2 text-lg font-semibold">課程列表</h3>
            {(() => {
              const filteredCourses = filterCourses(filteredStudent.course, selectedYear, selectedMonth);
              return filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div key={course.course_name} className="border border-gray-200 rounded p-4 mb-2">
                    <h4
                      onClick={() => toggleCourse(course.course_name)}
                      className="cursor-pointer flex justify-between items-center text-base font-medium"
                    >
                      {course.course_name} ({course.course_subject})
                      <span className="text-sm">
                        {expandedCourses[course.course_name] ? "▼" : "▶"}
                      </span>
                    </h4>
                    {expandedCourses[course.course_name] && (
                      <div className="mt-2 pl-5">
                        <p><strong>課室:</strong> {course.classroom}</p>
                        <p><strong>時間:</strong> {course.start_time} - {course.end_time}</p>
                        <h5 className="mt-2">課堂:</h5>
                        {course.class.length > 0 ? (
                          course.class.map((cls) => (
                            <div key={cls.class_date} className="border-t border-gray-100 pt-2">
                              <p><strong>日期:</strong> {cls.class_date}</p>
                              <p><strong>科目:</strong> {cls.class_subject}</p>
                              <p><strong>課室:</strong> {cls.classroom}</p>
                              <p><strong>開始時間:</strong> {cls.class_start_time}</p>
                              <p><strong>結束時間:</strong> {cls.class_end_time}</p>
                            </div>
                          ))
                        ) : (
                          <p>該課程在此時間範圍內無課堂</p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>所選時間範圍內無課程</p>
              );
            })()}

            {/* 發票表單控制按鈕 */}
            <div className="mt-5">
              <Button
                onClick={() => setShowInvoiceForm(!showInvoiceForm)}
                disabled={isPending}
                className="mb-2"
              >
                {showInvoiceForm ? "隱藏發票表單" : "顯示發票表單"}
              </Button>
            </div>

            {/* 建立發票表單 */}
            {showInvoiceForm && (
              <div className="transition-all duration-300">
                <h3 className="mt-5 mb-2 text-lg font-semibold">建立發票</h3>
                <Form {...invoice_student_create_form}>
                  <form
                    onSubmit={invoice_student_create_form.handleSubmit(invoice_student_create_form_onSubmit)}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <FormField
                        control={invoice_student_create_form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>標題</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="發票標題"
                                type="text"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={invoice_student_create_form.control}
                        name="Invoice_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>發票編號</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="發票編號"
                                type="text"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={invoice_student_create_form.control}
                        name="servetype"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>服務類型</FormLabel>
                            <FormControl>
                              <SWR_Server_Type field={field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={invoice_student_create_form.control}
                        name="studentname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>學生名稱</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={true}
                                placeholder="學生名稱"
                                type="text"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4" hidden>
                      <FormField
                        control={invoice_student_create_form.control}
                        name="student_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>學生 ID</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={true}
                                placeholder="學生 ID"
                                type="text"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={invoice_student_create_form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>課程內容</FormLabel>
                            <FormControl>
                              <div>
                                {field.value.length > 0 ? (
                                  <table className="w-full border-collapse">
                                    <thead>
                                      <tr className="bg-gray-100">
                                        <th className="border p-2 text-left">課程內容</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {field.value.map((item, index) => (
                                        <tr key={index}>
                                          <td className="border p-2">{item}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                ) : (
                                  <p className="text-gray-500">無課程內容</p>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={invoice_student_create_form.control}
                        name="PaymentMethods"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <SWR_Payment_Methods_checkbox
                                field={{
                                  control: invoice_student_create_form.control,
                                  name: "PaymentMethods",
                                  disabled: isPending,
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={invoice_student_create_form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>價格</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="輸入價格"
                                type="number"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormError message={error} />
                    <FormSuccess message={success as string | undefined} /> {/* 強制轉換 */}
                    <Button disabled={isPending} type="submit">
                      建立發票
                    </Button>
                  </form>
                </Form>
              </div>
            )}

            {/* 其他連結 */}
            <div className="mt-5 space-y-2">
              <Link
                href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${filteredStudent.id}/bookLists`}
                className="block text-blue-600 hover:underline"
              >
                書單
              </Link>
              <Link
                href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${filteredStudent.id}/schooltimetableLists`}
                className="block text-blue-600 hover:underline"
              >
                學校時間表
              </Link>
              <Link
                href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${filteredStudent.id}/expageLists`}
                className="block text-blue-600 hover:underline"
              >
                考試卷
              </Link>
              <Link
                href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${filteredStudent.id}/extimeLists`}
                className="block text-blue-600 hover:underline"
              >
                考試時間表
              </Link>
              <Link
                href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${filteredStudent.id}/exscopeLists`}
                className="block text-blue-600 hover:underline"
              >
                考試範圍表
              </Link>
              <Link
                href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${filteredStudent.id}/scoreLists`}
                className="block text-blue-600 hover:underline"
              >
                成績
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-red-500">未找到對應的學生資料</p>
        )}
      </div>
    </div>
  );
};


export default StudentDetailbysupadmin;


// "use client";


// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useParams } from 'next/navigation';
// import SchoolDetailLists from "@/components/DatasLIsts/SchoolDetailLists";

// // 定義年級對應對象
// const gradeMapping:{[key:string]:string} = {
//     "1": "小學1年級",
//     "2": "小學2年級",
//     "3": "小學3年級",
//     "4": "小學4年級",
//     "5": "小學5年級",
//     "6": "小學6年級",
//     "7": "初中1年級",
//     "8": "初中2年級",
//     "9": "初中3年級",
//     "10": "高中1年級",
//     "11": "高中2年級",
//     "12": "高中3年級",
//   };

// interface StudentData {
//     id: string;
//     name: string;
//     grade: string;
//     school: string;
//     course:[]
// }

// interface StudentCourse {
//     course_name:string;
 
//     class_date:string;
   
//     course_subject:string;
    
//     classroom : string;
    
//     start_time: string;
    
//     end_time: string;

//     class:[];
// }

// interface StudentClass {
//     class_date: string;
   
//     class_subject: string;
    
//     classroom: string
//     class_start_time: string;
    
//     class_end_time:string;
// }

// const StudentDetail = () => {

//     const params = useParams<{parentdetailbyID: string , studentdetailbyID: string,}>();
//     const ParentId = params?.parentdetailbyID as string;




//     //拿學生資料
//     const [GetSutudentData , setGetSutudentData] = useState<StudentData[]>([]);

//   //用ParentId去拿student DB裹的DATA
//   useEffect(()=>{
//     if(ParentId){
//       const fetchStudentData = async (parentdataid : string) => {
//         //在app/api/student/Student_Lists/[id]/route.ts
//         const res = await fetch(`/api/student/Student_Lists/${parentdataid}`);
//         if(!res){
//           throw new Error("斷線！")
//         }
//         const result = await res.json();
//         setGetSutudentData(result);
//       }
//       fetchStudentData(ParentId)
//     }
//   },[ParentId])

// console.log("-- Student Data : --",GetSutudentData,"-- END --")

//     return(
//         <>
//             <span>StudentDetail</span>
//         <br />
//         {GetSutudentData && GetSutudentData.map((student)=>{
//             return(
//                 <>
//                 學生名: {student.name}
//                 <br />
//                 學校：{student.school}
//                 <br />
//                 年級:{ gradeMapping[ student.grade ]}
//                 <br />
//                 class: {student.course.map((d:StudentCourse)=>{
//                     return(
//                         <>
//                         課程名稱：{d.course_name}
//                         <br />
//                         課堂：{d.class.map((classd:StudentClass)=>{
//                             return(
//                                 <>
//                                 <br />
//                                 日期:{classd.class_date}
//                                 <br />
//                                 科目:{classd.class_subject}
//                                 <br />
//                                 課窒：{classd.classroom}
//                                 <br />
//                                 開始時間：{classd.class_start_time}
//                                 <br />
//                                 完結時間:{classd.class_end_time}
//                                 <br />
//                                 </>
//                             )
//                         })}

//                         </>
//                     )
//                 })}
//                 <br />
//                 <Link
//                    className="text-stone-950 hover:text-gray-700"
//                     href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/bookLists`}
//                 >
//                     書單
//                 </Link>
//                 <br />
//                 <Link
//                     className="text-stone-950 hover:text-gray-700"
//                     href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/schooltimetableLists`}
//                 >
//                     學校時間表
//                 </Link>
//                 <br />
//                 <Link
//                     className="text-stone-950 hover:text-gray-700"
//                     href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/expageLists`}
//                 >
//                     考試卷
//                 </Link>
//                 <br />
//                 <Link
//                     className="text-stone-950 hover:text-gray-700"
//                     href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/extimeLists`}
//                 >
//                     考試時間表
//                 </Link>
//                 <br />
//                 <Link
//                     className="text-stone-950 hover:text-gray-700"
//                     href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/exscopeLists`}
//                 >
//                     考試範圍表
//                 </Link>
//                 <br />
//                 <Link
//                     className="text-stone-950 hover:text-gray-700"
//                     href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/scoreLists`}
//                 >
//                     成縝
//                 </Link>
//                 <br />
//                 </>
//             )
//         })}
          
//         </>
//     )
// }
// export default StudentDetail

// "use client";

// import { useEffect, useState, useTransition } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";

// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
//   } from "@/components/ui/form";
//   import { useForm } from "react-hook-form";
//   import { zodResolver } from "@hookform/resolvers/zod";
//   import { Input } from "@/components/ui/input";
//   import { Button } from "@/components/ui/button";
//   import { Invoice_Create_Schema } from "@/actions/Create-Invoice/schema";
//   import { createInvoice_action } from "@/actions/Create-Invoice";
// import { z } from "zod";

  

// // 定義年級對應對象
// const gradeMapping: { [key: string]: string } = {
//   "1": "小學1年級",
//   "2": "小學2年級",
//   "3": "小學3年級",
//   "4": "小學4年級",
//   "5": "小學5年級",
//   "6": "小學6年級",
//   "7": "初中1年級",
//   "8": "初中2年級",
//   "9": "初中3年級",
//   "10": "高中1年級",
//   "11": "高中2年級",
//   "12": "高中3年級",
// };

// interface StudentData {
//   id: string;
//   name: string;
//   grade: string;
//   school: string;
//   course: StudentCourse[];
// }

// interface StudentCourse {
//   course_name: string;
//   course_subject: string;
//   classroom: string;
//   start_time: string;
//   end_time: string;
//   class: StudentClass[];
// }

// interface StudentClass {
//   class_date: string;
//   class_subject: string;
//   classroom: string;
//   class_start_time: string;
//   class_end_time: string;
// }

// const StudentDetail = () => {
//   const params = useParams<{ parentdetailbyID: string; studentdetailbyID: string }>();
//   const ParentId = params?.parentdetailbyID as string;

//   // 學生資料狀態
//   const [GetStudentData, setGetStudentData] = useState<StudentData[]>([]);
//   // 當前選擇的年份和月份
//   const [selectedYear, setSelectedYear] = useState<string>("all");
//   const [selectedMonth, setSelectedMonth] = useState<string>("all");
//   // 控制課程展開/收起狀態
//   const [expandedCourses, setExpandedCourses] = useState<{ [key: string]: boolean }>({});
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
// const [isPending, startTransition] = useTransition();

//   // 獲取學生資料
//   useEffect(() => {
//     if (ParentId) {
//       const fetchStudentData = async (parentdataid: string) => {
//         const res = await fetch(`/api/student/Student_Lists/${parentdataid}`);
//         if (!res.ok) {
//           console.error("獲取學生資料失敗:", res.statusText);
//           alert("無法獲取學生資料，請稍後重試");
//           return;
//         }
//         const result = await res.json();
//         setGetStudentData(result);
//       };
//       fetchStudentData(ParentId);
//     }
//   }, [ParentId]);

//   // 提取所有唯一的年份和月份
//   const getUniqueYearsAndMonths = (courses: StudentCourse[]): { years: string[]; months: string[] } => {
//     const years = new Set<string>();
//     const months = new Set<string>();
//     courses.forEach((course) => {
//       course.class.forEach((cls) => {
//         const date = new Date(cls.class_date);
//         const year = date.getFullYear().toString();
//         const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 格式為 "01" 到 "12"
//         years.add(year);
//         months.add(month);
//       });
//     });
//     return {
//       years: ["all", ...Array.from(years).sort()],
//       months: ["all", ...Array.from(months).sort()],
//     };
//   };

//   // 過濾課程和課堂數據
//   const filterCourses = (courses: StudentCourse[], year: string, month: string): StudentCourse[] => {
//     return courses
//       .map((course) => {
//         const filteredClasses = course.class.filter((cls) => {
//           const date = new Date(cls.class_date);
//           const classYear = date.getFullYear().toString();
//           const classMonth = (date.getMonth() + 1).toString().padStart(2, "0");
//           const yearMatch = year === "all" || year === classYear;
//           const monthMatch = month === "all" || month === classMonth;
//           return yearMatch && monthMatch;
//         });
//         return { ...course, class: filteredClasses };
//       })
//       .filter((course) => course.class.length > 0); // 只保留有課堂的課程
//   };

//   // 切換課程展開/收起狀態
//   const toggleCourse = (courseId: string) => {
//     setExpandedCourses((prev) => ({
//       ...prev,
//       [courseId]: !prev[courseId],
//     }));
//   };


//   const invoice_student_create_form = useForm<z.infer<typeof Invoice_Create_Schema>>({
//     resolver: zodResolver(Invoice_Create_Schema),
//     defaultValues: {
//       title: "",
//       content: [],
//       studentname: "",
//       student_id: "",
//       price: 0,
//       PaymentMethods: [],
//       Invoice_id: "",
//       servetype: "",
//     },
//   });

//   const invoice_student_create_form_onSubmit = (values: z.infer<typeof Invoice_Create_Schema>) => {
//     console.log("-- create invoice -- : ", values, "-- End --");
//     setError("");
//     setSuccess("");
//     startTransition(() => {
//       createInvoice_action(values).then((data) => {
//         setError(data?.error ?? undefined);
//         setSuccess(data?.success ?? undefined);
//       });
//     });
//   };




// console.log('GetStudentData :', GetStudentData,"-- END --")


//   return (
//     <div className="p-5 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Student Detail</h2>
//       {GetStudentData &&
//         GetStudentData.map((student) => {
//           const { years, months } = getUniqueYearsAndMonths(student.course);
//           const filteredCourses = filterCourses(student.course, selectedYear, selectedMonth);

//           return (
//             <div key={student.id} className="mb-8">
//               <p className="font-semibold"><strong>學生名:</strong> {student.name}</p>
//               <p className="font-semibold"><strong>學校:</strong> {student.school}</p>
//               <p className="font-semibold"><strong>年級:</strong> {gradeMapping[student.grade]}</p>

//               {/* 年份和月份選擇器 */}
//               <div className="my-5 flex items-center gap-4">
//                 <label htmlFor="yearFilter" className="mr-2">選擇年份:</label>
//                 <select
//                   id="yearFilter"
//                   value={selectedYear}
//                   onChange={(e) => {
//                     setSelectedYear(e.target.value);
//                     setSelectedMonth("all"); // 重置月份選擇
//                   }}
//                   className="p-2 rounded border border-gray-300"
//                 >
//                   {years.map((year) => (
//                     <option key={year} value={year}>
//                       {year === "all" ? "全部年份" : year}
//                     </option>
//                   ))}
//                 </select>

//                 <label htmlFor="monthFilter" className="mr-2">選擇月份:</label>
//                 <select
//                   id="monthFilter"
//                   value={selectedMonth}
//                   onChange={(e) => setSelectedMonth(e.target.value)}
//                   className="p-2 rounded border border-gray-300 disabled:opacity-50"
//                   disabled={selectedYear === "all"}
//                 >
//                   {months.map((month) => (
//                     <option key={month} value={month}>
//                       {month === "all" ? "全部月份" : `${month}月`}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* 課程列表 */}
//               <h3 className="mt-5 mb-2 text-lg font-semibold">課程列表</h3>
//               {filteredCourses.length > 0 ? (
//                 filteredCourses.map((course) => (
//                   <div key={course.course_name} className="border border-gray-200 rounded p-4 mb-2">
//                     <h4
//                       onClick={() => toggleCourse(course.course_name)}
//                       className="cursor-pointer flex justify-between items-center text-base font-medium"
//                     >
//                       {course.course_name} ({course.course_subject})
//                       <span className="text-sm">
//                         {expandedCourses[course.course_name] ? "▼" : "▶"}
//                       </span>
//                     </h4>
//                     {expandedCourses[course.course_name] && (
//                       <div className="mt-2 pl-5">
//                         <p><strong>課室:</strong> {course.classroom}</p>
//                         <p><strong>時間:</strong> {course.start_time} - {course.end_time}</p>
//                         <h5 className="mt-2">課堂:</h5>
//                         {course.class.length > 0 ? (
//                           course.class.map((cls) => (
//                             <div key={cls.class_date} className="border-t border-gray-100 pt-2">
//                               <p><strong>日期:</strong> {cls.class_date}</p>
//                               <p><strong>科目:</strong> {cls.class_subject}</p>
//                               <p><strong>課室:</strong> {cls.classroom}</p>
//                               <p><strong>開始時間:</strong> {cls.class_start_time}</p>
//                               <p><strong>結束時間:</strong> {cls.class_end_time}</p>
//                             </div>
//                           ))
//                         ) : (
//                           <p>該課程在此時間範圍內無課堂</p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <p>所選時間範圍內無課程</p>
//               )}

//               {/* 其他連結 */}
//               <div className="mt-5 space-y-2">
//                 <Link href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/bookLists`} className="block text-blue-600 hover:underline">
//                   書單
//                 </Link>
//                 <Link href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/schooltimetableLists`} className="block text-blue-600 hover:underline">
//                   學校時間表
//                 </Link>
//                 <Link href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/expageLists`} className="block text-blue-600 hover:underline">
//                   考試卷
//                 </Link>
//                 <Link href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/extimeLists`} className="block text-blue-600 hover:underline">
//                   考試時間表
//                 </Link>
//                 <Link href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/exscopeLists`} className="block text-blue-600 hover:underline">
//                   考試範圍表
//                 </Link>
//                 <Link href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${student.id}/scoreLists`} className="block text-blue-600 hover:underline">
//                   成績
//                 </Link>
//               </div>
//             </div>
//           );
//         })}
//     </div>
//   );
// };

// export default StudentDetail;