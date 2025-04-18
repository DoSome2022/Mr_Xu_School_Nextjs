"use client"


import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useParams  } from "next/navigation";

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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Student_Create_Schema } from "@/actions/Create-Student/schema";
import { Switch } from "../ui/switch";
import { FormError } from "@/components/form-error"; 
import { FormSuccess } from "@/components/form-success";
import { Calendar } from "../ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { format, parseISO } from "date-fns";
import { create_Student} from "@/actions/Create-Student";
import DatePicker from "react-multi-date-picker";


const Student_Create_Form = () => {
    const [isPending, startTransition] = useTransition();
    const params = useParams();
    console.log("-- params -- : ", params, "-- End --");
    const parentId = params?.parentdetailbyID as string;
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    // 為了拿 school data
    const [GetSchoolsData, setGetSchoolsData] = useState([]);

    // 拿 school data
    useEffect(() => {
        const fetchSchoolsData = async () => {
            const res = await fetch("/api/School_Lists");
            if (!res) {
                throw new Error("斷線！");
            }
            const result = await res.json();
            setGetSchoolsData(result);
        };
        fetchSchoolsData();
    }, []);

    const student_register_form = useForm<z.infer<typeof Student_Create_Schema>>({
        resolver: zodResolver(Student_Create_Schema),
        defaultValues: {
            name: "",
            school: "",
            grade: 0,
            student_id: "",
            chine_ex_day: "",
            math_ex_day: "",
            eng_ex_day: "",
            teachers: "",
            pay: false,
            student_parent_data_id: "",
            student_class_id: "",
            student_teacher_data_id: "",
        },
    });

    // 設置 student_parent_data_id
    useEffect(() => {
        student_register_form.setValue("student_parent_data_id", parentId);
    }, [parentId, student_register_form]);

    const student_register_form_onSubmit = (values: z.infer<typeof Student_Create_Schema>) => {
        console.log("-- student register輸入 -- : ", values, "-- End --");
        setError("");
        setSuccess("");

        startTransition(() => {
            create_Student(values).then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            });
        });
    };

    return (
        <Form {...student_register_form}>
            <form
                onSubmit={student_register_form.handleSubmit(student_register_form_onSubmit)}
                className="space-y-6"
            >
                <div className="space-y-4">
                    <FormField
                        control={student_register_form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>姓名</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder="輸入姓名"
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
                        control={student_register_form.control}
                        name="school"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>學校</FormLabel>
                                <FormControl>
                                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="選擇學校" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {GetSchoolsData.map((school: any) => (
                                                <SelectItem value={school.school_name} key={school.id}>
                                                    {school.school_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <FormField
                        control={student_register_form.control}
                        name="grade"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>年級</FormLabel>
                                <FormControl>
                                    <SWR_School_Grade field={field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* 中文考試時間 */}
                <div className="space-y-4">
                    <FormField
                        control={student_register_form.control}
                        name="chine_ex_day"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>中文考試時間</FormLabel>
                                <FormControl>
                                    <Controller
                                        name="chine_ex_day"
                                        control={student_register_form.control}
                                        render={({ field: { onChange, value } }) => (
                                            <DatePicker
                                                value={value || ""} // 直接使用字符串
                                                onChange={(date) => {
                                                    // date 是 DateObject 或 null
                                                    const formattedDate = date
                                                        ? date.format("YYYY-MM-DD")
                                                        : "";
                                                    onChange(formattedDate);
                                                }}
                                                format="YYYY-MM-DD"
                                                placeholder="選擇日期"
                                                inputClass="w-full p-2 border rounded"
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* 數學考試時間 */}
                <div className="space-y-4">
                    <FormField
                        control={student_register_form.control}
                        name="math_ex_day"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>數學考試時間</FormLabel>
                                <FormControl>
                                    <Controller
                                        name="math_ex_day"
                                        control={student_register_form.control}
                                        render={({ field: { onChange, value } }) => (
                                            <DatePicker
                                                value={value || ""}
                                                onChange={(date) => {
                                                    const formattedDate = date
                                                        ? date.format("YYYY-MM-DD")
                                                        : "";
                                                    onChange(formattedDate);
                                                }}
                                                format="YYYY-MM-DD"
                                                placeholder="選擇日期"
                                                inputClass="w-full p-2 border rounded"
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* 英文考試時間 */}
                <div className="space-y-4">
                    <FormField
                        control={student_register_form.control}
                        name="eng_ex_day"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>英文考試時間</FormLabel>
                                <FormControl>
                                    <Controller
                                        name="eng_ex_day"
                                        control={student_register_form.control}
                                        render={({ field: { onChange, value } }) => (
                                            <DatePicker
                                                value={value || ""}
                                                onChange={(date) => {
                                                    const formattedDate = date
                                                        ? date.format("YYYY-MM-DD")
                                                        : "";
                                                    onChange(formattedDate);
                                                }}
                                                format="YYYY-MM-DD"
                                                placeholder="選擇日期"
                                                inputClass="w-full p-2 border rounded"
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <FormField
                        control={student_register_form.control}
                        name="student_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>學生ID</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="輸入一個數字"
                                        type="text"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4" hidden>
                    <FormField
                        control={student_register_form.control}
                        name="teachers"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>負責老師們</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled
                                        placeholder="輸入學校"
                                        type="text"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4" hidden>
                    <FormField
                        control={student_register_form.control}
                        name="pay"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="block w-full p-2"
                                        disabled
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button disabled={isPending} type="submit">
                    建立
                </Button>
            </form>
        </Form>
    );
};

export default Student_Create_Form;