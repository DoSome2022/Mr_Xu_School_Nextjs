// "use client";

// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// // 定義年級對應對象
// const gradeMapping = {
//     1: "小學1年級",
//     2: "小學2年級",
//     3: "小學3年級",
//     4: "小學4年級",
//     5: "小學5年級",
//     6: "小學6年級",
//     7: "初中1年級",
//     8: "初中2年級",
//     9: "初中3年級",
//     10: "高中1年級",
//     11: "高中2年級",
//     12: "高中3年級",
//   };
  
// const getFormattedDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth()+ 1).padStart(2, '0');
//     const year = date.getFullYear()%100;
//     const daysOfWeek = ['日','一 ','二','三','四','五','六'];
//     const dayOfWeek = daysOfWeek[date.getDay()];
//     return `${year}-${month}-${day} (${dayOfWeek})`
// }


// const ClassLists = () => {
//     const params = useParams();//plz use console.log see params name
//     const CourseId = params?.coursedetailbyID as string;// 獲取URL中的CourseId參數

//     // 為了拿course data by id
//     const [GetCourseDataById, setGetCourseDataById] = useState([]);

//         // 拿course data by id
//         useEffect(() =>{
//             if(CourseId) {
//                 const getCourseDetail = async (id: string) => {
//                     try {
//                     const res = await fetch(`/api/Course_detail_data_by_id/${id}`);
//                     if(!res.ok) {
//                         throw new Error("斷線！");
//                     }
//                     const result = await res.json();
//                     setGetCourseDataById(result);                    
//                     } catch (error) {
//                         console.error(error);
//                     }
//                 };
//                 getCourseDetail(CourseId);
//             }
//         },[CourseId] )
    
//         console.log('GetCourseDataById : ', GetCourseDataById)

        
//     return(
    

//         <>
//             <span>ClassLists</span>
//             {GetCourseDataById?.class?.map((d)=>{
//                 return(
//                     <>
//                     <Link href={`/admin/courseLists/${CourseId}/classLists/${d.id}`}>
                    
//                     <br />
//                     課室：{d.classroom}
//                     <br />
//                     日期：{getFormattedDate(d.class_date)}
//                     <br />
//                     人數: {d.persons}
//                     <br />
//                     年級: { gradeMapping[d.grade] ||d.grade}
//                     <br />
//                     課節: {d.class_lesson}

//                     </Link>
//                     </>
//                 )
//             })}
//         </>
//     )
// }

// export default ClassLists


"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// 定義 Course 和 Class 的介面
interface Class {
  id: string;
  classroom: string;
  class_date: string;
  persons: number;
  grade: number;
  class_lesson: string;
}

interface Course {
  id: string;
  course_name: string;
  course_subject: string;
  persons: number;
  teacher: string;
  grade: number;
  day_start: string;
  day_end: string;
  start_time: string;
  end_time: string;
  days: { date: string; start_time: string; end_time: string; lesson: string }[];
  weekdays: { date: string; start_time: string; end_time: string; lesson: string }[];
  publicholiday_model: string[];
  TimeTemplateID: string;
  classroom: string;
  isshow: boolean;
  class: Class[];
}

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

// 格式化日期
const getFormattedDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear() % 100;
  const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];
  const dayOfWeek = daysOfWeek[date.getDay()];
  return `${year}-${month}-${day} (${dayOfWeek})`;
};

const ClassLists = () => {
  const params = useParams();
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
          const res = await fetch(`/api/Course_detail_data_by_id/${id}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
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

  console.log("GetCourseDataById:", GetCourseDataById , " -- End -- ");

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
              <h1 className="text-2xl font-bold text-white">課堂列表</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href={`/admin/courseLists/${CourseId}`}
                className="text-white hover:bg-cyan-200 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                返回課程詳情
              </Link>
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
        <h1 className="text-3xl font-bold text-[#80A8BD] mb-6">
          {GetCourseDataById.course_name} - 課堂列表
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          {GetCourseDataById.class && GetCourseDataById.class.length > 0 ? (
            <div className="grid gap-4">
              {GetCourseDataById.class.map((d: Class) => (
                <Link
                  key={d.id}
                  href={`/admin/courseLists/${CourseId}/classLists/${d.id}`}
                  className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">課室</h3>
                    <p className="text-gray-600">{d.classroom}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">日期</h3>
                    <p className="text-gray-600">{getFormattedDate(d.class_date)}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">人數</h3>
                    <p className="text-gray-600">{d.persons}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">年級</h3>
                    <p className="text-gray-600">{gradeMapping[d.grade] || d.grade}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">課節</h3>
                    <p className="text-gray-600">{d.class_lesson}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">無課堂數據</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassLists;