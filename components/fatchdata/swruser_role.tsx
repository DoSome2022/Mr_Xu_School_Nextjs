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

export const SWR_User_Role = ({ field }) => {
    const { data , error , isLoading } = useSWR('http://127.0.0.1:8000/api/user_role/userroles/' , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>
    
    return(
        <>
                    <Select  defaultValue={field.values} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="選擇權限"/>
                            </SelectTrigger>
                            <SelectContent>
                                {data?.map(datas=>{
                                    return(
                                    <SelectItem value={datas.user_role} key={datas.id} >
                                        {datas.user_role}
                                    </SelectItem>
                                    )

                                })}

                            </SelectContent>

                        </Select>        
        </>
    )
}