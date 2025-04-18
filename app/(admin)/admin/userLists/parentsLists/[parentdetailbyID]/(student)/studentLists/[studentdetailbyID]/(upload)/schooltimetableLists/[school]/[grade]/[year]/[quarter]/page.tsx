"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from 'react';

const SchoolTimeTableLists_Grade_Year_Quarter_Lists = () => {

    const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; school : string; grade : number ; year: string; quarter: number;}>();
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as number;
    const Year = params?.year as string;
    const Quarter = params?.quarter as number;

    const [ GetStudentSchoolTimeTableLists , setGetStudentSchoolTimeTableLists ] = useState<any>([]);

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


    console.log(GetStudentSchoolTimeTableLists[0])

    return(
        <>
            <span> SchoolTimeTableLists_Grade_Year_Quarter_Lists </span>
            <br />
            {GetStudentSchoolTimeTableLists.map((d)=>{
                return(
                    <>
            <br />
                <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${d.id}`}
                >
                    名稱: {d.name}
                </Link>
            <br />
                    </>
                )
            })}
        </>
    )
}

export default SchoolTimeTableLists_Grade_Year_Quarter_Lists