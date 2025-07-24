"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  // FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Apply_Create_Schema } from "@/actions/Create-Apply/schema";
import { createApply } from "@/actions/Create-Apply";


interface GetStudentData {
  id: string;
  username: string;
  Student:[];
  name:  string;
  grade: number;
}

interface StudentData {
  id: string;
  name:  string;
  grade: number;
}

const AddToApply_Create_Form = ({ productId , productName ,courseid, }: { productId: string ; productName: string ; courseid: string }) => {
    const param = useParams();
    const parentId = param.parentId as string;
    console.log("param : ",param)
    console.log("productId : ",productId)
    console.log("productName : ",productName)
    console.log("courseid : ",courseid)
    const [isPending , startTransition] = useTransition();
    const [ GetStudentData , setGetStudentData ] = useState<GetStudentData[]>([]);

    useEffect(()=>{
      if(parentId){
        const fetchStudentData = async (id:string) => {
          const res = await fetch(`/api/Parents_Lists_by_id/${id}`);
          if (!res) {
            throw new Error("斷線！");
          }
          const result = await res.json();
          setGetStudentData(result);
        };
        fetchStudentData(parentId);
      }
    },[parentId])

    console.log(" --  AddToApply_Create_Form -- : ", GetStudentData, " -- end -- ");

    const username = GetStudentData[0]?.username;
    const StudentsData = GetStudentData[0]?.Student;

    console.log("--username-- : ",username,"--END--")




    const AddToApply_Create_form = useForm<z.infer<typeof Apply_Create_Schema>>({
        resolver: zodResolver(Apply_Create_Schema),
        defaultValues: {
          apply:false,
          product_id:productId,
          username:username,
          apply_student_id:"",
          parent_id:"",
          course_id: "",
          course_name: "",
          applystate:"待處理"
        },
      });


    useEffect(()=>{
      if(GetStudentData){
        AddToApply_Create_form.setValue("username",username)
        AddToApply_Create_form.setValue("course_id",courseid)
        AddToApply_Create_form.setValue("course_name",productName)
        AddToApply_Create_form.setValue("parent_id",parentId)
      }
    },[GetStudentData])

      // 提交表單的處理函數
      const AddToApply_Create_form_onSubmit = (values: z.infer<typeof Apply_Create_Schema>) => {
       console.log("--  AddToApply_Create_Form -- : ", values, "-- End --");
       startTransition(() => {
        createApply(values)
       })
        
      };


      console.log("bug :",AddToApply_Create_form.formState.errors,"--end--")

      return (
        <>
          <Form {...AddToApply_Create_form} >
            <form 
              onSubmit={AddToApply_Create_form.handleSubmit(AddToApply_Create_form_onSubmit)}
              className="space-y-4"
            >
              <div className="space-y-4">
                <FormField
                  control={AddToApply_Create_form.control}
                  name="apply_student_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> 學生 </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        > 
                          <SelectTrigger>
                            <SelectValue placeholder="請選擇學生" />
                          </SelectTrigger>
                          <SelectContent>
                            {StudentsData?.map((data :StudentData) => {
                              return (
                                <SelectItem value={data.id} key={data.id}>
                                  姓名:{data.name} 年級:{data.grade}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

                
                <Button disabled={isPending} type="submit"> {isPending ? "Loading..." : "申請"} </Button>

            </form>
          </Form>
        </>
      );
};


export default AddToApply_Create_Form;