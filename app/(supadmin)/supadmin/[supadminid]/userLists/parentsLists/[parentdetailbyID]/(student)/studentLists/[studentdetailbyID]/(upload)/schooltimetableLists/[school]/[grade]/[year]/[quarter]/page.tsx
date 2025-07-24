"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from 'react';

interface StudentSchoolName {
    id:string
    name:string
    school:string
    grade:string
    year:string
    quarter:string
}
const SchoolTimeTableLists_Grade_Year_Quarter_Listsbysupadmin = () => {

    const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; school : string; grade : string ; year: string; quarter: string;supadminId:string;}>();
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;
    const supadminId = params?.supadminId as string;


    const [ GetStudentSchoolTimeTableLists , setGetStudentSchoolTimeTableLists ] = useState<StudentSchoolName[]>([]);

    useEffect(()=>{
        if(StudentID){
            const getstudentschooltimetablelists = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/student/Student_ScTimetable_by_id_Lists/${StudentID}`)
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentSchoolTimeTableLists(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentschooltimetablelists(StudentID)
        }
    },[StudentID])


    console.log(GetStudentSchoolTimeTableLists)

    return(
        <>
            <span> SchoolTimeTableLists_Grade_Year_Quarter_Lists </span>
            <br />
            {GetStudentSchoolTimeTableLists.map((d)=>{
                if(d.school == SchoolName && d.grade == Grade && d.year == Year && d.quarter == Quarter ){
                return(
                    <>
            <br />
                <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${d.id}`}
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

export default SchoolTimeTableLists_Grade_Year_Quarter_Listsbysupadmin