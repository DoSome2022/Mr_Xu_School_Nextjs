"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from "react";

interface StudentName {
    id: string
    name: string
    school: string
    grade: string
    quarter: string
    subject: string
}


const ExScope_Grade_Quarter_Subject_Listsbysupadmin = () => {

    const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; school : string; grade : string ; quarter : string ; subject : string;supadminId:string;}>();
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Quarter = params?.quarter as string;
    const Subject = params?.subject ? decodeURIComponent(params.subject) : '';
    const supadminId = params?.supadminId as string;



    const [ GetStudentExScopeLists , setGetStudentExScopeLists ] = useState<StudentName[]>([]);

    useEffect(()=>{
        if(StudentID){
            const getstudentexscopelist = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/student/Student_ExScope_by_id_Lists/${StudentID}`)
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentExScopeLists(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentexscopelist(StudentID)
        }
    },[StudentID])


    console.log(GetStudentExScopeLists)

    return(
        <>
            <span> ExScope_Grade_Quarter_Subject_Lists </span>
            <br />
        {GetStudentExScopeLists.map((d)=>{
            if(d.school == SchoolName && d.grade == Grade && d.quarter == Quarter && d.subject == Subject ){
            return(
                <>
        <Link className='text-stone-950 hover:text-gray-700'
                href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}/${Quarter}/${Subject}/${d.id}`}
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

export default ExScope_Grade_Quarter_Subject_Listsbysupadmin