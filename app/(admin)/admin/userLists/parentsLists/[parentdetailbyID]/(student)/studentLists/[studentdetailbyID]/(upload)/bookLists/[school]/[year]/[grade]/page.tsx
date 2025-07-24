"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from "react";

interface StudentData{
    id : string;
    name : string;
    school: string;
    grade: string;
    year: string;
}
const Student_BookLists_School_Year_Grade_Lists= () => {
    const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; school : string ; year : string ; grade : string}>();
    console.log(params)
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Year = params?.year as string;
    const Grade = params?.grade as string;



    const [ GetStudentBookLists , setGetStudentBookLists ] = useState<StudentData[]>([]);


    useEffect(()=>{
        if(StudentID){
            const getstudentexbooklists = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/student/Student_Booklist_by_id_Lists/${StudentID}`)
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentBookLists(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentexbooklists(StudentID)
        }
    },[StudentID])


    console.log("GetStudentBookLists :" ,GetStudentBookLists)


    return(
        <>
            <span> Student_BookLists_School_Year_Grade_Lists </span>


<br />

{GetStudentBookLists.map((d)=>{

    if(d.school== SchoolName && d.year == Year && d.grade == Grade ) {
    return(
        <>
                    <Link
                className="text-stone-950 hover:text-gray-700"
                href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${Year}/${Grade}/${d.id}`}
            >
            名稱：{d.name}

            </Link>
            <br />
        </>
    )
    }




})}


        </>
    )
}

export default Student_BookLists_School_Year_Grade_Lists