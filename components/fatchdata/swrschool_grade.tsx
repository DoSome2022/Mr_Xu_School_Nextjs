"use client";

// 定義年級對應對象
const gradeMapping = {
    1: "小學1年級",
    2: "小學2年級",
    3: "小學3年級",
    4: "小學4年級",
    5: "小學5年級",
    6: "小學6年級",
    7: "初中1年級",
    8: "初中2年級",
    9: "初中3年級",
    10: "高中1年級",
    11: "高中2年級",
    12: "高中3年級",
  };
  

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const SWR_School_Grade = ({ field }) => {
    const { data , error , isLoading } = useSWR('http://127.0.0.1:8000/api/School_data/schoolgrades/' , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>
    
    return(
        <>
                    <Select  
                        defaultValue={String(field.values)} 
                        onValueChange={(value) => field.onChange(Number(value)) }
                    >
                            <SelectTrigger>
                                <SelectValue>{ gradeMapping[field.value] || "選擇年級"}</SelectValue> 
                            </SelectTrigger>
                            <SelectContent>
                                {data?.map(datas=>{
                                    return(
                                    <SelectItem value={String(datas.school_grade)} key={datas.id} >
                                        { gradeMapping[ datas.school_grade ]}
                                    </SelectItem>
                                    )

                                })}

                            </SelectContent>

                        </Select>        
        </>
    )
}