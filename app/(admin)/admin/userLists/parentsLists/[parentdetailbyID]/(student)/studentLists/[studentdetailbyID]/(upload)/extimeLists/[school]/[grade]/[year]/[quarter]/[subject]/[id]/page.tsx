"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from 'react';
import Image from 'next/image';


const ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID = () => {
    const params = useParams<{ studentdetailbyID : string ;}>();

    const StudentID = params?.studentdetailbyID as string;
    const [ GetStudentExTimeDetailByID , setGetStudentExTimeDetailByID ] = useState<any>([]);

    useEffect(()=>{
        if(StudentID){
            const getstudentextimedetailbyid = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/student/Student_ExTime_by_id_Lists/${StudentID}`)
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentExTimeDetailByID(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentextimedetailbyid(StudentID)
        }
    },[StudentID])


    console.log(GetStudentExTimeDetailByID[0])

    return(
        <>
            <span> ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID </span>
            <br />
{GetStudentExTimeDetailByID.map((d)=>{
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

export default ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID