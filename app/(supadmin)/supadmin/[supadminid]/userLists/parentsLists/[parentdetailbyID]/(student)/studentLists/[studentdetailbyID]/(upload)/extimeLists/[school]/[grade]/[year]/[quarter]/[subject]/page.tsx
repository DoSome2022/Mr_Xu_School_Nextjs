"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from 'react';

interface StudentSchoolName {
    name:string;
    id:string;
    school:string;
    grade:string;
    year:string;
    quarter:string;
    subject:string;
}
const ExTimeLists_Grade_Year_Quarter_subject_Listsbysupadmin = () => {
    const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; school : string; grade : string ; year: string; quarter:string; subject: string; supadminId:string;}>();
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;
    const Subject = params?.subject ? decodeURIComponent(params.subject) : '';
    const supadminId = params?.supadminId as string;


    const [ GetStudentExTimeLists , setGetStudentExTimeLists ] = useState<StudentSchoolName[]>([]);

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
            {GetStudentExTimeLists.map((d)=>{
                if(d.school == SchoolName && d.grade == Grade && d.year == Year && d.quarter == Quarter && d.subject == Subject){
                return(
                    <>
            <br />
                <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${Subject}/${d.id}`}
                >
                    名稱: {d.name}
                </Link>
            <br />
                    </>
                )

                }

            })}
        </>
    )
}

export default ExTimeLists_Grade_Year_Quarter_subject_Listsbysupadmin