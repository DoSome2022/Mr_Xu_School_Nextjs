"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Image from 'next/image';

interface StudentDatailData {
    name:string;
    img:string;
    school:string;
    grade:string;
    year:string;
    quarter:string;
    subject:string;
    id:string;
}

const ExPageLists_Grade_Year_Quarter_Subject_Lists_By_IDbysupadmin = () => {
    const params = useParams<{ studentdetailbyID : string ; school : string; grade : string ; year: string; quarter:string; subject:string; id:string; parentdetailbyID:string }>();
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;
    const Subject = params?.subject ? decodeURIComponent(params.subject) : '';
    const id = params?.id as string;
    console.log("params : ",params)

    const [ GetStudentExPaperDetailByID , setGetStudentExPaperDetailByID ] = useState<StudentDatailData[]>([]);

    useEffect(()=>{
        if(StudentID){
            const getstudentexpaperlist = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/student/Student_ExPaper_by_id_Lists_by_id/${StudentID}/${id}`)
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentExPaperDetailByID(result);
                                     
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentexpaperlist(StudentID)
        }
    },[StudentID])


    console.log(GetStudentExPaperDetailByID[0])
   
    return(
        <>
            <span> ExPageLists_Grade_Year_Quarter_Subject_Lists_By_ID </span>
            <br />
            {GetStudentExPaperDetailByID.map((d)=>{
                if(d.school == SchoolName && d.grade == Grade && d.year == Year && d.quarter == Quarter && d.subject == Subject && d.id == id ){
                return(
                    <>

                    名稱:{d.name}
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

export default ExPageLists_Grade_Year_Quarter_Subject_Lists_By_IDbysupadmin