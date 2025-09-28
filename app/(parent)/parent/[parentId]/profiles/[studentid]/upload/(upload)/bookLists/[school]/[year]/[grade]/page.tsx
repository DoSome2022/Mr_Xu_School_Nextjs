"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BookListsData {
  id: string;
  name: string;
  year: string;
  grade: number;
  school: string;
}
const Student_BookLists_School_Year_Grade_Lists = () => {
  const params = useParams<{
    parentId: string;
    studentid: string;
    school: string;
    year: string;
    grade: string;
  }>();
  const ParentID = params?.parentId as string;
  const StudentID = params?.studentid as string;
  const SchoolName = params?.school as string;
  const Year = params?.year as string;
  const Grade = params?.grade as string;

  console.log("params : ",params)
  const [GetStudentBookLists, setGetStudentBookLists] = useState<BookListsData[]>([]);

  useEffect(() => {
    if (StudentID) {
      const getstudentexbooklists = async (StudentID: string) => {
        try {
          const res = await fetch(`/api/student/Student_Booklist_by_id_Lists/${StudentID}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
          if (!res.ok) {
            throw new Error("斷線！");
          }
          const result = await res.json();
          setGetStudentBookLists(result);
        } catch (error) {
          console.error(error);
        }
      };
      getstudentexbooklists(StudentID);
    }
  }, [StudentID]);

  console.log(GetStudentBookLists);

  return (
    <>
      <span>Student_BookLists_School_Year_Grade_Lists</span>
      <br />
      {GetStudentBookLists.map((d) => {

        if(d.school == SchoolName && d.year == Year && d.grade == Number(Grade)
          //


        ){
          return (
            <> 
                <Link
          key={d.id}
          className="text-stone-950 hover:text-gray-700"
          href={`/parent/${ParentID}/profiles/${StudentID}/upload/bookLists/${SchoolName}/${Year}/${Grade}/${d.id}`}
        >
          名稱：{d.name}
        </Link>
            </>
          );
        }
      }

      )}
    </>
  );
};

export default Student_BookLists_School_Year_Grade_Lists;