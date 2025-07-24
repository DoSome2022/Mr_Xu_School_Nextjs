"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from "next/link";

interface StudentSchool {
    id: string;
    school : string;
}

const SchoolTimeTableLists = () => {
    const params = useParams<{parentId : string ; studentid : string}>();
    const ParentId = params?.parentId as string;
    const StudentID = params?.studentid as string;

    // 拿學生資料
    const [GetSutudentData, setGetSutudentData] = useState<StudentSchool[]>([]);

    // 用ParentId去拿student DB裹的DATA
    useEffect(()=>{
        if(StudentID){
            const fetchStudentData = async (studentdataid : string) => {
                // 在app/api/student/Student_Lists/[id]/route.ts
                const res = await fetch(`/api/Parents_Student/Parents_Student_Lists/${studentdataid}`);
                if(!res){
                    throw new Error("斷線！")
                }
                const result = await res.json();
                setGetSutudentData(result);
            }
            fetchStudentData(StudentID)
        }
    },[StudentID])

    console.log("-- Student Data : --",GetSutudentData,"-- END --")

    return(
        <>
            <span> SchoolTimeTableLists </span>
            <br />
            <Link
                className="text-stone-950 hover:text-gray-700"
                href={`/parent/${ParentId}/profiles/${StudentID}/upload/schooltimetableLists/upload`}
            >
                上傳學校時間表
            </Link>
            <br />
            {GetSutudentData.map((d)=>{
                return(
                    <div key={d.id}> {/* 添加 key 属性 */}
                        <Link
                            className="text-stone-950 hover:text-gray-700"
                            href={`/parent/${ParentId}/profiles/${StudentID}/upload/schooltimetableLists/${d.school}`}
                        >
                            school: {d.school}
                        </Link>
                    </div>
                )
            })}
            <br />
        </>
    )
}

export default SchoolTimeTableLists