"use client";




import Parent_Student_ScoreLists_Create_Form from "@/components/CreateForm/Parent-Student/Parent-Student_ScoreLists_Create_Form";
import Student_Score_Create_Form from "@/components/CreateForm/Student-Score-Create-Form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


const Student_Score_upload = () =>{

    const params = useParams();
    console.log(params)
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;

    const [ GetStudentData , setGetStudentData ] = useState([]);

    useEffect(() => {
        if(StudentID){
            const fetchStudentData = async (StudentID: string) => {
                const res = await fetch(`/api/student/Student_Lists_detail_data_by_id/${StudentID}`)
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
<Parent_Student_ScoreLists_Create_Form />
        </>
    )
    
}

export default Student_Score_upload