"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from "react";

interface Student_name{
    id: string;
    name: string;
    school: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
}
const ExPageLists_Grade_Year_Quarter_Subject_Listsbysupadmin = () => {
    const params = useParams<{ parentdetailbyID : string ; studentdetailbyID : string ; school : string; grade : string ; year: string; quarter:string; subject:string; supadminId:string;  }>();
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;
    const Subject = params?.subject ? decodeURIComponent(params.subject) : '';
    const supadminId = params?.supadminId as string;


    const [ GetStudentExPaperLists , setGetStudentExPaperLists ] = useState<Student_name[]>([]);

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


    console.log(GetStudentExPaperLists)
    console.log(Subject)

    return(
        <>
            <span> ExPageLists_Grade_Year_Quarter_Subject_Lists </span>
            <br />
            {GetStudentExPaperLists.map((d)=>{
                if(d.school == SchoolName && d.grade == Grade && d.year == Year  && d.quarter == Quarter && d.subject == Subject){
              return(
                    <>
                           <Link className='text-stone-950 hover:text-gray-700'
                           href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${Subject}/${d.id}`}
                       >
                           名稱:{d.name}
                       </Link>    
                       <br />                
                    </>
                )
                }


  

            })}
        </>
    )
}

export default ExPageLists_Grade_Year_Quarter_Subject_Listsbysupadmin