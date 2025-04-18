"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";

const ExTimeLists_Grade_Year = () => {
  const params = useParams<{
    parentId: string;
    studentid: string;
    school: string;
    grade: number;
  }>();
  const ParentID = params?.parentId as string;
  const StudentID = params?.studentid as string;
  const SchoolName = params?.school as string;
  const Grade = params?.grade as number;

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    "http://127.0.0.1:8000/api/School_data/schoolyears/",
    fetcher
  );

  if (error) return <>error: {error}</>;
  if (isLoading) return <>載入中 ....</>;

  return (
    <>
      <span>ExTimeLists_Grade_Year</span>
      <br />
      {data.map((year: any) => (
        <Link
          key={year.school_year}
          className="text-stone-950 hover:text-gray-700 block mb-2"
          href={`/parent/${ParentID}/profiles/${StudentID}/upload/extimeLists/${SchoolName}/${Grade}/${year.school_year}`}
        >
          年份: {year.school_year}
        </Link>
      ))}
    </>
  );
};

export default ExTimeLists_Grade_Year;