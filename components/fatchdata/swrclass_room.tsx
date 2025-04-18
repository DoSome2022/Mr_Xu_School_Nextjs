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

export const SWR_Class_Room = ({ field }) => {
    const { data , error , isLoading } =  useSWR('http://127.0.0.1:8000/api/course_data/courserooms/' , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>

    return(
        <>
        <Select 
        defaultValue={String(field.values)} 
        onValueChange={(value) => field.onChange(value)}>
          <SelectTrigger>
              <SelectValue >{field.value ||"選擇課室"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {data?.map(datas=>{
              return(
                <SelectItem value={datas.course_room} key={datas.id} >
                  {datas.course_room}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
    </>
    )

}