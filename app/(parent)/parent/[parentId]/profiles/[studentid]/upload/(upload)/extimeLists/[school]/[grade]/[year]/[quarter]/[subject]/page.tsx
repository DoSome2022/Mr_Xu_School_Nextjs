"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from 'react';

const ExTimeLists_Grade_Year_Quarter_subject_Lists = () => {
    const params = useParams<{parentId : string ; studentid : string ; school : string; grade : number ; year: string; quarter:number; subject: string}>();
    const ParentID = params?.parentId as string;
    const StudentID = params?.studentid as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as number;
    const Year = params?.year as string;
    const Quarter = params?.quarter as number;
    const Subject = params?.subject as string;

    const [ GetStudentExTimeLists , setGetStudentExTimeLists ] = useState<any>([]);

    useEffect(()=>{
        if(StudentID){
            const getstudentextimelist = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/student/Student_ExTime_by_id_Lists/${StudentID}`)
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
            {GetStudentExTimeLists.map((d:any)=>{
                return(
                    <div key={d.id}> {/* 添加 key 属性 */}
                        <br />
                        <Link className="text-stone-950 hover:text-gray-700" 
                            href={`/parent/${ParentID}/profiles/${StudentID}/upload/extimeLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${Subject}/${d.id}`}
                        >
                            名稱: {d.name}
                        </Link>
                        <br />
                    </div>
                )
            })}
        </>
    )
}

export default ExTimeLists_Grade_Year_Quarter_subject_Lists