"use client"

import React, { useState, useEffect, useTransition } from "react";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-multi-date-picker";
import { timetemplate_create_Schema } from "@/actions/Create-TimeTemplate/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useSWR from "swr";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { SWR_Class_Lesson } from "../fatchdata/swrclass_lesson";
import { SWR_Class_Time } from "../fatchdata/swrclass_tiime";
import { createtimetemplate } from "@/actions/Create-TimeTemplate";



// 輔助函數：檢查日期是否有效並格式化
const formatDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
};

const TimeTemplate_Create_Form = () => {
    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data } = useSWR('http://127.0.0.1:8000/api/course_data/courselessons/', fetcher);
    const [isPending, startTransition] = useTransition();
    const [selectedDays, setSelectedDays] = useState([]);
    const [dayStart, setDayStart] = useState('');
    const [dayEnd, setDayEnd] = useState('');
    const [selectedWeekdays, setSelectedWeekdays] = useState({});
    const [GetPublicHolidays, setGetPublicHolidays] = useState([]);
    const [isLoadingHolidays, setIsLoadingHolidays] = useState(true);

    const timetemplate_create_form = useForm<z.infer<typeof timetemplate_create_Schema>>({
        resolver: zodResolver(timetemplate_create_Schema),
        defaultValues: {
            title: "",
            day_start: "",
            day_end: "",
            publicholiday: [],
            weekdays: [],
            days: [],
            start_time: "",
            end_time: "",
            grade: 0,
            lesson: ""
        }
    });

    useEffect(() => {
        const fetchpublicholidaysData = async () => {
            try {
                setIsLoadingHolidays(true);
                const res = await fetch('/api/PublicHoliday_Lists');
                if (!res.ok) {
                    throw new Error("無法獲取公眾假期數據！");
                }
                const result = await res.json();
                console.log("Raw API response:", result);
                const holidays = Array.isArray(result) ? result : [];
                setGetPublicHolidays(holidays);
            } catch (error) {
                console.error("獲取公眾假期失敗:", error);
                setGetPublicHolidays([]);
            } finally {
                setIsLoadingHolidays(false);
            }
        };
        fetchpublicholidaysData();
    }, []);

    useEffect(() => {
        // 從 GetPublicHolidays[0].publicholiday 提取日期陣列
        const holidaysArray = Array.isArray(GetPublicHolidays) && GetPublicHolidays.length > 0 && GetPublicHolidays[0].publicholiday 
            ? GetPublicHolidays[0].publicholiday 
            : [];
        console.log("holidaysArray before mapping:", holidaysArray);
        const PublicHolidays = holidaysArray
            .map((date) => formatDate(date))
            .filter((date) => date !== null);
        console.log("Formatted PublicHolidays:", PublicHolidays);
        timetemplate_create_form.setValue("publicholiday", PublicHolidays);
    }, [GetPublicHolidays, timetemplate_create_form]);

    const watchedStartTime = timetemplate_create_form.watch('start_time');
    const watchedEndTime = timetemplate_create_form.watch('end_time');

    useEffect(() => {
        if (dayStart && dayEnd && data && Object.values(selectedWeekdays).some(Boolean)) {
            const startDate = new Date(dayStart);
            const endDate = new Date(dayEnd);
            const weekdays = [];
            const currentDate = new Date(startDate);
            let courseIndex = 0;

            while (currentDate <= endDate) {
                const dayOfWeek = currentDate.getDay();
                if (selectedWeekdays[dayOfWeek + 1]) {
                    const course = data[courseIndex % data.length];
                    weekdays.push({
                        date: currentDate.toISOString().split('T')[0],
                        start_time: timetemplate_create_form.getValues('start_time') || "",
                        end_time: timetemplate_create_form.getValues('end_time') || "",
                        lesson: course ? course.course_lesson : ""
                    });
                    courseIndex++;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }

            timetemplate_create_form.setValue('weekdays', weekdays.sort((a, b) => new Date(a.date) - new Date(b.date)));
        } else {
            timetemplate_create_form.setValue('weekdays', []);
        }
    }, [dayStart, dayEnd, selectedWeekdays, data, watchedStartTime, watchedEndTime, timetemplate_create_form]);

    useEffect(() => {
        if (selectedDays.length > 0) {
            const days = selectedDays.map(day => ({
                date: day.format("YYYY-MM-DD"),
                start_time: "",
                end_time: "",
                lesson: ""
            }));
            timetemplate_create_form.setValue('days', days);
        } else {
            timetemplate_create_form.setValue('days', []);
        }
    }, [selectedDays, timetemplate_create_form]);

    const timetemplate_create_form_onSubmit = (values: z.infer<typeof timetemplate_create_Schema>) => {
        console.log("-- create timetemplate -- : ", values, "-- End --");
        startTransition(()=>{
            createtimetemplate(values)
        })
    };

    const handleWeekdayChange = (dayIndex, checked) => {
        setSelectedWeekdays(prev => ({ ...prev, [dayIndex]: checked }));
    };

    const isDateRangeSelected = dayStart && dayEnd;
    const isWeekdaySelected = Object.values(selectedWeekdays).some(Boolean);

    const updateDayField = (index, fieldName, value) => {
        const currentDays = timetemplate_create_form.getValues('days');
        const updatedDays = [...currentDays];
        updatedDays[index] = { ...updatedDays[index], [fieldName]: value };
        timetemplate_create_form.setValue('days', updatedDays);
    };

    console.log("bug : ", timetemplate_create_form.formState.errors, "--End--");

    return (
        <>
            <br />
            <Form {...timetemplate_create_form}>
                <form onSubmit={timetemplate_create_form.handleSubmit(timetemplate_create_form_onSubmit)} className="space-y-4">
                    {/* Day Start */}
                    <FormField
                        control={timetemplate_create_form.control}
                        name="day_start"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>開始日子</FormLabel>
                                <FormControl>
                                    <Controller
                                        name="day_start"
                                        control={timetemplate_create_form.control}
                                        render={({ field: { onChange, value } }) => (
                                            <DatePicker
                                                value={value ? new Date(value) : null}
                                                format="YYYY-MM-DD"
                                                onChange={(date) => {
                                                    const isoDate = date ? date.format("YYYY-MM-DD") : "";
                                                    onChange(isoDate);
                                                    setDayStart(isoDate);
                                                }}
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Day End */}
                    <FormField
                        control={timetemplate_create_form.control}
                        name="day_end"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>完結日子</FormLabel>
                                <FormControl>
                                    <Controller
                                        name="day_end"
                                        control={timetemplate_create_form.control}
                                        render={({ field: { onChange, value } }) => (
                                            <DatePicker
                                                value={value ? new Date(value) : null}
                                                format="YYYY-MM-DD"
                                                onChange={(date) => {
                                                    const isoDate = date ? date.format("YYYY-MM-DD") : "";
                                                    onChange(isoDate);
                                                    setDayEnd(isoDate);
                                                }}
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Public Holidays */}
                    <div>
                        公眾假期：
                        {isLoadingHolidays ? (
                            <span>載入中...</span>
                        ) : Array.isArray(GetPublicHolidays) && GetPublicHolidays.length > 0 && GetPublicHolidays[0].publicholiday ? (
                            GetPublicHolidays[0].publicholiday.map((date, index) => {
                                const formattedDate = formatDate(date);
                                return formattedDate ? (
                                    <span key={index}>{formattedDate} </span>
                                ) : null;
                            })
                        ) : (
                            <span>無公眾假期數據</span>
                        )}
                    </div>

                    {/* Title */}
                    <FormField
                        control={timetemplate_create_form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>標題</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} placeholder="標題" type="text" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Grade */}
                    <FormField
                        control={timetemplate_create_form.control}
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

                    {/* Weekdays */}
                    <FormField
                        control={timetemplate_create_form.control}
                        name="weekdays"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>選週日子</FormLabel>
                                <FormControl>
                                    <div>
                                        {isDateRangeSelected ? (
                                            <>
                                                {["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"].map((day, index) => (
                                                    <div key={index}>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedWeekdays[index + 1] || false}
                                                                onChange={(e) => handleWeekdayChange(index + 1, e.target.checked)}
                                                                disabled={!isDateRangeSelected}
                                                            />
                                                            {day}
                                                        </label>
                                                    </div>
                                                ))}
                                                {isWeekdaySelected && (
                                                    <div className="mt-4 space-y-2">
                                                        <div>
                                                            <FormLabel>開始時間</FormLabel>
                                                            <SWR_Class_Time
                                                                field={{
                                                                    value: timetemplate_create_form.getValues('start_time') || "",
                                                                    onChange: (value) => timetemplate_create_form.setValue('start_time', value)
                                                                }}
                                                                disabled={!isDateRangeSelected}
                                                            />
                                                        </div>
                                                        <div>
                                                            <FormLabel>完結時間</FormLabel>
                                                            <SWR_Class_Time
                                                                field={{
                                                                    value: timetemplate_create_form.getValues('end_time') || "",
                                                                    onChange: (value) => timetemplate_create_form.setValue('end_time', value)
                                                                }}
                                                                disabled={!isDateRangeSelected}
                                                            />
                                                        </div>
                                                        <div>
                                                            <FormLabel>課程</FormLabel>
                                                            <p>課程將根據後端數據自動分配</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <p>請先選擇開始和完結日子</p>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Days */}
                    <FormField
                        control={timetemplate_create_form.control}
                        name="days"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>選日子</FormLabel>
                                <FormControl>
                                    <div>
                                        <Controller
                                            name="days"
                                            control={timetemplate_create_form.control}
                                            render={({ field: { onChange, value } }) => (
                                                <DatePicker
                                                    multiple
                                                    value={value ? value.map(day => new Date(day.date)) : []}
                                                    minDate={dayStart ? new Date(dayStart) : null}
                                                    maxDate={dayEnd ? new Date(dayEnd) : null}
                                                    onChange={(dates) => {
                                                        setSelectedDays(dates);
                                                        const formattedDays = dates.map(date => ({
                                                            date: date.format("YYYY-MM-DD"),
                                                            start_time: "",
                                                            end_time: "",
                                                            lesson: ""
                                                        }));
                                                        onChange(formattedDays);
                                                    }}
                                                    format="YYYY-MM-DD"
                                                    disabled={!isDateRangeSelected}
                                                />
                                            )}
                                        />
                                        {selectedDays.length > 0 && (
                                            <ul className="space-y-4 mt-2">
                                                {selectedDays.map((day, index) => (
                                                    <li key={index} className="border p-2 rounded">
                                                        <div><strong>日期:</strong> {day.format("YYYY-MM-DD")}</div>
                                                        <div className="flex space-x-2 mt-1">
                                                            <div>
                                                                <label>開始時間:</label>
                                                                <SWR_Class_Time
                                                                    field={{
                                                                        value: field.value[index]?.start_time || "",
                                                                        onChange: (value) => updateDayField(index, 'start_time', value)
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>完結時間:</label>
                                                                <SWR_Class_Time
                                                                    field={{
                                                                        value: field.value[index]?.end_time || "",
                                                                        onChange: (value) => updateDayField(index, 'end_time', value)
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>課程:</label>
                                                                <SWR_Class_Lesson
                                                                    field={{
                                                                        value: field.value[index]?.lesson || "",
                                                                        onChange: (value) => updateDayField(index, 'lesson', value)
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Hidden Start Time */}
                    <FormField
                        control={timetemplate_create_form.control}
                        name="start_time"
                        render={({ field }) => (
                            <FormItem className="hidden">
                                <FormLabel>開始時間</FormLabel>
                                <FormControl>
                                    <SWR_Class_Time field={field} disabled={!isDateRangeSelected} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Hidden End Time */}
                    <FormField
                        control={timetemplate_create_form.control}
                        name="end_time"
                        render={({ field }) => (
                            <FormItem className="hidden">
                                <FormLabel>完結時間</FormLabel>
                                <FormControl>
                                    <SWR_Class_Time field={field} disabled={!isDateRangeSelected} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Hidden Lesson */}
                    <FormField
                        control={timetemplate_create_form.control}
                        name="lesson"
                        render={({ field }) => (
                            <FormItem className="hidden">
                                <FormLabel>課程</FormLabel>
                                <FormControl>
                                    <SWR_Class_Lesson field={field} disabled={!isDateRangeSelected} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={!isDateRangeSelected}>提交</Button>
                </form>
            </Form>
        </>
    );
};

export default TimeTemplate_Create_Form;