"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface StudentData {
  id: string;
  name:string;
  school: string;
  grade:number;
  quarter:number;
  subject:string;
}

const ExScope_Grade_Quarter_Subject_Lists = () => {
  const params = useParams<{
    parentId: string;
    studentid: string;
    school: string;
    grade: string;
    quarter: string;
    subject: string;
  }>();
  const ParentID = params?.parentId as string;
  const StudentID = params?.studentid as string;
  const SchoolName = params?.school as string;
  const Grade = params?.grade as string;
  const Quarter = params?.quarter as string;
  const SubjectId = params?.subject ? decodeURIComponent(params.subject) : '';


  const [GetStudentExScopeLists, setGetStudentExScopeLists] = useState<StudentData[]>([]);

  useEffect(() => {
    if (StudentID) {
      const getstudentexscopelist = async (StudentID: string) => {
        try {
          const res = await fetch(`/api/student/Student_ExScope_by_id_Lists/${StudentID}`);
          if (!res.ok) {
            throw new Error("斷線！");
          }
          const result = await res.json();
          setGetStudentExScopeLists(result);
        } catch (error) {
          console.error(error);
        }
      };
      getstudentexscopelist(StudentID);
    }
  }, [StudentID]);

  console.log(GetStudentExScopeLists[0]);

  return (
    <>
      <span>ExScope_Grade_Quarter_Subject_Lists</span>
      <br />
      {GetStudentExScopeLists.map((d) => {
        if(d.school == SchoolName && d.grade == Number(Grade) && d.quarter == Number(Quarter) && d.subject == SubjectId ){
        <Link
          key={d.id}
          className="text-stone-950 hover:text-gray-700 block mb-2"
          href={`/parent/${ParentID}/profiles/${StudentID}/upload/exscopeLists/${SchoolName}/${Grade}/${Quarter}/${SubjectId}/${d.id}`}
        >
          名稱: {d.name}
        </Link>          
        }

      })}
    </>
  );
};

export default ExScope_Grade_Quarter_Subject_Lists;