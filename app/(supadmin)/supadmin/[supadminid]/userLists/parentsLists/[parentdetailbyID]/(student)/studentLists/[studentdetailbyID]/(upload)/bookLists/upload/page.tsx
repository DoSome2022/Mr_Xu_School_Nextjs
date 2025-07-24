"use client";


import Student_BookList_Create_Formbysupadmin from "@/components/CreateForm/SUPADMIN/UploadForm/student/Sup-Student-BookList-Create-Form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface StudentData {
    id: string;
    name: string;
    grade: number;
    school: string;
}

const Student_BookLists_uploadbysupadmin = () =>{


    const params = useParams();
    console.log(params)
    const StudentID = params?.studentdetailbyID as string;

    const [ GetStudentData , setGetStudentData ] = useState<StudentData[]>([]);

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


    console.log(" --  Student Data : -- ", StudentID ,"-- End --")

    if (!StudentID) {
        return <div className="p-4 text-red-500">無效的學生 ID</div>;
      }
    
    
      if (!GetStudentData) {
        return <div className="p-4">載入中...</div>;
      }

    return(
        <>
            <Student_BookList_Create_Formbysupadmin  studentId={StudentID} data={GetStudentData} />
        </>
    )
    
}

export default Student_BookLists_uploadbysupadmin