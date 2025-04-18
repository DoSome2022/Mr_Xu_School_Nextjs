"use client";

import * as z from "zod";
import { useState, useEffect ,useTransition, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button";
import DatePicker from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel";

import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

import useSWR from "swr";
import { LessonCal_Update_Schema } from "@/actions/Update-LessonCal/schema";
import { update_LCS } from "@/actions/Update-LessonCal";
import { formatDate } from "date-fns";

const LessonCal_Update_Form = () => {
  const params = useParams();
  const LCSID = params?.lessoncalendarsettingdetailbyID as string;

  const [GetLCSDataById , setGetLCSDataById] = useState([]);
  const [ Lesson , setLesson ] = useState([]);
  const [ selectedDates, setSelectedDates ] = useState(null);

  const LCS_update_form = useForm<z.infer<typeof LessonCal_Update_Schema>>({
    resolver : zodResolver(LessonCal_Update_Schema),
    defaultValues:{
      lscId: LCSID,
      lesson_date : {},
      course_lesson: {},
    }
  })


  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  // swr django data
  const { data , error , isLoading } =  useSWR('http://127.0.0.1:8000/api/course_data/courselessons/' , fetcher);
  if(error) return error 


  useEffect(()=>{
    if(data) return setLesson(data);
    // if(data) return setSelectedDates(data.map(()=> ""));// 初始化选中的日期数组
    },[data])

  useEffect(()=>{
    if(LCSID) {
      const getLCSDetail = async (id: string) => {
          try {
          const res = await fetch(`/api/LessonCal_detail_data_by_id/${id}`);
          if(!res.ok) {
              throw new Error("斷線！");
          }
          const result = await res.json();
          setGetLCSDataById(result);                    
          } catch (error) {
              console.error(error);
          }
      };
      getLCSDetail(LCSID);
  }
  },[LCSID])

  // console.log(GetLCSDataById)
  useEffect(() => {
    if (GetLCSDataById.length > 0) {
      const d = GetLCSDataById[0];
      d.lesson_date.forEach((date , idx) =>{
          LCS_update_form.setValue(`lesson_date.${idx}`, date);
          LCS_update_form.setValue(`course_lesson.${idx}`, d.courseLesson[idx]);
      }) 

      setSelectedDates(new Date(d.lesson_date[0]));
    }
  }, [GetLCSDataById, LCS_update_form.setValue]);

  useEffect(() => {
    if (GetLCSDataById.length > 0) {
      const d = GetLCSDataById[0];
  
      // 構建動態字段的初始值
      const initialValues = {
        lscId: LCSID,
        lesson_date: {},
        course_lesson: {},
      };
  
      d.lesson_date.forEach((date, idx) => {
        initialValues.lesson_date[idx] = date; // 設置 lesson_dates
        initialValues.course_lesson[idx] = d.courseLesson[idx]; // 設置 course_lessons
      });
  
      // 使用 reset 方法設置表單的初始值
      LCS_update_form.reset(initialValues);
  
      // 設置 DatePicker 的初始值
      setSelectedDates(new Date(d.lesson_date[0]));
    }
  }, [GetLCSDataById, LCS_update_form.reset]);


    //獲得星期
    const getDayOfWeek = (date) => {
      const dayOfWeek = ['(日)','(一)','(二)','(三)','(四)','(五)','(六)']
      return dayOfWeek[date.getUTCDay()]
  }
  //修改日子格式 
  const formatDate = (dateString) => {
    if (!dateString) return "";
  
    // 解析 UTC 時間
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
  
    // 使用 UTC 方法獲取年、月、日
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
  
    // 使用本地時區獲取星期幾
    const dayOfWeek = getDayOfWeek(date);
    return `${year}-${month}-${day} ${dayOfWeek}`;
  };


  const handleDateChange = (newValues,idx) => {
    let newDate;
    if (Array.isArray(newValues)) {
      newDate = new Date(newValues[0]); // 如果是數組，取第一個值
    } else {
      newDate = new Date(newValues); // 如果是單一值，直接使用
    }
  
    if (isNaN(newDate.getTime())) return; // 檢查日期是否有效
  
    setSelectedDates(newDate);
    LCS_update_form.setValue(`lesson_date.${idx}`,newDate.toISOString())
    console.log(newDate)
  }

  const handleLessonChange = (value, idx) => {
    LCS_update_form.setValue(`course_lesson.${idx}`, value);
  }


  const LCS_update_form_onSubmit = (values : z.infer<typeof LessonCal_Update_Schema>) => {
    console.log("is work")
    console.log("-- update LCS_DATA -- : ", values , "-- End --")


    startTransition(()=>{
      update_LCS(values)
    })

  }

  // console.log(selectedDates)

  return (
    <>
      <Form {...LCS_update_form}>
        <form onSubmit={LCS_update_form.handleSubmit(LCS_update_form_onSubmit)} className="space-y-6">
          {GetLCSDataById.map((item, index) => (
            <div key={index}>
              {item.lesson_date.map((d_ld, idx) => {
                const courseLesson = item.courseLesson[idx];
                return (
                  <div key={idx}>
                    <DatePicker
                      value={formatDate(LCS_update_form.getValues(`lesson_date.${idx}`))}
                      onChange={(newValues) => handleDateChange(newValues, idx)}
                      format="YYYY-MM_DD"
                    />
                    <FormField
                      control={LCS_update_form.control}
                      name={`lesson_date.${idx}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>原本日期: {formatDate(d_ld)}</FormLabel>
                          <FormControl>
                            <div>
                              <Input
                                type="text"
                                {...field}
                                value={field.value ? formatDate(field.value) : ""}
                                readOnly
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={LCS_update_form.control}
                      name={`course_lesson.${idx}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>原本節數: {courseLesson}</FormLabel>
                          <FormControl>
                            <div>
                              <Select
                                defaultValue={String(field.value)}
                                onValueChange={(value) => handleLessonChange(value, idx)}
                              >
                                <SelectTrigger>
                                  <SelectValue>{field.value || "選擇節數"}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {Lesson?.map((datas) => (
                                    <SelectItem value={String(datas.course_lesson)} key={datas.id}>
                                      {datas.course_lesson}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                );
              })}
            </div>
          ))}

          <Button> Submit </Button>

        </form>
      </Form>
    </>
  );

  
}

export default LessonCal_Update_Form  


