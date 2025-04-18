"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const TimeTemplateLists =()=>{
    const [GetTimeTempList, setGetTimeTempList] = useState([]);

    useEffect(()=>{
        const fetchtimetemp = async () => {
            const res = await fetch('/api/TimeTemplate_Lists');
            if(!res) {
                throw new Error("斷線！")
            }
            const result = await res.json()
            console.log(result)
            setGetTimeTempList(result);
        }
        fetchtimetemp()
    },[])
    console.log("GetTimeTempList : ",GetTimeTempList)


    return(
        <>
        <Link href={"/admin/timetemplateLists/createtimetemp"} >
        createtimetemp
        </Link>
        <br />

        TimeTemplateLists

        {GetTimeTempList?.map((d:any)=>{
            return(
                <>
                <br />
                <Link href={`/admin/timetemplateLists/${d.id}`}>
                    {d.title}
                </Link>
                <br />
                </>
            )
        })}
        </>
    )
}

export default TimeTemplateLists