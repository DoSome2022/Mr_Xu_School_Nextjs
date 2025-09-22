// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import ClassDetailLists from "@/components/DatasLIsts/ClassDetailLists";

// interface CourseData {
//   id: string;
//   course_name: string;
//   course_subject: string;
//   persons: number;
//   teacher: string;
//   grade: number;
//   day_start: string;
//   day_end: string;
//   start_time: string;
//   end_time: string;
//   days: { date: string; start_time: string; end_time: string; lesson: string }[];
//   weekdays: { date: string; start_time: string; end_time: string; lesson: string }[];
//   publicholiday_model: string[];
//   TimeTemplateID: string;
//   classroom: string;
//   isshow: boolean;
// }

// const gradeMapping: { [key: number]: string } = {
//   1: "小學1年級",
//   2: "小學2年級",
//   3: "小學3年級",
//   4: "小學4年級",
//   5: "小學5年級",
//   6: "小學6年級",
//   7: "初中1年級",
//   8: "初中2年級",
//   9: "初中3年級",
//   10: "高中1年級",
//   11: "高中2年級",
//   12: "高中3年級",
// };

// const CourseDetail = () => {
//   const params = useParams();
//   const router = useRouter();
//   const CourseId = params?.coursedetailbyID as string;

//   const [GetCourseDataById, setGetCourseDataById] = useState<CourseData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (CourseId) {
//       const getCourseDetail = async (id: string) => {
//         setLoading(true);
//         setError(null);
//         try {
//           const res = await fetch(`/api/Course_detail_data_by_id/${id}`);
//           if (!res.ok) {
//             throw new Error("無法獲取課程數據");
//           }
//           const result = await res.json();
//           setGetCourseDataById(result);
//         } catch (error: any) {
//           console.error("獲取課程數據失敗:", error);
//           setError("無法載入課程數據");
//         } finally {
//           setLoading(false);
//         }
//       };
//       getCourseDetail(CourseId);
//     } else {
//       setError("無效的課程ID");
//       setLoading(false);
//     }
//   }, [CourseId]);

//   console.log("GetCourseDataById:", GetCourseDataById);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
//         <p className="text-gray-600 text-lg">正在加載...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
//         <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
//       </div>
//     );
//   }

//   if (!GetCourseDataById) {
//     return (
//       <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
//         <p className="text-gray-600">無課程數據</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 pt-20">
//       {/* 導航欄 */}
//       <nav className="bg-[#80A8BD] shadow-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex items-center">
//               <h1 className="text-2xl font-bold text-white">課程詳情</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Link
//                 href="/admin/courseLists"
//                 className="text-white hover:bg-cyan-200 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
//               >
//                 返回課程列表
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* 主內容 */}
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-[#80A8BD]">
//             {GetCourseDataById.course_name}
//           </h1>
//           <div className="space-x-4">
//             <Link
//               href={`/admin/courseLists/${GetCourseDataById.id}/createClass`}
//               className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
//             >
//               建立課堂
//             </Link>
//             <Link
//               href={`/admin/courseLists/${GetCourseDataById.id}/edit`}
//               className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
//             >
//               更改課程
//             </Link>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">課程資料</h2>
//           <div className="grid gap-4">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-700">課程名稱</h3>
//               <p className="text-gray-600">{GetCourseDataById.course_name}</p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-700">科目</h3>
//               <p className="text-gray-600">{GetCourseDataById.course_subject}</p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-700">人數</h3>
//               <p className="text-gray-600">{GetCourseDataById.persons}</p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-700">老師</h3>
//               <p className="text-gray-600">{GetCourseDataById.teacher}</p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-700">年級</h3>
//               <p className="text-gray-600">{gradeMapping[GetCourseDataById.grade] || "未知年級"}</p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-700">課程時間</h3>
//               <p className="text-gray-600">
//                 {GetCourseDataById.day_start} 至 {GetCourseDataById.day_end}, {GetCourseDataById.start_time} - {GetCourseDataById.end_time}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">課堂列表</h2>
//           <ClassDetailLists data={GetCourseDataById} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseDetail;


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ClassDetailLists from "@/components/DatasLIsts/ClassDetailLists";
import { Course } from "@/types/course"; // 導入共享介面

const gradeMapping: { [key: number]: string } = {
  1: "小學1年級",
  2: "小學2年級",
  3: "小學3年級",
  4: "小學4年級",
  5: "小學5年級",
  6: "小學6年級",
  7: "初中1年級",
  8: "初中2年級",
  9: "初中3年級",
  10: "高中1年級",
  11: "高中2年級",
  12: "高中3年級",
};

const CourseDetail = () => {
  const params = useParams();
  const router = useRouter();
  const CourseId = params?.coursedetailbyID as string;

  const [GetCourseDataById, setGetCourseDataById] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (CourseId) {
      const getCourseDetail = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/Course_detail_data_by_id/${id}`);
          if (!res.ok) {
            throw new Error("無法獲取課程數據");
          }
          const result = await res.json();
          setGetCourseDataById(result);
        } catch (error: any) {
          console.error("獲取課程數據失敗:", error);
          setError("無法載入課程數據");
        } finally {
          setLoading(false);
        }
      };
      getCourseDetail(CourseId);
    } else {
      setError("無效的課程ID");
      setLoading(false);
    }
  }, [CourseId]);

  console.log("GetCourseDataById:", GetCourseDataById);

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

  if (!GetCourseDataById) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600">無課程數據</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <nav className="bg-[#80A8BD] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">課程詳情</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/courseLists"
                className="text-white hover:bg-cyan-200 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                返回課程列表
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">
            {GetCourseDataById.course_name}
          </h1>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            {/* <Link
              href={`/admin/courseLists/${GetCourseDataById.id}/createClass`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              建立課堂
            </Link> */}
            <Link
              href={`/admin/courseLists/${GetCourseDataById.id}/edit`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              更改課程
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">課程資料</h2>
          <div className="grid gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">課程名稱</h3>
              <p className="text-gray-600">{GetCourseDataById.course_name}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">科目</h3>
              <p className="text-gray-600">{GetCourseDataById.course_subject}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">人數</h3>
              <p className="text-gray-600">{GetCourseDataById.persons}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">老師</h3>
              <p className="text-gray-600">{GetCourseDataById.teacher}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">年級</h3>
              <p className="text-gray-600">{gradeMapping[GetCourseDataById.grade] || "未知年級"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">課程時間</h3>
              <p className="text-gray-600">
                {GetCourseDataById.day_start} 至 {GetCourseDataById.day_end}, {GetCourseDataById.start_time} - {GetCourseDataById.end_time}
              </p>
            </div>
            {GetCourseDataById.course_level && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700">課程級別</h3>
                <p className="text-gray-600">{GetCourseDataById.course_level}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">課堂列表</h2>
          <ClassDetailLists data={GetCourseDataById} />
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;