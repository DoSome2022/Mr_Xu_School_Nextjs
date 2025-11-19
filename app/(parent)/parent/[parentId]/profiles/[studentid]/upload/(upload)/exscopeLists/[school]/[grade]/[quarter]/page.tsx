"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";

interface StudentSubject {
  school_subject: string;
}
const ExScope_Grade_Quarter_Subject = () => {
  const params = useParams<{
    parentId: string;
    studentid: string;
    school: string;
    grade: string;
    quarter: string;
  }>();
  const ParentID = params?.parentId as string;
  const StudentID = params?.studentid as string;
  const SchoolName = params?.school as string;
  const Grade = params?.grade as string;
  const Quarter = params?.quarter as string;

  const fetcher = (url: string, init?: RequestInit):Promise<StudentSubject[]>  => fetch(url, init).then((res) => res.json());
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO|| "http://127.0.0.1:8000"
  const { data, error, isLoading } = useSWR(
    `${apiUrl}/api/School_data/schoolsubjects/`,
    fetcher
  );

  if (error) return <>error: {error}</>;
  if (isLoading) return <>載入中 ....</>;
        // 確保 data 是陣列
        if (!data || !Array.isArray(data)) {
          return <div className="p-4 text-red-500">無效的資料格式</div>;
      }


  return (
    <>
      <span>ExScope_Grade_Quarter_Subject</span>
      <br />
      {data.map((subject: any) => (
        <Link
          key={subject.school_subject}
          className="text-stone-950 hover:text-gray-700 block mb-2"
          href={`/parent/${ParentID}/profiles/${StudentID}/upload/exscopeLists/${SchoolName}/${Grade}/${Quarter}/${subject.school_subject}`}
        >
          科目: {subject.school_subject}
        </Link>
      ))}
    </>
  );
};

export default ExScope_Grade_Quarter_Subject;