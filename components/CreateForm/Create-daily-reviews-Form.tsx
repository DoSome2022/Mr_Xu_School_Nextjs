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
import { Create_Dailyreviews_Schema } from "@/actions/Create-dailyreviews/schema";
import { create_dailyreviews } from "@/actions/Create-dailyreviews";
const Create_daily_reviews_Form = () => {
  const [isPending , startTransition] = useTransition();
  const param = useParams();
  console.log("param : ",param)
  const studentId = param?.studentdetailbyID as string;
  const teacherId = param?.teacherId as string;

  const dailyreviews_create_form = useForm({
    resolver: zodResolver(Create_Dailyreviews_Schema),
    defaultValues: {
      student_id: studentId,
      teacher_id: teacherId,
      title:"",
      content:"",
    },
  });

  const dailyreviews_create_form_onSubmit = (values: z.infer<typeof Create_Dailyreviews_Schema>) => {
    console.log("-- create dailyreviews輸入 -- : ",values,"-- End --")

    startTransition(() => {
      create_dailyreviews(values)
    })

  }


  return (
    <div>
      <Form {...dailyreviews_create_form}>
        <form 
        onSubmit={dailyreviews_create_form.handleSubmit(dailyreviews_create_form_onSubmit)}
        className="space-y-4"
        >

                <FormField
                    control={dailyreviews_create_form.control}
                    name="title"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 標題 </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
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
                    control={dailyreviews_create_form.control}
                    name="content"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 內容 </FormLabel>
                    <FormControl>
                        <Input 
                            {...field}
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

export default Create_daily_reviews_Form