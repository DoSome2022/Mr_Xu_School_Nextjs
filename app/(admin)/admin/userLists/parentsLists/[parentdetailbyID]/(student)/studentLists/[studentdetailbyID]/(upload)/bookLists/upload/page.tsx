"use client";

import Student_BookList_Create_Form from "@/components/CreateForm/Student-BookList-Create-Form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";



const Student_BookLists_upload = () =>{


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


    // console.log(" --  Student Data : -- ", StudentID ,"-- End --")


    return(
        <>
            <Student_BookList_Create_Form  studentId={StudentID} data={GetStudentData} />
        </>
    )
    
}

export default Student_BookLists_upload