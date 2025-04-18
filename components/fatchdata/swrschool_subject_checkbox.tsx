"use client";

import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
 } from "@/components/ui/form"



import { Checkbox } from "@/components/ui/checkbox"

import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const SWR_School_Subject_checkbox = ({ teacher_data }) => {
    const { data , error , isLoading } = useSWR('http://127.0.0.1:8000/api/School_data/schoolsubjects/' , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>
    

    return(
        <>
            <div className="space-y-4" >

            <FormLabel className="text-base">科目</FormLabel>
                    {data?.map(datas => (
                        <FormField
                            key={datas.id}
                            control={teacher_data.control}
                            name="subject"
                            render={({field}) => {
                                return(

                                    
                                    
                                    <FormItem 
                                        key={datas.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                                                <div className="mb-4">

                        </div>

                                        <FormControl>
                                        <Checkbox
                                            //checked
                                            onCheckedChange={(checked) => {
                                                //console.log(" -- checkbox value ", checked ,"-- end --")
                                                console.log(`Checked state for ${datas.school_subject}:`, checked);
                                                if (checked) {
                                                  field.onChange([...field.value, datas.school_subject]);
                                                  console.log("Updated field value:", [...field.value, datas.school_subject]);
                                                } else {
                                                  field.onChange(
                                                    field.value.filter(item => item !== datas.school_subject)
                                                  );
                                                  console.log("Updated field value:", 
                                                    field.value.filter(item => item !== datas.school_subject)
                                                  );
                                                }
                                            }}


                                        />
                                        </FormControl>

                                        <FormLabel className="font-normal" >
                                            {datas.school_subject}
                                        </FormLabel>

                                    </FormItem>

                                )
                            }}
                        
                        
                        />

                    ))}

            </div>
          
        </>
    )
}