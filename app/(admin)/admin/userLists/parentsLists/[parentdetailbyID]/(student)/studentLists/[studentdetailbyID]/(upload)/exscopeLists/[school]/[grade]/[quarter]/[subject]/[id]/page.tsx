"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Image from "next/image";

const ExScope_Grade_Quarter_Subject_Lists_By_ID = () => {

    const params = useParams<{studentdetailbyID : string ; }>();
    const StudentID = params?.studentdetailbyID as string;

    const [ GetStudentExScopeDetailByID , setGetStudentExScopeDetailByID] = useState<any>([]);


    useEffect(()=>{
        if(StudentID){
            const getstudentexscopedetailbyid = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/student/Student_ExScope_by_id_Lists/${StudentID}`)
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentExScopeDetailByID(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentexscopedetailbyid(StudentID)
        }
    },[StudentID])


    console.log(GetStudentExScopeDetailByID[0])

    return(
        <>


            <span> ExScope_Grade_Quarter_Subject_Lists_By_ID </span>
            <br />
{GetStudentExScopeDetailByID.map((d)=>{
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

export default ExScope_Grade_Quarter_Subject_Lists_By_ID