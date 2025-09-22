"use client";

import React, { useState, useEffect, useTransition } from "react";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"; // 引入 useRouter
import DatePicker, { DateObject } from "react-multi-date-picker";
import { timetemplate_create_Schema, daySchema } from "@/actions/Create-TimeTemplate/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useSWR from "swr";
import { SWR_Class_Lesson } from "../fatchdata/swrclass_lesson";
import { SWR_Class_Time } from "../fatchdata/swrclass_tiime";
import { createtimetemplate } from "@/actions/Create-TimeTemplate";
import { toast } from "sonner";

// 定義 API 回應數據的類型
interface PublicHoliday {
  publicholiday: string[];
}

interface CourseLesson {
  course_lesson: string;
}

// 輔助函數：檢查日期是否有效並格式化
const formatDate = (dateStr: string | undefined): string | null => {
  if (!dateStr || typeof dateStr !== "string") return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0];
};

const TimeTemplate_Create_Form = () => {
  const router = useRouter(); // 初始化 useRouter
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://127.0.0.1:8000";
  const fetcher = (...args: Parameters<typeof fetch>): Promise<CourseLesson[]> =>
    fetch(...args).then((res) => res.json());
  const { data } = useSWR(`${apiUrl}/api/course_data/courselessons/`, fetcher);
  const [isPending, startTransition] = useTransition();
  const [selectedDays, setSelectedDays] = useState<DateObject[]>([]);
  const [dayStart, setDayStart] = useState("");
  const [dayEnd, setDayEnd] = useState("");
  const [selectedWeekdays, setSelectedWeekdays] = useState<Record<number, boolean>>({});
  const [GetPublicHolidays, setGetPublicHolidays] = useState<PublicHoliday[]>([]);
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(true);

  const timetemplate_create_form = useForm<z.infer<typeof timetemplate_create_Schema>>({
    resolver: zodResolver(timetemplate_create_Schema),
    defaultValues: {
      title: "",
      day_start: "",
      day_end: "",
      publicHoliday: [],
      weekdays: [],
      days: [],
      start_time: "",
      end_time: "",
      lesson: "",
    },
  });

  useEffect(() => {
    const fetchpublicholidaysData = async () => {
      try {
        setIsLoadingHolidays(true);
        const res = await fetch("/api/PublicHoliday_Lists");
        if (!res.ok) {
          throw new Error("無法獲取公眾假期數據！");
        }
        const result: PublicHoliday[] = await res.json();
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
    const holidaysArray =
      Array.isArray(GetPublicHolidays) && GetPublicHolidays.length > 0 && GetPublicHolidays[0].publicholiday
        ? GetPublicHolidays[0].publicholiday
        : [];
    console.log("holidaysArray before mapping:", holidaysArray);
    const PublicHolidays = holidaysArray
      .map((date) => formatDate(date))
      .filter((date): date is string => date !== null);
    console.log("Formatted PublicHolidays:", PublicHolidays);
    timetemplate_create_form.setValue("publicHoliday", PublicHolidays);
  }, [GetPublicHolidays, timetemplate_create_form]);

  const watchedStartTime = timetemplate_create_form.watch("start_time");
  const watchedEndTime = timetemplate_create_form.watch("end_time");

  useEffect(() => {
    if (dayStart && dayEnd && data && Object.values(selectedWeekdays).some(Boolean)) {
      const startDate = new Date(dayStart);
      const endDate = new Date(dayEnd);
      const weekdays: z.infer<typeof daySchema>[] = [];
      const currentDate = new Date(startDate);
      let courseIndex = 0;

      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (selectedWeekdays[dayOfWeek + 1]) {
          const course = data[courseIndex % data.length];
          weekdays.push({
            date: currentDate.toISOString().split("T")[0],
            start_time: timetemplate_create_form.getValues("start_time") || "",
            end_time: timetemplate_create_form.getValues("end_time") || "",
            lesson: course ? course.course_lesson : "",
          });
          courseIndex++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      timetemplate_create_form.setValue(
        "weekdays",
        weekdays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      );
    } else {
      timetemplate_create_form.setValue("weekdays", []);
    }
  }, [dayStart, dayEnd, selectedWeekdays, data, watchedStartTime, watchedEndTime, timetemplate_create_form]);

  useEffect(() => {
    if (selectedDays.length > 0) {
      const days: z.infer<typeof daySchema>[] = selectedDays.map((day: DateObject) => ({
        date: day.format("YYYY-MM-DD"),
        start_time: "",
        end_time: "",
        lesson: "",
      }));
      timetemplate_create_form.setValue("days", days);
    } else {
      timetemplate_create_form.setValue("days", []);
    }
  }, [selectedDays, timetemplate_create_form]);

  const handleWeekdayChange = (dayIndex: number, checked: boolean) => {
    setSelectedWeekdays((prev) => ({ ...prev, [dayIndex]: checked }));
  };

  const isDateRangeSelected = dayStart && dayEnd;

  const updateDayField = (index: number, fieldName: keyof z.infer<typeof daySchema>, value: string) => {
    const currentDays = timetemplate_create_form.getValues("days");
    const updatedDays = [...currentDays];
    updatedDays[index] = { ...updatedDays[index], [fieldName]: value };
    timetemplate_create_form.setValue("days", updatedDays);
  };

  const timetemplate_create_form_onSubmit = (values: z.infer<typeof timetemplate_create_Schema>) => {
    console.log("-- create timetemplate -- : ", values, "-- End --");
    startTransition(async () => {
      const result = await createtimetemplate(values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("時間表創建成功！");
        // 客戶端跳轉
        router.push("/admin/timetemplateLists");
      }
    });
  };

  console.log("bug : ", timetemplate_create_form.formState.errors, "--End--");
  console.log("GetPublicHolidays : ", GetPublicHolidays, "--End--");

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
                        value={value || ""}
                        format="YYYY-MM-DD"
                        onChange={(date: DateObject) => {
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
                        value={value || ""}
                        format="YYYY-MM-DD"
                        onChange={(date: DateObject) => {
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
              GetPublicHolidays[0].publicholiday.map((date: string, index: number) => {
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
                        {Object.values(selectedWeekdays).some(Boolean) && (
                          <div className="mt-4 space-y-2">
                            <div>
                              <FormLabel>開始時間</FormLabel>
                              <FormField
                                control={timetemplate_create_form.control}
                                name="start_time"
                                render={({ field }) => (
                                  <FormControl>
                                    <SWR_Class_Time field={field} disabled={!isDateRangeSelected} />
                                  </FormControl>
                                )}
                              />
                            </div>
                            <div>
                              <FormLabel>完結時間</FormLabel>
                              <FormField
                                control={timetemplate_create_form.control}
                                name="end_time"
                                render={({ field }) => (
                                  <FormControl>
                                    <SWR_Class_Time field={field} disabled={!isDateRangeSelected} />
                                  </FormControl>
                                )}
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
                          value={value ? value.map((day) => day.date) : []}
                          minDate={dayStart && !isNaN(new Date(dayStart).getTime()) ? new Date(dayStart) : undefined}
                          maxDate={dayEnd && !isNaN(new Date(dayEnd).getTime()) ? new Date(dayEnd) : undefined}
                          onChange={(dates: DateObject[]) => {
                            setSelectedDays(dates);
                            const formattedDays: z.infer<typeof daySchema>[] = dates.map((date) => ({
                              date: date.format("YYYY-MM-DD"),
                              start_time: "",
                              end_time: "",
                              lesson: "",
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
                        {selectedDays.map((day: DateObject, index) => (
                          <li key={index} className="border p-2 rounded">
                            <div>
                              <strong>日期:</strong> {day.format("YYYY-MM-DD")}
                            </div>
                            <div className="flex space-x-2 mt-1">
                              <div>
                                <label>開始時間:</label>
                                <Controller
                                  name={`days.${index}.start_time`}
                                  control={timetemplate_create_form.control}
                                  render={({ field }) => <SWR_Class_Time field={field} />}
                                />
                              </div>
                              <div>
                                <label>完結時間:</label>
                                <Controller
                                  name={`days.${index}.end_time`}
                                  control={timetemplate_create_form.control}
                                  render={({ field }) => <SWR_Class_Time field={field} />}
                                />
                              </div>
                              <div>
                                <label>課程:</label>
                                <Controller
                                  name={`days.${index}.lesson`}
                                  control={timetemplate_create_form.control}
                                  render={({ field }) => <SWR_Class_Lesson field={field} />}
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

          <Button type="submit" disabled={!isDateRangeSelected || isPending}>
            提交
          </Button>
        </form>
      </Form>
    </>
  );
};

export default TimeTemplate_Create_Form;