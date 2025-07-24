"use client";

import Link from "next/link";
import React ,{ useEffect, useState } from "react";

interface DayData {
    date:string;
    start_time:string;
    end_time:string;
    lesson:string;
}

interface Weekdays{
    date:string;
    start_time:string;
    end_time:string;
    lesson:string;
}


interface TimeTemplateData{
    id: string;
    publicholiday_model:{
        [porp:number]:string;
    };
    title: string;
    day_start: string;
    day_end:string;
    start_time:string;
    end_time:string;
    weekdays:Weekdays[];
    days:DayData[];
    grade:number;
    lesson:string;
}


const TimeTemplateLists :React.FC=()=>{
    const [GetTimeTempList, setGetTimeTempList] = useState<TimeTemplateData[]>([]);

        const fetchtimetemp = async (): Promise<void> => {
            try {
            const res = await fetch('/api/TimeTemplate_Lists');
            if(!res) {
                throw new Error("斷線！")
            }    
            const result = await res.json()
            console.log(result)
            setGetTimeTempList(result);


            } catch (error) {
                console.error('Fetch error:', error);  
            }


        }
        

    useEffect(()=>{
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

        {GetTimeTempList?.map((d)=>{
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