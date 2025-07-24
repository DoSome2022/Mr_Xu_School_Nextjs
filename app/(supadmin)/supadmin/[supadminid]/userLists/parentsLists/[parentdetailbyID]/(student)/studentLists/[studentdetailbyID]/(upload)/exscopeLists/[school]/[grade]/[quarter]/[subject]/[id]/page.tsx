"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Image from "next/image";

interface StudentDetailData {
    name: string;
    img: string;
    id: string;
    school: string;
    grade: string;
    quarter: string;
    subject: string;
}

const ExScope_Grade_Quarter_Subject_Lists_By_IDbysuadmin = () => {

    const params = useParams<{studentdetailbyID : string ; parentdetailbyID:string; school: string; grade: string; quarter: string; subject: string; id: string;}>();
    const StudentID = params?.studentdetailbyID as string;
    const Id = params?.id as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Quarter = params?.quarter as string;
    const Subject = params?.subject ? decodeURIComponent(params.subject) : '';

    const [ GetStudentExScopeDetailByID , setGetStudentExScopeDetailByID] = useState<StudentDetailData[]>([]);


    useEffect(()=>{
        if(StudentID && Id){
            const getstudentexscopedetailbyid = async (StudentID: string ,id: string) => {
                try {
                    const res = await fetch(`/api/student/Student_ExScope_by_id_Lists_by_id/${StudentID}/${id}`)
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentExScopeDetailByID(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentexscopedetailbyid(StudentID , Id)
        }
    },[StudentID , Id])


    console.log(GetStudentExScopeDetailByID)

    return(
        <>


            <span> ExScope_Grade_Quarter_Subject_Lists_By_ID </span>
            <br />
{GetStudentExScopeDetailByID.map((d)=>{
    if(d.school == SchoolName && d.grade == Grade && d.quarter == Quarter && d.subject == Subject && d.id == Id){
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
    }
   
})}
            
        </>
    )
}

export default ExScope_Grade_Quarter_Subject_Lists_By_IDbysuadmin