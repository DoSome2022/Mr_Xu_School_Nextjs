"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from 'react';
import Image from 'next/image';

const SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_ID = () => {
    const params = useParams<{ studentdetailbyID : string ;}>();

    const StudentID = params?.studentdetailbyID as string;

    const [ GetStudentSchoolTimeTableDetailByID , setGetStudentSchoolTimeTableDetailByID ] = useState<any>([]);

    useEffect(()=>{
        if(StudentID){
            const getstudentschooltimetabledetailbyid = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/student/Student_ScTimetable_by_id_Lists/${StudentID}`)
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentSchoolTimeTableDetailByID(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentschooltimetabledetailbyid(StudentID)
        }
    },[StudentID])


    console.log(GetStudentSchoolTimeTableDetailByID[0])


    return(
        <>
            <span> SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_ID </span>
            <br />
{GetStudentSchoolTimeTableDetailByID.map((d)=>{
    return(
        <>
        {d.name}
        <br />
        <Image 
                    width={500}
                    height={500}
                    src={d.img}
                    alt=""
                    />
        </>
    )
})}
        </>
    )
}

export default SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_ID