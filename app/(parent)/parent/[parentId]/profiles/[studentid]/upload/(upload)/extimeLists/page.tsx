"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface StudentSchool {
  school: string;
}
const ExTimeLists = () => {
  const params = useParams<{ parentId: string; studentid: string }>();
  const ParentId = params?.parentId as string;
  const StudentID = params?.studentid as string;

  const [GetSutudentData, setGetSutudentData] = useState<StudentSchool[]>([]);

  useEffect(() => {
    if (StudentID) {
      const fetchStudentData = async (studentdataid: string) => {
        const res = await fetch(`/api/Parents_Student/Parents_Student_Lists/${studentdataid}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) {
          throw new Error("斷線！");
        }
        const result = await res.json();
        setGetSutudentData(result);
      };
      fetchStudentData(StudentID);
    }
  }, [StudentID]);

  console.log("-- Student Data : --", GetSutudentData, "-- END --");

  return (
    <>
      <span>ExTimeLists</span>
      <br />
      <Link
        className="text-stone-950 hover:text-gray-700"
        href={`/parent/${ParentId}/profiles/${StudentID}/upload/extimeLists/upload`}
      >
        上傳考試時間表
      </Link>
      <br />
      {GetSutudentData.map((d) => (
        <Link
          key={d.school}
          className="text-stone-950 hover:text-gray-700 block mb-2"
          href={`/parent/${ParentId}/profiles/${StudentID}/upload/extimeLists/${d.school}`}
        >
          school: {d.school}
        </Link>
      ))}
      <br />
    </>
  );
};

export default ExTimeLists;