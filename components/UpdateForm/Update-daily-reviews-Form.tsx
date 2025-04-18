"use client";
import * as z from "zod";
import { useState, useEffect ,useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button";
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
 } from "@/components/ui/form"
import { update_dailyreviews } from "@/actions/Update-dailyreviews";
import { Update_Dailyreviews_Schema } from "@/actions/Update-dailyreviews/schema";

const Update_daily_reviews_Form = () => {
  const [isPending , startTransition] = useTransition();
  const param = useParams();
  console.log("param : ",param)
  const studentId = param?.studentdetailbyID as string;
  const teacherId = param?.teacherId as string;
  const dailyreviewId = param?.dailyreviewbyID as string;

  const [getdailyreviewsData , setgetdailyreviewsData] =useState([]);

  useEffect(()=>{
    const fetchdailyreviews = async (id:string) => {
      const res = await fetch(`/api/Dailyreviews_detail_data_by_id/${id}`);
      if(!res){
        throw new Error("斷線！");
      }
      const result = await res.json();
      setgetdailyreviewsData(result);
    }
    fetchdailyreviews(dailyreviewId)
  },[dailyreviewId])

  console.log("getdailyreviewsData : ",getdailyreviewsData)


  const dailyreviews_update_form = useForm({
    resolver: zodResolver(Update_Dailyreviews_Schema),
    defaultValues: {
      id:dailyreviewId,
      student_id: studentId,
      teacher_id: teacherId,
      title:"",
      content:"",

    },
  });

// 當 getdailyreviewsData 更新時，設置表單值
useEffect(() => {
  if (getdailyreviewsData) {
    dailyreviews_update_form.setValue("title", getdailyreviewsData[0]?.title || "");
    dailyreviews_update_form.setValue("content", getdailyreviewsData[0]?.content || "");
  }
}, [getdailyreviewsData, dailyreviews_update_form]);



  const dailyreviews_update_form_onSubmit = (values: z.infer<typeof Update_Dailyreviews_Schema>) => {
    console.log("-- create dailyreviews輸入 -- : ",values,"-- End --")

    startTransition(() => {
      update_dailyreviews(values)
    })

  }


  return (
    <div>
      <Form {...dailyreviews_update_form}>
        <form 
        onSubmit={dailyreviews_update_form.handleSubmit(dailyreviews_update_form_onSubmit)}
        className="space-y-4"
        >

                <FormField
                    control={dailyreviews_update_form.control}
                    name="title"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 標題 </FormLabel>
                    <FormControl>
                        <Input 
                            {...field }
                            disabled={isPending}
                            placeholder="輸入標題"
                            type="text"
                            />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />


                <FormField
                    control={dailyreviews_update_form.control}
                    name="content"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 內容 </FormLabel>
                    <FormControl>
                        <Input 
                            {...field }
                            disabled={isPending}
                            placeholder="輸入內容"
                            type="text"
                            />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />

              <Button disabled={isPending} type="submit"  >
                {isPending ? "Loading..." : "建立"}
              </Button>


        </form>
      </Form>
    </div>
  )
}

export default Update_daily_reviews_Form