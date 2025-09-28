"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface CourseData {
  id: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  Student: StudentData[];
  created_at: string;
  updated_at: string;
}

interface StudentData {
  id: string;
  name: string;
  course: CourseDetailData[];
  createdAt: string;
  updatedAt: string;
  grade: number;
}

interface CourseDetailData {
  id: number;
  course_name: string;
  course_subject: string;
  day_start: string;
  day_end: string;
  start_time: string;
  end_time: string;
  grade: number;
  created_at: string;
  updated_at: string;
}

const StudentListsCourse = () => {
  const params = useParams();
  const parentId = params?.parentId as string;
  const [getStudentListsCourse, setGetStudentListsCourse] = useState<CourseData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentListsCourse = async () => {
      if (!parentId) {
        setError("無效的家長 ID");
        toast.error("無效的家長 ID");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await fetch(`/api/Parents_Lists_by_id/${parentId}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!response.ok) {
          throw new Error("無法獲取學生課程數據");
        }
        const data = await response.json();
        setGetStudentListsCourse(Array.isArray(data) ? data : [data]); // 確保數據為陣列
        setError(null);
      } catch (error) {
        console.error("獲取學生課程數據失敗:", error);
        setError("無法獲取學生課程數據，請稍後重試");
        toast.error("無法獲取學生課程數據，請稍後重試");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudentListsCourse();
  }, [parentId]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">學生課程列表</h2>

      {isLoading && (
        <div className="text-center text-gray-500">正在載入數據...</div>
      )}

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          {error}
        </div>
      )}

      {!isLoading && !error && !getStudentListsCourse?.length && (
        <div className="text-center text-gray-500">無數據可顯示</div>
      )}

      {!isLoading && !error && getStudentListsCourse && (
        <div className="space-y-8">
          {getStudentListsCourse.map((parent) => (
            <div key={parent.id}>
              {parent.Student && parent.Student.length > 0 ? (
                parent.Student.map((student) => (
                  <div key={student.id} className="border rounded-lg p-4 mb-4">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                      學生: {student.name} (年級: {student.grade})
                    </h3>
                    {student.course && student.course.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-gray-700">課程名稱</TableHead>
                            <TableHead className="text-gray-700">科目</TableHead>
                            <TableHead className="text-gray-700">開始日期</TableHead>
                            <TableHead className="text-gray-700">結束日期</TableHead>
                            <TableHead className="text-gray-700">開始時間</TableHead>
                            <TableHead className="text-gray-700">結束時間</TableHead>
                            <TableHead className="text-gray-700">年級</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {student.course.map((course) => (
                            <TableRow key={course.id}>
                              <TableCell>{course.course_name}</TableCell>
                              <TableCell>{course.course_subject}</TableCell>
                              <TableCell>{course.day_start}</TableCell>
                              <TableCell>{course.day_end}</TableCell>
                              <TableCell>{course.start_time}</TableCell>
                              <TableCell>{course.end_time}</TableCell>
                              <TableCell>{course.grade}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-gray-500">此學生尚無課程</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">此家長尚無學生</div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button
          onClick={() => window.history.back()}
          className="bg-[#80A8BD] hover:bg-[#d17a4a] text-white rounded-md px-4 py-2"
        >
          返回
        </Button>
      </div>
    </div>
  );
};

export default StudentListsCourse;