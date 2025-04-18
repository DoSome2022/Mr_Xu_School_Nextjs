"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from "react";


const ExPageLists_Grade_Year_Quarter_Subject_Lists = () => {
    const params = useParams<{parentId : string ; studentid : string ; school : string; grade : number ; year: string; quarter:number; subject:string}>();
    const ParentID = params?.parentId as string;
    const StudentID = params?.studentid as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as number;
    const Year = params?.year as string;
    const Quarter = params?.quarter as number;
    const Subject = params?.subject as string;

    const [ GetStudentExPaperLists , setGetStudentExPaperLists ] = useState<any>([]);

    useEffect(()=>{
        if(StudentID){
            const getstudentexpaperlist = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/student/Student_ExPaper_by_id_Lists/${StudentID}`)
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentExPaperLists(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentexpaperlist(StudentID)
        }
    },[StudentID])


    console.log(GetStudentExPaperLists[0])
    return(
        <>
            <span> ExPageLists_Grade_Year_Quarter_Subject_Lists </span>
            <br />
            {GetStudentExPaperLists.map((d:any)=>{
                return(
                    <>
                           <Link className='text-stone-950 hover:text-gray-700'
                           href={`/parent/${ParentID}/profiles/${StudentID}/upload/expageLists/${StudentID}/expageLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${Subject}/${d.id}`}
                       >
                           名稱:{d.name}
                       </Link>                    
                    </>
                )

            })}
        </>
    )
}

export default ExPageLists_Grade_Year_Quarter_Subject_Lists