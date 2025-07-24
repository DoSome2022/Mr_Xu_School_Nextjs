"use client"


import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";



const teacherListsbysupadmin =  () =>{

    //為了拿老師data
    const [ GetTeacherData , setgetTeacherData ] = useState([]);
        const param = useParams();

    console.log("param :",  param ,"--end --"  );

    const supadminId = param?.supadminId as string;

        //拿老師data
        useEffect(() => {
            const getTeacherData = async () =>{
                //在app/api/Course_data/route.ts
                const res = await fetch('/api/Course_data_teacher');
                if(!res){
                    throw new Error("斷線！")
                }
                
               const result = await res.json()
    
               setgetTeacherData(result)
    
            }
            getTeacherData()
        },[])
    

    return(
        <>
        <div>
            teacherLists
            <div>
                <Link href={`/supadmin/${supadminId}/userLists/teachersLists/createTeacher`} > 建立老師 </Link>
            </div>

            <div>

            {GetTeacherData.map((data)=>{
                if( data.role === "TEACHER" )
                    {
                        return(
                            <>
                                <Link href={`/supadmin/${supadminId}/userLists/teachersLists/${data.id}`} key={data.id} >
                                id:{data.id}
                                <br />
                                名：{data.username}


                                </Link>
                            </>
                                )
                    }

                })}

            </div>

        </div>
        </>
    )
}

export default teacherListsbysupadmin