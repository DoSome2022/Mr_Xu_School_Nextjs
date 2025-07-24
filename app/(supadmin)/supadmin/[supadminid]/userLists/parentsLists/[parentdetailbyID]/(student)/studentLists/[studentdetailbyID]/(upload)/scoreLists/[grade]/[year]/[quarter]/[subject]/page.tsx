"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from 'react';

interface StudentName {
    id:string;
    name:string;
    grade:string;
    year:string;
    quarter:string;
    subject:string;
}
const ScoreLists_Year_Quarter_Subject_ListbySupadmin = () => {
    const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ;  grade : string ; year: string; quarter:string; subject: string;supadminId: string;}>();
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;
    const Subject = params?.subject ? decodeURIComponent(params.subject) : '';
    const supadminId = params?.supadminId as string;


    const [ GetStudentScoreLists , setGetStudentScoreLists ] = useState<StudentName[]>([]);

    console.log("params : ", params )

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
                if(d.grade == Grade && d.year == Year && d.quarter == Quarter && d.subject == Subject){
                return(
                    <>
            <br />
                <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${Grade}/${Year}/${Quarter}/${Subject}/${d.id}`}
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

export default ScoreLists_Year_Quarter_Subject_ListbySupadmin