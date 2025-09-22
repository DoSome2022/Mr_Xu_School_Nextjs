"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Student_EX_Page_Create_Form from "@/components/CreateForm/Student-EX-Pager-Create-Form";

interface StudentData {
  id: string;
  name: string;
  grade: number;
  school: string;
}

const Student_ExpageLists_upload = () => {
  const params = useParams<{
    parentdetailbyID: string;
    studentdetailbyID: string;
  }>();
  const StudentID = params?.studentdetailbyID as string;

  const [GetStudentData, setGetStudentData] = useState<StudentData[]>([]);
  const [error, setError] = useState<string | undefined>("");

  useEffect(() => {
    if (StudentID) {
      const fetchStudentData = async (studentID: string) => {
        try {
          const res = await fetch(`/api/student/Student_Lists_detail_data_by_id/${studentID}`);
          if (!res.ok) {
            throw new Error(`獲取學生資料失敗: ${res.statusText}`);
          }
          const result = await res.json();
          setGetStudentData(result);
        } catch (error: any) {
          console.error("錯誤:", error);
          setError(error.message);
        }
      };
      fetchStudentData(StudentID);
    }
  }, [StudentID]);

  if (!StudentID) {
    return (
      <div className="p-5 max-w-4xl mx-auto">
        <p className="text-red-500">無效的學生 ID</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 max-w-4xl mx-auto">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!GetStudentData || GetStudentData.length === 0) {
    return (
      <div className="p-5 max-w-4xl mx-auto">
        <p className="text-gray-500">載入中...</p>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#80A8BD] mb-6">上傳考試卷</h2>
      <Student_EX_Page_Create_Form studentId={StudentID} data={GetStudentData} />
    </div>
  );
};

export default Student_ExpageLists_upload;