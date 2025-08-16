"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface StudentDetailData {
  name: string;
  img: string;
  school: string;
  grade: string;
  year: string;
  id: string;
}

const Student_BookLists_School_Year_Grade_Id_Detail = () => {
  const params = useParams<{
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    year: string;
    grade: string;
    id: string;
  }>();
  const ParentID = params?.parentdetailbyID as string;
  const StudentID = params?.studentdetailbyID as string;
  const SchoolName = params?.school as string;
  const Year = params?.year as string;
  const Grade = params?.grade as string;
  const id = params?.id as string;

  const [GetStudentBookListsDetailByID, setGetStudentBookListsDetailByID] = useState<
    StudentDetailData[]
  >([]);

  useEffect(() => {
    if (StudentID && id) {
      const getstudentbooklistsdetailbyid = async (studentID: string, bookId: string) => {
        try {
          const res = await fetch(
            `/api/student/Student_Booklist_by_id_Lists_by_id/${studentID}/${bookId}`
          );
          if (!res.ok) {
            throw new Error(`獲取書單詳情失敗: ${res.statusText}`);
          }
          const result = await res.json();
          setGetStudentBookListsDetailByID(result);
        } catch (error) {
          console.error("錯誤:", error);
          alert("無法獲取書單詳情，請稍後重試");
        }
      };
      getstudentbooklistsdetailbyid(StudentID, id);
    }
  }, [StudentID, id]);

  // 過濾符合條件的書單數據
  const filteredBookDetails = GetStudentBookListsDetailByID.filter(
    (d) => d.school === SchoolName && d.year === Year && d.grade === Grade && d.id === id
  );

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#e7915b] mb-6">書單詳情</h2>
      {filteredBookDetails.length > 0 ? (
        <div className="space-y-4">
          {filteredBookDetails.map((d) => (
            <div
              key={d.id}
              className="border border-gray-200 rounded p-4 bg-white shadow-sm"
            >
              <p className="text-lg font-medium text-[#e7915b]">{d.name}</p>
              <div className="mt-4">
                <Image
                  width={500}
                  height={500}
                  src={d.img}
                  alt={d.name || "書單圖片"}
                  className="rounded-md object-cover max-w-full h-auto"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">無符合條件的書單詳情</p>
      )}
    </div>
  );
};

export default Student_BookLists_School_Year_Grade_Id_Detail;