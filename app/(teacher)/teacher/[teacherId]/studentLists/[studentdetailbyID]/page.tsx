// "use client";

// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";



// const StudentDetail = () => {

//   const param = useParams();
//   console.log(param);
//   const studentId = param?.studentdetailbyID as string;
//   const teacherId = param?.teacherId as string;
  
//   const [ getstudentData , setgetstudentData ] = useState([]);

//   useEffect(()=>{
//     const fetchStudentData = async (id:string) => {
//       const res = await fetch(`/api/student/Student_Lists_detail_data_by_id/${id}`);
//       if(!res){
//         throw new Error("斷線！");
//       }

//       const result = await res.json();
//       setgetstudentData(result)

//     }
//     fetchStudentData(studentId)
//   },[studentId])

//   console.log("--getstudentData : --  ",getstudentData,"-- END --")

//   const dailyreviews = getstudentData[0]?.dailyreview;

//   console.log("dailyreviews: ",dailyreviews)

//     return (
//         <div className="container mx-auto p-4 bg-blue-100">
//           <div className="grid grid-cols-6 gap-4">
//             <div className="self-end col-span-6">
//               <div className="row">
//                 <div className="col-3">
//                   <p className="text-gray-500">學生資料</p>
//                 </div>
//                 <div className="col-3">
//                   {/* Empty div for alignment */}
//                 </div>
//                 <div className="col-2">
//                   {/* Empty div for alignment */}
//                 </div>
//                 <div className="col-4">
//                   <form>
//                     <button className="bg-blue-500 text-white px-4 py-2 rounded">返回</button>
//                     <button className="bg-blue-500 text-white px-4 py-2 rounded">登出</button>
//                   </form>
//                 </div>
//               </div>
//             </div>
//             <nav className="col-span-6">
//               <ul className="list-none p-0">
//                 <li><a href="#profile" className="text-blue-500 py-2 hover:underline">個人信息</a></li>
//                 <li><a href="#scheudle" className="text-blue-500 py-2 hover:underline">時間表</a></li>
//                 <li><a href="#note" className="text-blue-500 py-2 hover:underline">筆記</a></li>
//                 <li><a href="#student" className="text-blue-500 py-2 hover:underline font-bold">學生</a></li>
//                 <li><a href="#record" className="text-blue-500 py-2 hover:underline">工作紀錄</a></li>
//               </ul>
//             </nav>
//             <div className="col-span-6">
//               {/* Empty div for alignment */}
//             </div>
//             <div className="col-span-6">
//               <table className="w-full">
//                 <tbody>
//                   <tr>
//                     <th className="text-center">就讀學校</th>
//                     <td colSpan="5">油麻地天主教</td>
//                   </tr>
//                   <tr>
//                     <th className="text-center">班級</th>
//                     <td colSpan="5">小三</td>
//                   </tr>
//                   <tr>
//                     <th className="text-center">學生ID</th>
//                     <td colSpan="5">XXXXXXXXX</td>
//                   </tr>
//                   <tr>
//                     <th className="text-center">分段</th>
//                     <td colSpan="5">低班</td>
//                   </tr>
//                   <tr>
//                     <th className="text-center">考試範圍</th>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">中文</button></td>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">英文</button></td>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">數學</button></td>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">中作</button></td>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">英作</button></td>
//                   </tr>
//                   <tr>
//                     <th className="text-center">校曆表</th>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">中文</button></td>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">英文</button></td>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">數學</button></td>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">中作</button></td>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">英作</button></td>
//                   </tr>
//                   <tr>
//                     <th className="text-center">考試卷</th>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">中文</button></td>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">英文</button></td>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">數學</button></td>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">中作</button></td>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">英作</button></td>
//                   </tr>
//                   <tr>
//                     <th className="text-center">考試時間表</th>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">中文</button></td>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">英文</button></td>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">數學</button></td>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">中作</button></td>
//                     <td><button className="bg-blue-500 text-white px-4 py-2 rounded">英作</button></td>
//                   </tr>
//                   <tr>
//                     <th className="text-center">成績</th>
//                     <td>中文：____</td>
//                     <td>英文：____</td>
//                     <td>數學：____</td>
//                     <td>中作：____</td>
//                     <td>英作：____</td>
//                   </tr>
//                 </tbody>
//               </table>

//               <div>
//                 text
//                 {getstudentData?.map((d:any)=>{
//                   return(
//                     <>
//                     姓名:  {d.name}
//                     <br />
//                     中文考試時間：{d.chine_ex_day}
//                     <br />
//                     英文考試時間：{d.eng_ex_day}
//                     <br />
//                     數學考試時間：{d.math_ex_day}
//                     </>
//                   )
//                 })}
//                 <br />
//                   <Link href={`/teacher/${teacherId}/studentLists/${studentId}/Createdailyreviews`}>
//                   建立日常評論
//                   </Link>

//                 {dailyreviews?.map((d:any)=>{
//                   return(
//                     <>
//                     <Link href={`/teacher/${teacherId}/studentLists/${studentId}/${d.id}/edit`}>
//                     <br />
//                     標題: {d.title}
//                     <br />
//                     內容: {d.content}
//                     <br />
//                     </Link>

//                     </>
//                   )
//                 })}

//               </div>


//             </div>
//           </div>
//         </div>
//       );
// }
// export default StudentDetail


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

// 定義型別
interface DailyReview {
  id: string;
  title: string;
  content: string;
}

interface StudentData {
  id: string;
  name: string;
  chine_ex_day?: string;
  eng_ex_day?: string;
  math_ex_day?: string;
  school?: string;
  grade?: string;
  dailyreview: DailyReview[];
}

