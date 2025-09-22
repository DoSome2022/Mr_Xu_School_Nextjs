"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from "react";
// import useSWR from "swr";


interface SchoolExPageData{
    id: string;
    name: string;
    school: string;
    grade: number;
    year: string;
    quarter: number;
    subject: string;
}
const ExPageLists_Grade_Year_Quarter_Subject_Lists = () => {
    const params = useParams<{parentId : string ; studentid : string ; school : string; grade : string ; year: string; quarter:string; subject:string}>();
    const ParentID = params?.parentId as string;
    const StudentID = params?.studentid as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;
    const SubjectId = params?.subject ? decodeURIComponent(params.subject) : '';

    const [ GetStudentExPaperLists , setGetStudentExPaperLists ] = useState<SchoolExPageData[]>([]);

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

    console.log("GetStudentExPaperLists : ",GetStudentExPaperLists)
    // const fetcher = (url: string, init?: RequestInit):Promise<SchoolExPageData[]>  => fetch(url, init).then((res) => res.json());
    // const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"

    // const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolsubjects/` , fetcher);

    // if(error) return <> error : {error} </>
    // if(isLoading) return <> 載入中 .... </>
    //   // 確保 data 是陣列
    //   if (!data || !Array.isArray(data)) {
    //     return <div className="p-4 text-red-500">無效的資料格式</div>;
    // }
    return(
        <>
            <span> ExPageLists_Grade_Year_Quarter_Subject_Lists </span>
            <br />
            {GetStudentExPaperLists.map((d)=>{
                if( d.school == SchoolName&& d.year == Year&& d.grade == Number(Grade)&& d.quarter == Number(Quarter) && d.quarter == Number(Quarter)&& d.subject == SubjectId 
                  //      && d.school_subject == SubjectId 
                ){
                    
                    return(
                        <>
                               <Link className='text-stone-950 hover:text-gray-700'
                               href={`/parent/${ParentID}/profiles/${StudentID}/upload/expageLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${SubjectId}/${d.id}`}
                           >
                               名稱:{d.name}
                           </Link>                    
                        </>
                    )
                }

            })}
        </>
    )
}

export default ExPageLists_Grade_Year_Quarter_Subject_Lists