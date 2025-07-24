"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from 'react';

interface StudentData {
    id: string;
    name: string;
    grade: number;
    quarter: number;
    year: string;
    subject: string;
}

const ScoreLists_Year_Quarter_Subject_List = () => {
    const params = useParams<{parentId : string ; studentid : string ;  grade : string ; year: string; quarter:string; subject: string;}>();
    const ParentID = params?.parentId as string;
    const StudentID = params?.studentid as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;
    const SubjectId = params?.subject ? decodeURIComponent(params.subject) : '';

    const [ GetStudentScoreLists , setGetStudentScoreLists ] = useState<StudentData[]>([]);

    useEffect(()=>{
        if(StudentID){
            const getstudentscorelists = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/student/Student_Score_by_id_Lists/${StudentID}`)
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentScoreLists(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentscorelists(StudentID)
        }
    },[StudentID])


    console.log(GetStudentScoreLists[0])


    return(
        <>
            <span> ScoreLists_Year_Quarter_Subject_List </span>
            <br />
            {GetStudentScoreLists.map((d )=>{
                if(d.grade == Number(Grade) && d.year == Year && d.quarter == Number(Quarter) && d.subject == SubjectId){

                    return(
                        <div key={d.id}>
                <br />
                    <Link className="text-stone-950 hover:text-gray-700" 
                        href={`/parent/${ParentID}/profiles/${StudentID}/upload/scoreLists/${Grade}/${Year}/${Quarter}/${SubjectId}/${d.id}`}
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

export default ScoreLists_Year_Quarter_Subject_List