const StudentDetail = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams<{ teacherId: string; studentdetailbyID: string }>();
  const teacherId = params?.teacherId as string;
  const studentId = params?.studentdetailbyID as string;

  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 身份驗證檢查
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/stafflogin");
    } else if (session?.user.id !== teacherId || session?.user.role !== "TEACHER") {
      setError("無權訪問此頁面");
      router.push("/auth/error?error=AccessDenied");
    }
  }, [status, session, teacherId, router]);

  // 獲取學生數據
  useEffect(() => {
    if (studentId && status === "authenticated" && !error) {
      const fetchStudentData = async (id: string) => {
        try {
          const res = await fetch(`/api/student/Student_Lists_detail_data_by_id/${id}`, {
            cache: "no-store",
          });
          if (!res.ok) {
            throw new Error("無法獲取學生數據");
          }
          const result: StudentData[] = await res.json();
          setStudentData(result);
        } catch (error: any) {
          console.error("獲取學生數據失敗:", error.message);
          setError("無法載入學生數據，請稍後重試");
        }
      };
      fetchStudentData(studentId);
    }
  }, [studentId, status, error]);

  if (status === "loading") {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        <span>學生資料</span>
        <br />
        {error}
      </div>
    );
  }

  const dailyreviews = studentData[0]?.dailyreview ?? [];

  return (
    <div className="container mx-auto p-4 bg-blue-100">
      <div className="grid grid-cols-6 gap-4">
        <div className="self-end col-span-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-lg">學生資料</p>
            <div className="flex space-x-2">
              <Link href={`/teacher/${teacherId}/studentLists`} className="bg-blue-500 text-white px-4 py-2 rounded">
                返回
              </Link>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">登出</button>
            </div>
          </div>
        </div>
        <nav className="col-span-6">
          <ul className="list-none p-0 flex space-x-4">
            <li><Link href="#profile" className="text-blue-500 py-2 hover:underline">個人信息</Link></li>
            <li><Link href="#schedule" className="text-blue-500 py-2 hover:underline">時間表</Link></li>
            <li><Link href="#note" className="text-blue-500 py-2 hover:underline">筆記</Link></li>
            <li><Link href="#student" className="text-blue-500 py-2 hover:underline font-bold">學生</Link></li>
            <li><Link href="#record" className="text-blue-500 py-2 hover:underline">工作紀錄</Link></li>
          </ul>
        </nav>
        <div className="col-span-6">
          {studentData.length > 0 ? (
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <tbody>
                <tr>
                  <th className="border px-4 py-2 text-center">就讀學校</th>
                  <td colSpan={5} className="border px-4 py-2">{studentData[0].school || "未設置"}</td>
                </tr>
                <tr>
                  <th className="border px-4 py-2 text-center">班級</th>
                  <td colSpan={5} className="border px-4 py-2">{studentData[0].grade || "未設置"}</td>
                </tr>
                <tr>
                  <th className="border px-4 py-2 text-center">學生ID</th>
                  <td colSpan={5} className="border px-4 py-2">{studentData[0].id}</td>
                </tr>
                <tr>
                  <th className="border px-4 py-2 text-center">分段</th>
                  <td colSpan={5} className="border px-4 py-2">低班</td>
                </tr>
                <tr>
                  <th className="border px-4 py-2 text-center">考試範圍</th>
                  {["中文", "英文", "數學", "中作", "英作"].map((subject) => (
                    <td key={subject} className="border px-4 py-2">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded">{subject}</button>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th className="border px-4 py-2 text-center">校曆表</th>
                  {["中文", "英文", "數學", "中作", "英作"].map((subject) => (
                    <td key={subject} className="border px-4 py-2">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded">{subject}</button>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th className="border px-4 py-2 text-center">考試卷</th>
                  {["中文", "英文", "數學", "中作", "英作"].map((subject) => (
                    <td key={subject} className="border px-4 py-2">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded">{subject}</button>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th className="border px-4 py-2 text-center">考試時間表</th>
                  {["中文", "英文", "數學", "中作", "英作"].map((subject) => (
                    <td key={subject} className="border px-4 py-2">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded">{subject}</button>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th className="border px-4 py-2 text-center">成績</th>
                  {["中文", "英文", "數學", "中作", "英作"].map((subject) => (
                    <td key={subject} className="border px-4 py-2">{subject}：____</td>
                  ))}
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="text-center">暫無學生數據</p>
          )}
          <div className="mt-4">
            {studentData.length > 0 ? (
              studentData.map((d) => (
                <div key={d.id}>
                  <p>姓名: {d.name}</p>
                  <p>中文考試時間: {d.chine_ex_day ? new Date(d.chine_ex_day).toLocaleString() : "未設置"}</p>
                  <p>英文考試時間: {d.eng_ex_day ? new Date(d.eng_ex_day).toLocaleString() : "未設置"}</p>
                  <p>數學考試時間: {d.math_ex_day ? new Date(d.math_ex_day).toLocaleString() : "未設置"}</p>
                </div>
              ))
            ) : (
              <p>無學生信息</p>
            )}
            <br />
            <Link
              href={`/teacher/${teacherId}/studentLists/${studentId}/Createdailyreviews`}
              className="text-blue-500 hover:underline"
            >
              建立日常評論
            </Link>
            {dailyreviews.length > 0 ? (
              dailyreviews.map((d) => (
                <div key={d.id}>
                  <Link
                    href={`/teacher/${teacherId}/studentLists/${studentId}/${d.id}/edit`}
                    className="text-blue-500 hover:underline"
                  >
                    <p>標題: {d.title}</p>
                    <p>內容: {d.content}</p>
                  </Link>
                </div>
              ))
            ) : (
              <p>暫無日常評論</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;