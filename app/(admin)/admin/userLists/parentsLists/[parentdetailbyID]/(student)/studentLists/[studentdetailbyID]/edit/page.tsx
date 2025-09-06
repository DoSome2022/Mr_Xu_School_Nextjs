"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Student_Update_Form from "@/components/UpdateForm/Student-Update-Form";

const StudentDetailEditPage = () => {
  const params = useParams<{

    parentdetailbyID: string;
    studentdetailbyID: string;
  }>();

  const parentId = params?.parentdetailbyID;
  const studentId = params?.studentdetailbyID;

  // 驗證路由參數
  if (!parentId || !studentId) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">


      <h2 className="text-2xl font-semibold text-blue-600 mb-4">編輯學生資料</h2>

      <Student_Update_Form />
    </div>
  );
};

export default StudentDetailEditPage;