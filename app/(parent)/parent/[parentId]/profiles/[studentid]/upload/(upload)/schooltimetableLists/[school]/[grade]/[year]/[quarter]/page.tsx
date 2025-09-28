"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from 'react';

interface StudentData {
    id: string;
    name: string;
    quarter: number;
    year: string;
    grade: number;
    school: string;
}
const SchoolTimeTableLists_Grade_Year_Quarter_Lists = () => {
    const params = useParams<{parentId: string; studentid: string; school: string; grade: string; year: string; quarter: string}>();
    const ParentID = params?.parentId as string;
    const StudentID = params?.studentid as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;

    const [GetStudentSchoolTimeTableLists, setGetStudentSchoolTimeTableLists] = useState<StudentData[]>([]);

    useEffect(() => {
        if (StudentID) {
            const getstudentschooltimetablelists = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/student/Student_ScTimetable_by_id_Lists/${StudentID}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
                    if (!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentSchoolTimeTableLists(result);
                } catch (error) {
                    console.error(error);
                }
            };
            getstudentschooltimetablelists(StudentID);
        }
    }, [StudentID]);

    console.log(GetStudentSchoolTimeTableLists[0]);

    return (
        <>
            <span> SchoolTimeTableLists_Grade_Year_Quarter_Lists </span>
            <br />
            {GetStudentSchoolTimeTableLists.map((d) => {
                if(d.school == SchoolName && d.grade == Number(Grade) && d.year == Year && d.quarter == Number(Quarter)){
                <div key={d.id}> {/* 添加 key 属性 */}
                    <br />
                    <Link
                        className="text-stone-950 hover:text-gray-700"
                        href={`/parent/${ParentID}/profiles/${StudentID}/upload/schooltimetableLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${d.id}`}
                    >
                        名稱: {d.name}
                    </Link>
                    <br />
                </div>

                }
})}
        </>
    );
};

export default SchoolTimeTableLists_Grade_Year_Quarter_Lists;