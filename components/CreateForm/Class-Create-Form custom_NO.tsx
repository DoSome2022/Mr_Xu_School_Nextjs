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

const Class_Create_Custom_Form_v1 = () => {
    const [ isPending , startTransition ] = useTransition();
    const params = useParams();
    const CourseId = params?.coursedetailbyID as string;// 獲取URL中的CourseId參數
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [ countvalue , setcountvalue ] = useState<Number>(0);

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
    //拿Course data
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
    const [GetCourseGrade , setGetCourseGrade] = useState(0);
    const [GetClassTitle , setGetClassTitle] = useState('');
   

    const class_create_custom_form = useForm<z.infer<typeof Class_Create_Schema>>({
        resolver: zodResolver(Class_Create_Schema),
        defaultValues:{
            freq:"",
            title: GetClassTitle || "",
            byweekday:"",
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
            // classes:[],
        }
    })

const class_create_custom_form_onSubmit = (values) => {
    // const datas = selectedDates.forEach((data)=>({
    //     ...values,
    //     class_date:[data]
    // }))
    // console.log(datas)
    startTransition(() => {
        createClass(values);
    })

    console.log("-- create class_custom_date -- : ", values,"-- End --")
}

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
    const allDay = class_create_custom_form.watch('allDay');
    const startTime = class_create_custom_form.watch('class_start_time');
    const endTime = class_create_custom_form.watch('class_end_time');


    useEffect(() => {
        if(allDay) {
            class_create_custom_form.setValue('class_start_time','');
            class_create_custom_form.setValue('class_end_time','');
            class_create_custom_form.setValue('class_time_h',24);
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
                class_create_custom_form.setValue('class_time_h',0);
                console.log('結束時間必須大於開始時間')
            } else {
                class_create_custom_form.setValue('class_time_h', diff)

            }
}
        


        }

    },[startTime , endTime])


//------------------------END---------------------------------


//---------------------把所選的月歷日子放進field---------------------
const handleChange = (newvalues) => {
    const dateArray = newvalues.map(date => new Date(date)); // 確保是有效的日期對象
    setSelectedDates(dateArray);
    class_create_custom_form.setValue(`class_date`, dateArray); // 更新class_date字段
    console.log(dateArray);
   

}

//-----------------------END-------------------------------------------

    //獲得星期
    const getDayOfWeek = (date) => {
        const dayOfWeek = ['(日)','(一)','(二)','(三)','(四)','(五)','(六)']
        return dayOfWeek[date.getDay()]
    }

        useEffect(()=>{
            if(GetCourseData && GetCourseData[0] && GetCourseData[0].persons){
                setGetClassPersons(GetCourseData[0].persons);
                class_create_custom_form.setValue("persons", GetCourseData[0].persons);
            }
            if(GetCourseData && GetCourseData[0] && GetCourseData[0].persons){
                setGetClassNode(GetCourseData[0].persons);
                class_create_custom_form.setValue("node", GetCourseData[0].persons);
            }
            if(GetCourseData && GetCourseData[0] && GetCourseData[0].teacher){
                setGetCourseTeacher(GetCourseData[0].teacher);
                class_create_custom_form.setValue("teacher", GetCourseData[0].teacher);
            }
            if(GetCourseData && GetCourseData[0] && GetCourseData[0].grade){
                setGetCourseGrade(GetCourseData[0].grade);
                class_create_custom_form.setValue("grade", GetCourseData[0].grade);
            }
            if(GetCourseData && selectedDates ){
                selectedDates.forEach((selected_d , index)=>{
                const day = String(selected_d.getDate()).padStart(2, '0');
                const month = String(selected_d.getMonth() + 1).padStart(2, '0');
                const year = selected_d.getFullYear() % 100; 
                const dayOfWeek = getDayOfWeek(selected_d);
                GetCourseData.map((course_d)=>{
                const titleText = `${year}-${month}-${day} ${dayOfWeek}${course_d.course_subject}${course_d.grade}年級`
                class_create_custom_form.setValue('title',GetClassTitle)
                setGetClassTitle(titleText)
                
                console.log('titleText : ', titleText )
            })
                // class_create_custom_form.setValue('class_date',selected_d)
            })    
            }
            class_create_custom_form.setValue('freq',"");
            class_create_custom_form.setValue('byweekday',"");
    
    
        },[GetCourseData, selectedDates])
