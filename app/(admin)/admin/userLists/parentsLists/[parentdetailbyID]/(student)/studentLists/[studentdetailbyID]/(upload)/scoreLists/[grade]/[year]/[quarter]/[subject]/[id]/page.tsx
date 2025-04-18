"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from 'react';
import Image from 'next/image';


const ScoreLists_Year_Quarter_Subject_List_By_ID = () => {
    const params = useParams<{ studentdetailbyID : string ;}>();

    const StudentID = params?.studentdetailbyID as string;

    const [ GetStudentScoreDetailByID , setGetStudentScoreDetailByID] = useState<any>([]);

    useEffect(()=>{
        if(StudentID){
            const getstudentscoredetailbyid = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/student/Student_Score_by_id_Lists/${StudentID}`)
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentScoreDetailByID(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentscoredetailbyid(StudentID)
        }
    },[StudentID])


    console.log(GetStudentScoreDetailByID[0])

    return(
        <>
            <span> ScoreLists_Year_Quarter_Subject_List_By_ID </span>
            <br />
{GetStudentScoreDetailByID.map((d)=>{
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

export default ScoreLists_Year_Quarter_Subject_List_By_ID