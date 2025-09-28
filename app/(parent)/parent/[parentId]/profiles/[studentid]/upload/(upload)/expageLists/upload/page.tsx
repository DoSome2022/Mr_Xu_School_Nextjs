"use client";

import Parent_Student_ExpageLists_Create_Form from "@/components/CreateForm/Parent-Student/Parent-Student_ExpageLists_Create_Form";
import Student_EX_Page_Create_Form from "@/components/CreateForm/Student-EX-Pager-Create-Form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";



const Student_ExpageLists_upload = () =>{

    const params = useParams();
    console.log(params)
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;


    const [ GetStudentData , setGetStudentData ] = useState([]);

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

    return(
        <>
            <Parent_Student_ExpageLists_Create_Form />
        </>
    )
    
}

export default Student_ExpageLists_upload