"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface StudentDetailData {
    name: string;
    img: string;
    id: string;
    school: string;
    grade: string;
    year: string;
    quarter: string;
}

const SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_IDbysupadmin = () => {
    const params = useParams<{ studentdetailbyID : string ; id : string ; parentdetailbyID: string; school : string; grade : string ; year: string; quarter: string;}>();
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;
    const Id = params?.id as string;


    const [ GetStudentSchoolTimeTableDetailByID , setGetStudentSchoolTimeTableDetailByID ] = useState<StudentDetailData[]>([]);

    useEffect(()=>{
        if(StudentID && Id){
            const getstudentschooltimetabledetailbyid = async (StudentID: string , id: string) => {
                try {
                    const res = await fetch(`/api/student/Student_ScTimetable_by_id_Lists_by_id/${StudentID}/${id}`)
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentSchoolTimeTableDetailByID(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentschooltimetabledetailbyid(StudentID , Id)
        }
    },[StudentID , Id])


    console.log(GetStudentSchoolTimeTableDetailByID)


    return(
        <>
            <span> SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_ID </span>
            <br />
{GetStudentSchoolTimeTableDetailByID.map((d)=>{
    if(d.school == SchoolName && d.grade == Grade && d.year == Year && d.quarter == Quarter){
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

export default SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_IDbysupadmin