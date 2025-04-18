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

export const SWR_School_Branch_Data = ({ field }) => {
    const { data , error , isLoading } = useSWR('http://127.0.0.1:8000/api/school_branch_campus/schoolbranchDatas/' , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>


    return(
        <>
                    <Select  defaultValue={field.values} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="選擇學校分校"/>
                            </SelectTrigger>
                            <SelectContent>
                                {data?.map(datas=>{
                                    return(
                                    <SelectItem value={datas.school_branch} key={datas.id} >
                                        {datas.school_branch}
                                    </SelectItem>
                                    )

                                })}

                            </SelectContent>

                        </Select>        
        </>
    )
}