"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from 'next/image';


const ExPageLists_Grade_Year_Quarter_Subject_Lists_By_ID = () => {
    const params = useParams<{ studentdetailbyID : string ; }>();
    const StudentID = params?.studentdetailbyID as string;


    const [ GetStudentExPaperDetailByID , setGetStudentExPaperDetailByID ] = useState<any>([]);

    useEffect(()=>{
        if(StudentID){
            const getstudentexpaperlist = async (StudentID: string) => {
                try {
                    const res = await fetch(`/api/student/Student_ExPaper_by_id_Lists/${StudentID}`)
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

            })}
        </>
    )
}

export default ExPageLists_Grade_Year_Quarter_Subject_Lists_By_ID