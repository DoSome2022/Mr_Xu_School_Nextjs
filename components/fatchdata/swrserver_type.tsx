"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";


import useSWR from "swr";

interface ServerType {
    id: string;
    server_type: string;

}

interface FormField {
    value: string;
    onChange: (value: string)  => void;
    disabled?: boolean;
}


const fetcher = (url: string): Promise<ServerType[]> =>
    fetch(url).then((res) => res.json());

export const SWR_Server_Type = ({ field } : { field: FormField }) => {
    const { data , error , isLoading } = useSWR('http://127.0.0.1:8000/api/servertype/servertype/' , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>

    console.log("data : ",data,"-- End --")

    return(
        <> 
                            <Select  defaultValue={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="選擇權限"/>
                            </SelectTrigger>
                            <SelectContent>
                                {data?.map(datas=>{
                                    return(
                                    <SelectItem value={datas.server_type} key={datas.id} >
                                        {datas.server_type}
                                    </SelectItem>
                                    )

                                })}

                            </SelectContent>

                        </Select>      
        </>
    )

}