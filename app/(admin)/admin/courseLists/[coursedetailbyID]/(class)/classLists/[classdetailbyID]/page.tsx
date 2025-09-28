// pages/admin/courseLists/[coursedetailbyID]/classLists/[classdetailbyID]/index.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// 定義 Classroom、Student 和 Class 的介面
interface Classroom {
  id: string;
  room: string;
}

interface Student {
  id: string;
  name: string;
}

interface Class {
  id: string;
  classroom: Classroom[];
  class_lesson: string;
  persons: number;
  teacher: string;
  student: Student[];
  node: number;
  class_date: string;
  grade: number;
  class_subject: string;
  class_start_time: string;
  class_end_time: string;
  class_time_h: number;
  class_course_id: string;
  craetedAt: string; // 與 API 保持一致
  updatedAt: string;
  title: string;
  freq: string;
  cram: string;
  isshow: boolean;
  isSubmittedform: boolean;
  attend_name: string[];
  attend_number: number;
  allDay: boolean;
  addClass: any[]; // 可根據實際數據結構進一步定義
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
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "無效日期";
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear() % 100;
    const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];
    const dayOfWeek = daysOfWeek[date.getDay()];
    return `${year}-${month}-${day} (${dayOfWeek})`;
  } catch {
    return "無效日期";
  }
};

const ClassDetail = () => {
  const params = useParams();
  const CourseId = params?.coursedetailbyID as string;
  const ClassId = params?.classdetailbyID as string;

  const [GetClassDataById, setGetClassDataById] = useState<Class[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ClassId) {
      const getClassDetail = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/Class_detail_data_by_id/${id}`, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          if (!res.ok) {
            throw new Error("無法獲取課堂數據");
          }
          const result = await res.json();
          setGetClassDataById(result);
        } catch (error: any) {
          console.error("獲取課堂數據失敗:", error);
          setError("無法載入課堂數據");
        } finally {
          setLoading(false);
        }
      };
      getClassDetail(ClassId);
    } else {
      setError("無效的課堂ID");
      setLoading(false);
    }
  }, [ClassId]);

  console.log("GetClassDataById:", GetClassDataById, "-- End --");

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

  if (!GetClassDataById || GetClassDataById.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600">無課堂數據</p>
      </div>
    );
  }

  const classData = GetClassDataById[0]; // 提取第一個物件

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <nav className="bg-[#80A8BD] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">課堂詳情</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href={`/admin/courseLists/${CourseId}/classLists`}
                className="text-white hover:bg-cyan-200 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                返回課堂列表
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">
            課堂: {classData.class_lesson}
          </h1>
          <Link
            href={`/admin/courseLists/${CourseId}/classLists/${ClassId}/edit`}
            className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover钽
            hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            更改課堂
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="grid gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">課室</h3>
              <p className="text-gray-600">
                {classData.classroom && classData.classroom.length > 0
                  ? classData.classroom[0].room
                  : "未指定課室"}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">課節</h3>
              <p className="text-gray-600">{classData.class_lesson}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">科目</h3>
              <p className="text-gray-600">{classData.class_subject}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">開始時間</h3>
              <p className="text-gray-600">{classData.class_start_time}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">結束時間</h3>
              <p className="text-gray-600">{classData.class_end_time}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">課程時長</h3>
              <p className="text-gray-600">{classData.class_time_h} 小時</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">人數</h3>
              <p className="text-gray-600">{classData.persons}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">老師</h3>
              <p className="text-gray-600">{classData.teacher}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">學生</h3>
              {classData.student && classData.student.length > 0 ? (
                <ul className="text-gray-600">
                  {classData.student.map((student: Student) => (
                    <li key={student.id}>{student.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">無學生</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">筆記數目</h3>
              <p className="text-gray-600">{classData.node}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">日期</h3>
              <p className="text-gray-600">{getFormattedDate(classData.class_date)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">年級</h3>
              <p className="text-gray-600">{gradeMapping[classData.grade] || classData.grade}</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href={`/admin/courseLists/${CourseId}/classLists/${ClassId}/leavestudent`}
                className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
              >
                請假學生
              </Link>
              <Link
                href={`/admin/courseLists/${CourseId}/classLists/${ClassId}/addclassstudent`}
                className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
              >
                加入加堂學生
              </Link>
              <Link
                href={`/admin/courseLists/${CourseId}/classLists/${ClassId}/changeclassstudent`}
                className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
              >
                加入調堂學生
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;