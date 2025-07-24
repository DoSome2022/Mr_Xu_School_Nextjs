"use client";
import { useParams } from "next/navigation";
import React,{ useEffect, useState } from "react";

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
const TimeTemplatebyId:React.FC =()=>{
    const param = useParams();
    const TimeTempById = param?.timetemplatebyId as string;
    const [GetTimeTempById , setGetTimeTempById] = useState<TimeTemplateData[]>([]);

    useEffect(()=>{
        const timetempbyid = async(id:string)=>{
            const res = await fetch(`/api/TimeTemplate_Lists_by_id/${id}`);
            if(!res){
                throw new Error("斷線！");
            }

            const result = await res.json();

            setGetTimeTempById(result);
        }
        timetempbyid(TimeTempById)
    },[TimeTempById])

    console.log("-- Time Template by ID : --",GetTimeTempById,"-- END --")

 


    return(
        <div>
            TimeTemplatebyId
                <br />
            {GetTimeTempById.map((d)=>{
                return(
                    <>
                        <br />
                        Title: {d.title},
                        月 開始時間: {d.day_start},
                        月 結束時間: {d.end_time},
                        星期日子:{ d.weekdays.map((wd)=>{
                            return(
                                <>
                                    <br />
                                    日期：{wd.date},
                                    <br />
                                    開始時間:  {wd.start_time},
                                    <br />
                                    結束時間:  {wd.end_time},
                                    <br />
                                   課節： {wd.lesson},
                                </>
                            )
                        })}

                        <br />
                        <br />
                        <br />
                        <br />

                        單獨日子:{d.days.map((sd)=>{
                            return(
                                <>
                                  日期：{sd.date},
                                    <br />
                                    開始時間:  {sd.start_time},
                                    <br />
                                    結束時間:  {sd.end_time},
                                    <br />
                                   課節： {sd.lesson},
                                </>
                            )
                        })}



                    </>
                )
            })}


        </div>
    )

}

export default TimeTemplatebyId;