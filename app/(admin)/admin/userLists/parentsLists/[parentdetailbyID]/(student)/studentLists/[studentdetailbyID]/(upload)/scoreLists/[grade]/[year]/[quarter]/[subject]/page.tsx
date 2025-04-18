"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from 'react';

const ScoreLists_Year_Quarter_Subject_List = () => {
    const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ;  grade : number ; year: string; quarter:number; subject: string;}>();
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const Grade = params?.grade as number;
    const Year = params?.year as string;
    const Quarter = params?.quarter as number;
    const Subject = params?.subject as string;

    const [ GetStudentScoreLists , setGetStudentScoreLists ] = useState<any>([]);

    useEffect(()=>{
        if(StudentID){
            const getstudentscorelists = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/student/Student_Score_by_id_Lists/${StudentID}`)
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentScoreLists(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentscorelists(StudentID)
        }
    },[StudentID])


    console.log(GetStudentScoreLists[0])


    return(
        <>
            <span> ScoreLists_Year_Quarter_Subject_List </span>
            <br />
            {GetStudentScoreLists.map((d)=>{
                return(
                    <>
            <br />
                <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${Grade}/${Year}/${Quarter}/${Subject}/${d.id}`}
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

export default ScoreLists_Year_Quarter_Subject_List