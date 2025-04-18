"use client";


import * as z from "zod";
import { useState, useEffect ,useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useParams } from 'next/navigation';

import { Input } from "@/components/ui/input"; 
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button";

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

import { Class_Create_Schema } from "@/actions/Create-Class/schema";
import { SWR_Class_Room } from "../fatchdata/swrclass_room";
import { SWR_Class_Time } from "../fatchdata/swrclass_tiime";
import { SWR_Class_Lesson } from "../fatchdata/swrclass_lesson";
import { createClass } from "@/actions/Create-Class";
import DatePicker from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { Switch } from "../ui/switch";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";


const WeekDatas = [
    {
        id: "Su",
        label: "星期日",
    },
    {
        id: "MO",
        label: "星期一",
    },
    {
        id: "TU",
        label: "星期二",
    },
    {
        id: "WE",
        label: "星期三",
    },
    {
        id: "TH",
        label: "星期四",
    },
    {
        id: "FR",
        label: "星期五",
    },
    {
        id: "SA",
        label: "星期六",
    },
]


const Class_Create_Form = () => {
    const [isPending , startTransition] = useTransition();
    const params = useParams();//plz use console.log see params name

    const CourseId = params?.coursedetailbyID as string;// 獲取URL中的CourseId參數
    const [freqValue, setFreqValue] =useState('');
    const [byweekdayValue, setByWeekDayValue]= useState([]);
    const [ error, setError ] = useState<string | undefined>("");
    const [ success, setSuccess  ] = useState<string | undefined>("");
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [ countvalue , setcountvalue ] = useState<Number>();


    
    const handleFreqChange= (value) => {
        setFreqValue(value);
        if (value !== 'weekly') {
            setByWeekDayValue([]);
        }
    }

    const handleByweekdayChange = (checked , id) => {
        setByWeekDayValue((prev) => 
            checked ? [...prev,id] : prev.filter((day) => day !== id))
    }

 

        //為了拿老師data
        const [ GetTeacherData , setgetTeacherData  ] = useState([])
    
        //拿老師data
        useEffect(() => {
            const getTeacherData = async () =>{
                //在app/api/Course_data_teacher/route.ts
                const res = await fetch('/api/Course_data_teacher');
                if(!res){
                    throw new Error("斷線！")
                }
                
               const result = await res.json()
    
               setgetTeacherData(result)
    
            }
            getTeacherData()
        },[])



        const [ GetCourseData , setGetCourseData ] = useState([]);
        useEffect(() => {
            if(CourseId){
            const getcoursedata = async (courseid : string) =>{
                //在app/api/Course_data/route.ts
                const res = await fetch(`/api/Course_detail_data_by_id_findMany/${courseid}`);
                if(!res){
                    throw new Error("斷線！")
                }
                
               const result = await res.json()
    
               setGetCourseData(result)
    
            }
                getcoursedata(CourseId)
            }
    
    
        },[CourseId])

        const [GetClassPersons , setGetClassPersons] = useState(0);
        const [GetClassNode , setGetClassNode] = useState(0);
        const [GetCourseTeacher , setGetCourseTeacher] = useState('');
        const [GetCourseGrade , setGetCourseGrade] = useState(0)

    const class_create_form = useForm<z.infer<typeof Class_Create_Schema>>({
        resolver: zodResolver(Class_Create_Schema),
        defaultValues:{
            freq:"",
            byweekday:"",
            title:"",
            allDay: false,
            class_start_time: "",
            class_end_time: "",
            class_time_h : 0,
            classroom : "",
            class_lesson: "",
            class_course_id: CourseId,
            attend_number: 0,
            persons: 0,
            node : 0,
            teacher: "",
            grade:0,

            cram : "",
            class_date:[],
            classes:[],
        }
    })

    //------------- setup class_time_h  --------------
    const parseTime = (timeString) => {
        if(!timeString || timeString.lenght !== 4) {
            console.error("Invalid timeString", timeString);
            return NaN;
        }
    //時間轉換為可運算的格式
        const hours = parseInt(timeString.slice(0, 2),10);
        const minutes = parseInt(timeString.slice(2, 4),10);
        console.log("hours : ",hours);
        console.log("minutes : ", minutes);

        if(isNaN(hours) || isNaN(minutes) ) {
            console.error("Failed to parse timeString" , timeString);
            return NaN;
        }

        return hours * 60 + minutes;
    }
    //設定全日及 完結時間與開始時間相減的結果
    const allDay = class_create_form.watch('allDay');
    const startTime = class_create_form.watch('class_start_time');
    const endTime = class_create_form.watch('class_end_time');


    useEffect(() => {
        if(allDay) {
            class_create_form.setValue('class_start_time','');
            class_create_form.setValue('class_end_time','');
            class_create_form.setValue('class_time_h',24);
        }
        else{
        if (startTime && endTime) {

            const startWithoutSpaces = startTime.replace(/\s+/g,'');
            const endWithoutSpaces = endTime.replace(/\s+/g,'');

            const parseTime = (timeString) => {
                const hours = parseInt(timeString.slice(0,2), 10);
                const minutes = parseInt(timeString.slice(2,4),10);
                return hours * 60 + minutes
            }

            const startMinutes = parseTime(startWithoutSpaces);
            const endMinutes = parseTime(endWithoutSpaces);
            const diffMintes = endMinutes - startMinutes;


            const diff = diffMintes/60;
            setcountvalue(diff)
            // console.log(" start： |",startWithoutSpaces ,"type: ",typeof(startWithoutSpaces))
            // console.log(" end： |",endWithoutSpaces , "type : ", typeof(endWithoutSpaces))
            // console.log(" 運算： ",diff , "type : " ,typeof(diff))
            if(diff <= 0) {
                class_create_form.setValue('class_time_h',0);
                console.log('結束時間必須大於開始時間')
            } else {
                class_create_form.setValue('class_time_h', diff)

            }
}
        


        }

    },[startTime , endTime])


//------------------------END---------------------------------

// -------------------把Course值放進class field ---------------------------
    useEffect(()=>{
        if(GetCourseData && GetCourseData[0] && GetCourseData[0].persons){
            setGetClassPersons(GetCourseData[0].persons);
            class_create_form.setValue("persons", GetCourseData[0].persons);
        }
        if(GetCourseData && GetCourseData[0] && GetCourseData[0].persons){
            setGetClassNode(GetCourseData[0].persons);
            class_create_form.setValue("node", GetCourseData[0].persons);
        }
        if(GetCourseData && GetCourseData[0] && GetCourseData[0].teacher){
            setGetCourseTeacher(GetCourseData[0].teacher);
            class_create_form.setValue("teacher", GetCourseData[0].teacher);
        }
        if(GetCourseData && GetCourseData[0] && GetCourseData[0].grade){
            setGetCourseGrade(GetCourseData[0].grade);
            class_create_form.setValue("grade", GetCourseData[0].grade);
        }


    },[GetCourseData])
    

   
    // console.log("freq : ",freqValue);
    // console.log("byweekday : ", byweekdayValue.join(','))
        class_create_form.setValue('freq',freqValue);
        class_create_form.setValue('byweekday',byweekdayValue.join(','));
  

//-----------------------END-------------------------------------------

// console.log("CourseData : ", GetCourseData)

//----------------------------交給server side-------------------------
    const class_create_form_onSubmit = (values : z.infer<typeof Class_Create_Schema>) => {

        console.log("-- create class_class_date -- : ", values,"-- End --")
        startTransition(() => {
            createClass(values)
        })

    }

    

//-----------------------END-------------------------------------------
  

//---------------------把所選的月歷日子放進field---------------------
    const handleChange = (newvalues) => {
      const dateArray = newvalues.map(date => new Date(date)); // 確保是有效的日期對象
      setSelectedDates(dateArray);
      class_create_form.setValue("class_date", dateArray); // 更新class_date字段
      console.log(dateArray);
    }

//-----------------------END-------------------------------------------
    //獲得星期
    const getDayOfWeek = (date) => {
        const dayOfWeek = ['(日)','(一)','(二)','(三)','(四)','(五)','(六)']
        return dayOfWeek[date.getDay()]
    }
//處理 byweekday 

    return(
        <>
            <span>
            <>
       <br /> 



<Form {...class_create_form} >
    <form 
    onSubmit={class_create_form.handleSubmit(class_create_form_onSubmit)}
    className="space-y-6"
    >




<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="freq"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 選擇模式 </FormLabel>
        <FormControl>
            <div>
            <Checkbox id="freq_mod_day" 
            checked={freqValue === 'daily'}
            onCheckedChange={() => handleFreqChange('daily')}
            />
            <label> 每日 </label>
            <Checkbox id="freq_mod_week"  
               checked={freqValue === 'weekly'}
               onCheckedChange={() => handleFreqChange('weekly')} 
            />
            <label> 每週 </label>   
            <Checkbox id="freq_mod_custom"  
               checked={freqValue === ''}
               onCheckedChange={() => handleFreqChange('')} 
            />
            <label> 自定 </label>   
            </div>

        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 




       <br /> 
{/* freqValue 空白為自定日子 */}
{freqValue === '' && (
   
   <DatePicker 
     multiple
     plugins={[
       <DatePanel />
     ]}
     numberOfMonths={3}
     showOtherDays
     value={selectedDates}
     onChange={
       handleChange
     }
   />  
   )}


{freqValue === '' && (


<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="class_date"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 日期 </FormLabel>
        <FormControl>
            <Input
      {...field}
    typeof="text" 
    value={selectedDates.map(date => {
        // 将日期格式化为 dd-mm-yy 格式
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear() % 100; // 获取年份的后两位
        return `${year}-${month}-${day}`;
      }).join(', ')}
      readOnly
     
    >
    </Input>
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 
)}

{selectedDates.map((d , index)=>{
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear() % 100; // 获取年份的后两位
        const dayOfWeek = getDayOfWeek(d);// 獲取星期幾
    
    if(freqValue === ""){
    return(
        
        <>

        <div key={index}>
        <br />
            日期:{`${year}-${month}-${day}`} {dayOfWeek}
        <br />


        <div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name={`classes[${index}].allDay`}
        render={({ field }) => (
    <FormItem>
        <FormLabel> 是否全日 </FormLabel>
        <FormControl>
            <Switch  
                checked={field.value}
                onCheckedChange={field.onChange}
            />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 

<div className="space-y-4" >
    <FormField
        control={class_create_form.control}
        name={`classes[${index}].title`}
        render={({ field }) => (
    <FormItem>
        <FormLabel> 標題 </FormLabel>
        <FormControl>
            <Input 
            {...field}
            placeholder="標題"
            type="text"
            value={`${year}-${month}-${day} ${dayOfWeek}`}
            />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 

        <div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name={`classes[${index}].class_start_time`}
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂開始時間 </FormLabel>
        <FormControl>
            <SWR_Class_Time  field={field} /> 
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 


<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name={`classes[${index}].class_end_time`}
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂完結時間 </FormLabel>
        <FormControl>
            <SWR_Class_Time  field={field} /> 
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 

<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name={`classes[${index}].class_time_h`}
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂時數 </FormLabel>
        <FormControl>
        <Input 
                {...field}
                disabled={isPending}
                placeholder={countvalue}
                type="number"
                defaultValue={countvalue}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                readOnly
                />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 

-----------------------------分開線----------------------------------

<div className="space-y-4">
                <FormField
                    control={class_create_form.control}
                    name={`classes[${index}].grade`}
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 年級 </FormLabel>
                    <FormControl>
                        <SWR_School_Grade  field={field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
            </div> 


<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name={`classes[${index}].classroom`}
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂課室 </FormLabel>
        <FormControl>
            <SWR_Class_Room  field={field} />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 



<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name={`classes[${index}].class_lesson`}
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂節數 </FormLabel>
        <FormControl>
            <SWR_Class_Lesson  field={field} />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 


<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="class_course_id"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課程ID </FormLabel>
        <FormControl>
            <Input 
                {...field}
                disabled
                placeholder="輸入課程ID"
                type="text"
                />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 


<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="attend_number"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 出席人數 </FormLabel>
        <FormControl>
            <Input 
                {...field}
                disabled
                placeholder="出席人數"
                type="number"
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 

{GetCourseData.map((d:any)=>{
    return(
    <>
    <div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="persons"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂人數 </FormLabel>
        <FormControl>
        <Input 
                {...field}
                disabled={isPending}
                placeholder="課堂人數"
                type="number"
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                defaultValue={d.persons}
                />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 


<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="node"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 筆記數量 </FormLabel>
        <FormControl>
            <Input 
                {...field}
                disabled={isPending}
                placeholder="出席人數"
                type="number"
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                defaultValue={d.persons}
                />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 

<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name={`classes[${index}].teacher`}
        render={({ field }) => (
    <FormItem>
        <FormLabel> 現教 老師  :{d.teacher}</FormLabel>
        <FormControl>
            <Select defaultValue={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                    <SelectValue placeholder="選擇老師"/>
                        </SelectTrigger>
                            <SelectContent>
                            {GetTeacherData.map((data:any)=>{
                                if( data.role === "TEACHER" )
                                    {
                                        return(
                                            <>
                                                <SelectItem value={data.username} key={data.id} >
                                                    名：{data.username}
                                                </SelectItem>
                                            </>
                                        )
                                    }
                            })}
                </SelectContent>
            </Select>
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 
    </>
    
)

})}
</div>
        </>
    )}
}) } 



{/* <div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="cram"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂地點 </FormLabel>
        <FormControl>

        </FormControl>
    </FormItem>
        )}
    />
</div>  */}



{freqValue === 'weekly' && (
    <>
       
     <div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="byweekday"
        render={() => (
            <FormItem>
                <FormLabel> 選擇星期 </FormLabel>
                {WeekDatas.map((item)=>(
                    <FormField
                        key={item.id}
                        control={class_create_form.control}
                        name='byweekday'
                        render={
                            ({field}) => {
                                return(
                                    <FormItem
                                    key={item.id}
                                    >
                                        <FormControl>
                                            <Checkbox
                                                checked={byweekdayValue.includes(item.id)}
                                                onCheckedChange={(checked)=>{
                                                    handleByweekdayChange(checked , item.id)
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal" >
                                            {item.label}
                                        </FormLabel>
                                    </FormItem>
                                )
                            }
                        }
                    />
                ))}
            </FormItem>
        )}
    />
</div> 
<div className="space-y-4" >
    <FormField
        control={class_create_form.control}
        name="title"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 標題 </FormLabel>
        <FormControl>
            <Input 
            {...field}
            placeholder="標題"
            type="text"
            />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 
<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="class_start_time"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂開始時間 </FormLabel>
        <FormControl>
            <SWR_Class_Time  field={field} /> 
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 


<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="class_end_time"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂完結時間 </FormLabel>
        <FormControl>
            <SWR_Class_Time  field={field} /> 
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 

<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="class_time_h"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂時數 </FormLabel>
        <FormControl>
        <Input 
                {...field}
                disabled={isPending}
                placeholder={countvalue}
                type="number"
                defaultValue={countvalue}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                readOnly
                />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 
<div className="space-y-4">
                <FormField
                    control={class_create_form.control}
                    name="grade"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 年級 </FormLabel>
                    <FormControl>
                        <SWR_School_Grade  field={field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
            </div> 
        

<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="classroom"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂課室 </FormLabel>
        <FormControl>
            <SWR_Class_Room  field={field} />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 



<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="class_lesson"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂節數 </FormLabel>
        <FormControl>
            <SWR_Class_Lesson  field={field} />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 


<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="class_course_id"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課程ID </FormLabel>
        <FormControl>
            <Input 
                {...field}
                disabled
                placeholder="輸入課程ID"
                type="text"
                />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 


<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="attend_number"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 出席人數 </FormLabel>
        <FormControl>
            <Input 
                {...field}
                disabled
                placeholder="出席人數"
                type="number"
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 

{GetCourseData.map((d)=>{
    return(
    <>
    <div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="persons"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂人數 </FormLabel>
        <FormControl>
        <Input 
                {...field}
                disabled={isPending}
                placeholder="課堂人數"
                type="number"
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                defaultValue={d.persons}
                />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 


<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="node"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 筆記數量 </FormLabel>
        <FormControl>
            <Input 
                {...field}
                disabled={isPending}
                placeholder="出席人數"
                type="number"
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                defaultValue={d.persons}
                />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 





<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="teacher"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 現教 老師  :{d.teacher}</FormLabel>
        <FormControl>
            <Select defaultValue={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                    <SelectValue placeholder="選擇老師"/>
                        </SelectTrigger>
                            <SelectContent>
                            {GetTeacherData.map((data)=>{
                                if( data.role === "TEACHER" )
                                    {
                                        return(
                                            <>
                                                <SelectItem value={data.username} key={data.id} >
                                                    名：{data.username}
                                                </SelectItem>
                                            </>
                                        )
                                    }
                            })}
                </SelectContent>
            </Select>
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 



    </>
    
)

})}
    
</>


)} 



{freqValue === 'daily' && (
    <>

<div className="space-y-4" >
    <FormField
        control={class_create_form.control}
        name="byweekday"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 選擇星期  </FormLabel>
        <FormControl>
            <Input 
            {...field}
            placeholder="不用選"
            type="text"
            />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 



<div className="space-y-4" >
    <FormField
        control={class_create_form.control}
        name="title"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 標題 </FormLabel>
        <FormControl>
            <Input 
            {...field}
            placeholder="標題"
            type="text"
            />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 


<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="allDay"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 是否全日 </FormLabel>
        <FormControl>
            <Switch  
                checked={field.value}
                onCheckedChange={field.onChange}
            />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 



    <div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="class_start_time"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂開始時間 </FormLabel>
        <FormControl>
            <SWR_Class_Time  field={field} /> 
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 


<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="class_end_time"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂完結時間 </FormLabel>
        <FormControl>
            <SWR_Class_Time  field={field} /> 
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 

<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="class_time_h"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂時數 </FormLabel>
        <FormControl>
        <Input 
                {...field}
                disabled={isPending}
                placeholder={countvalue}
                type="number"
                defaultValue={countvalue}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                readOnly
                />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 

<div className="space-y-4">
                <FormField
                    control={class_create_form.control}
                    name="grade"
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 年級 </FormLabel>
                    <FormControl>
                        <SWR_School_Grade  field={field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
            </div> 

<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="classroom"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂課室 </FormLabel>
        <FormControl>
            <SWR_Class_Room  field={field} />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 

<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="class_lesson"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂節數 </FormLabel>
        <FormControl>
            <SWR_Class_Lesson  field={field} />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 
<div className="space-y-4" hidden>
    <FormField
        control={class_create_form.control}
        name="class_course_id"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課程ID </FormLabel>
        <FormControl>
            <Input 
                {...field}
                disabled
                placeholder="輸入課程ID"
                type="text"
                />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 

<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="attend_number"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 出席人數 </FormLabel>
        <FormControl>
            <Input 
                {...field}
                disabled
                placeholder="出席人數"
                type="number"
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 

{GetCourseData.map((d)=>{
    return(
    <>
    <div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="persons"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂人數 </FormLabel>
        <FormControl>
        <Input 
                {...field}
                disabled={isPending}
                placeholder="課堂人數"
                type="number"
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                defaultValue={d.persons}
                />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 

<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="node"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 筆記數量 </FormLabel>
        <FormControl>
            <Input 
                {...field}
                disabled={isPending}
                placeholder="出席人數"
                type="number"
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                defaultValue={d.persons}
                />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 

<div className="space-y-4">
    <FormField
        control={class_create_form.control}
        name="teacher"
        render={({ field }) => (
    <FormItem>
        <FormLabel> 現教 老師  :{d.teacher}</FormLabel>
        <FormControl>
            <Select defaultValue={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                    <SelectValue placeholder="選擇老師"/>
                        </SelectTrigger>
                            <SelectContent>
                            {GetTeacherData.map((data)=>{
                                if( data.role === "TEACHER" )
                                    {
                                        return(
                                            <>
                                                <SelectItem value={data.username} key={data.id} >
                                                    名：{data.username}
                                                </SelectItem>
                                            </>
                                        )
                                    }
                            })}
                </SelectContent>
            </Select>
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 
    </>    
)
})} 




</>

) } 








<Button disabled={isPending} type="submit">
        建立
</Button>


    </form>

</Form>
</>
                
                
            </span>
        </>
    )
}

export default Class_Create_Form