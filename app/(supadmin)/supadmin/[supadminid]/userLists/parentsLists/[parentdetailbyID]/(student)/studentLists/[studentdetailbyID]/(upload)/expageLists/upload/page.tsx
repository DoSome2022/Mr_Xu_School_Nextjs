"use client";

import Student_EX_Page_Create_Form from "@/components/CreateForm/Student-EX-Pager-Create-Form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface StudentData {
    id: string;
    name: string;
    grade: number;
    school: string;
}

const Student_ExpageLists_uploadbysupadmin = () =>{

    const params = useParams();
    console.log(params)
    const StudentID = params?.studentdetailbyID as string;


    const [ GetStudentData , setGetStudentData ] = useState<StudentData[]>([]);

    useEffect(() => {
        if(StudentID){
            const fetchStudentData = async (StudentID: string) => {
                const res = await fetch(`/api/student/Student_Lists_detail_data_by_id/${StudentID}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            })
                if(!res.ok){
                    throw new Error("斷線！")
                }
                const result = await res.json();
                setGetStudentData(result);

            } 
            fetchStudentData(StudentID)
        }
    },[StudentID])

    if (!StudentID) {
        return <div className="p-4 text-red-500">無效的學生 ID</div>;
      }
    
    
      if (!GetStudentData) {
        return <div className="p-4">載入中...</div>;
      }

    return(
        <>
            <Student_EX_Page_Create_Form studentId={StudentID} data={GetStudentData} />
        </>
    )
    
}

export default Student_ExpageLists_uploadbysupadmin