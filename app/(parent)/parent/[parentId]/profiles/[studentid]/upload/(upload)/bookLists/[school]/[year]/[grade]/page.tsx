"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const Student_BookLists_School_Year_Grade_Lists = () => {
  const params = useParams<{
    parentId: string;
    studentid: string;
    school: string;
    year: string;
    grade: number;
  }>();
  const ParentID = params?.parentId as string;
  const StudentID = params?.studentid as string;
  const SchoolName = params?.school as string;
  const Year = params?.year as string;
  const Grade = params?.grade as number;

  const [GetStudentBookLists, setGetStudentBookLists] = useState<any[]>([]);

  useEffect(() => {
    if (StudentID) {
      const getstudentexbooklists = async (StudentID: string) => {
        try {
          const res = await fetch(`/api/student/Student_Booklist_by_id_Lists/${StudentID}`);
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

  console.log(GetStudentBookLists[0]);

  return (
    <>
      <span>Student_BookLists_School_Year_Grade_Lists</span>
      <br />
      {GetStudentBookLists.map((d: any) => (
        <Link
          key={d.id}
          className="text-stone-950 hover:text-gray-700"
          href={`/parent/${ParentID}/profiles/${StudentID}/upload/bookLists/${SchoolName}/${Year}/${Grade}/${d.id}`}
        >
          名稱：{d.name}
        </Link>
      ))}
    </>
  );
};

export default Student_BookLists_School_Year_Grade_Lists;