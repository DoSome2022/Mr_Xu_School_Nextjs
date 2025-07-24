"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Image from "next/image";

interface StudentDetailData{
    name: string;
    img:string;
    school: string;
    grade: string;
    year: string;
    id: string;
}
const Student_BookLists_School_Year_Grade_Id_Detail = () => {
    const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; school : string ; year : string ; grade : string ; id:string}>();
    console.log(params)
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Year = params?.year as string;
    const Grade = params?.grade as string;
    const id = params?.id as string;



    const [ GetStudentBookListsDetailByID , setGetStudentBookListsDetailByID] = useState<StudentDetailData[]>([]);


    useEffect(()=>{
        if(StudentID){
            const getstudentbooklistsdetailbyid = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/student/Student_Booklist_by_id_Lists_by_id/${StudentID}/${id}`)
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


    console.log(GetStudentBookListsDetailByID)


    return(
        <>
            <span> Student_BookLists_School_Year_Grade_Id_Detail </span>
            <br />
            {GetStudentBookListsDetailByID.map((d)=>{

            if(d.school== SchoolName && d.year == Year && d.grade == Grade && d.id == id ) {
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

export default Student_BookLists_School_Year_Grade_Id_Detail