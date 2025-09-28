"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from 'react';

interface StudentData{
    id: string;
    name: string;
    school: string;
    grade: number;
    quarter: number;
    subject: string;
    year: string;
}

const ExTimeLists_Grade_Year_Quarter_subject_Lists = () => {
    const params = useParams<{parentId : string ; studentid : string ; school : string; grade : string ; year: string; quarter:string; subject: string}>();
    const ParentID = params?.parentId as string;
    const StudentID = params?.studentid as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;
    const SubjectId = params?.subject ? decodeURIComponent(params.subject) : '';
    const [ GetStudentExTimeLists , setGetStudentExTimeLists ] = useState<StudentData[]>([]);

    useEffect(()=>{
        if(StudentID){
            const getstudentextimelist = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/student/Student_ExTime_by_id_Lists/${StudentID}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            })
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentExTimeLists(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentextimelist(StudentID)
        }
    },[StudentID])

    console.log(GetStudentExTimeLists[0])

    return(
        <>
            <span> ExTimeLists_Grade_Year_Quarter_subject_Lists </span>
            <br />
            {GetStudentExTimeLists.map((d)=>{
                if(d.school == SchoolName && d.grade == Number(Grade) && d.year == Year && d.quarter == Number(Quarter) && d.subject == SubjectId){
                    return(
                        <div key={d.id}> {/* 添加 key 属性 */}
                            <br />
                            <Link className="text-stone-950 hover:text-gray-700" 
                                href={`/parent/${ParentID}/profiles/${StudentID}/upload/extimeLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${SubjectId}/${d.id}`}
                            >
                                名稱: {d.name}
                            </Link>
                            <br />
                        </div>
                    )

                }
            })}
        </>
    )
}

export default ExTimeLists_Grade_Year_Quarter_subject_Lists