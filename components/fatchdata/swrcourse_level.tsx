"use client";



import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

import useSWR from "swr";



const fetcher = (...args) => fetch(...args).then((res) => res.json());



export  const SWR_Course_Level = ({field}) => {

    const { data , error , isLoading } =  useSWR('http://127.0.0.1:8000/api/course_data/courselevels' , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>


    

    return(
        <>
                    
                    <Select  defaultValue={field.values} onValueChange={field.onChange} >
                            <SelectTrigger>
                                <SelectValue placeholder="選擇難度"/>
                            </SelectTrigger>
                            <SelectContent>
                                {data?.map(datas=>{
                                    return(
                                    <SelectItem value={datas.course_level} key={datas.id} >
                                        {datas.course_level}
                                    </SelectItem>
                                    )

                                })}

                            </SelectContent>

                        </Select>


        </>
    )
  }