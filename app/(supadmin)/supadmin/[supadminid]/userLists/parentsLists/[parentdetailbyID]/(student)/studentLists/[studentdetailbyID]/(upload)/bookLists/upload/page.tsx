"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Student_BookList_Create_Formbysupadmin from "@/components/CreateForm/SUPADMIN/UploadForm/student/Sup-Student-BookList-Create-Form";

interface StudentData {
  id: string;
  name: string;
  grade: number;
  school: string;
}

const Student_BookLists_uploadbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;

  const [GetStudentData, setGetStudentData] = useState<StudentData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  useEffect(() => {
    const fetchStudentData = async (studentId: string) => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/student/Student_Lists_detail_data_by_id/${studentId}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) {
          throw new Error(`請求失敗：${res.statusText}`);
        }
        const result = await res.json();
        if (!Array.isArray(result)) {
          throw new Error("無效的學生資料格式");
        }
        setGetStudentData(result);
      } catch (err: any) {
        setError(err.message || "無法獲取學生資料");
      } finally {
        setIsLoading(false);
      }
    };

    if (StudentID) {
      fetchStudentData(StudentID);
    }
  }, [StudentID]);

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("Params:", params);
    console.log("Student Data:", GetStudentData);
  }

  if (isLoading) {
    return <div className="text-gray-600 p-4">載入中...</div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/supadmin/${supadminId}`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/supadmin/${supadminId}/userLists`} className="text-blue-600 hover:text-blue-800">
          用戶列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          書單
        </Link>
        <span className="mx-2">/</span>
        <span>上傳書單</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">上傳學生書單</h2>

      <Student_BookList_Create_Formbysupadmin studentId={StudentID} data={GetStudentData} />
    </div>
  );
};

export default Student_BookLists_uploadbysupadmin;