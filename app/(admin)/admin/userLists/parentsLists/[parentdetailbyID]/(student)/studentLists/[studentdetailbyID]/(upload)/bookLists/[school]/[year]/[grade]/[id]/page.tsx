"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Image from "next/image";


const Student_BookLists_School_Year_Grade_Id_Detail = () => {
    const params = useParams<{studentdetailbyID : string ; }>();
    const StudentID = params?.studentdetailbyID as string;

    const [ GetStudentBookListsDetailByID , setGetStudentBookListsDetailByID] = useState<any>([]);


    useEffect(()=>{
        if(StudentID){
            const getstudentbooklistsdetailbyid = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/student/Student_Booklist_by_id_Lists/${StudentID}`)
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentBookListsDetailByID(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentbooklistsdetailbyid(StudentID)
        }
    },[StudentID])


    console.log(GetStudentBookListsDetailByID[0])


    return(
        <>
            <span> Student_BookLists_School_Year_Grade_Id_Detail </span>
            <br />
            {GetStudentBookListsDetailByID.map((d)=>{
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

export default Student_BookLists_School_Year_Grade_Id_Detail