console.log(GetClassTitle)
console.log("getvalues_title : ",class_create_custom_form.getValues('title'))
console.log("getvalues_class_date : ",class_create_custom_form.getValues('class_date'))
    return(
        <>

        <Form  {...class_create_custom_form}>
            <form 
                onSubmit={class_create_custom_form.handleSubmit(class_create_custom_form_onSubmit)}
                className="space-y-6"
            >
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

                    <div className="space-y-4">
                        <FormField
                            control={class_create_custom_form.control}
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
                                    readOnly>
                                </Input>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                            )}
                        />
                    </div> 
{GetCourseData.map((data_course)=>{

return(
    <>

{selectedDates.map((data_select, index) => {
            const day = String(data_select.getDate()).padStart(2, '0');
            const month = String(data_select.getMonth() + 1).padStart(2, '0');
            const year = data_select.getFullYear() % 100; // 获取年份的后两位
            const dayOfWeek = getDayOfWeek(data_select);// 獲取星期幾
         <div>
           日期:{`${year}-${month}-${day}`} {dayOfWeek} 
        </div>
})}

    {/* return(
        <> */}



        <div className="space-y-4"
        hidden
        >
    <FormField
        control={class_create_custom_form.control}
        name={`allDay`}
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
         <div className="space-y-4"
         hidden
         >
                    <FormField
                        control={class_create_custom_form.control}
                        name='freq'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Freq</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-4"
                    hidden
                >
                    <FormField
                        control={class_create_custom_form.control}
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
                <div className="space-y-4"
                hidden
                >
                    <FormField
                        control={class_create_custom_form.control}
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
                <div className="space-y-4" >
                <FormField
                    control={class_create_custom_form.control}
                    name='title'
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 標題 </FormLabel>
                    <FormControl>
                        <Input 
                        {...field}
                        placeholder={GetClassTitle}
                        type="text"
                        value={field.value || GetClassTitle}
                        onChange={(e) => field.onChange(e.target.value)}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
            </div> 
            <div className="space-y-4">
    <FormField
        control={class_create_custom_form.control}
        name={`class_start_time`}
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
        control={class_create_custom_form.control}
        name={`class_end_time`}
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
        control={class_create_custom_form.control}
        name={`class_time_h`}
        render={({ field }) => (
    <FormItem>
        <FormLabel> 課堂時數 </FormLabel>
        <FormControl>
        <Input 
                {...field}
                disabled={isPending}
                placeholder={countvalue}
                type="number"
                value={countvalue}
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
        control={class_create_custom_form.control}
        name={`classroom`}
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
        control={class_create_custom_form.control}
        name={`class_lesson`}
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
                    control={class_create_custom_form.control}
                    name={`grade`}
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
        control={class_create_custom_form.control}
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
                value={data_course.persons}
                />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 


<div className="space-y-4">
    <FormField
        control={class_create_custom_form.control}
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
                value={data_course.persons}
                />
        </FormControl>
        <FormMessage />
    </FormItem>
        )}
    />
</div> 
                <div className="space-y-4">
                <FormField
                    control={class_create_custom_form.control}
                    name={`teacher`}
                    render={({ field }) => (
                <FormItem>
                    <FormLabel> 現教 老師  :{data_course.teacher}</FormLabel>
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

{/* selectedDates-loop-END  */}

// </>)
})}              
{/* GetCourseData-loop-END  */}


                <Button disabled={isPending} type="submit">
                    建立
                </Button>


            </form>
        </Form>
        
        </>
    )

}

export default Class_Create_Custom_Form_v1