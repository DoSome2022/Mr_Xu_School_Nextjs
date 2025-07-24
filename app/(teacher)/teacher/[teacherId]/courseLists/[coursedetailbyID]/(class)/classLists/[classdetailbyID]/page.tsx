"use client";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { createTeacherTimeWork } from "@/actions/Create-TeacherTimeWork";
import { createAttenDance } from "@/actions/Create-AttenDance";

// 定义表单 schema
const AttendanceSchema = z.object({
    studentAttendance: z.array(
        z.object({
            studentId: z.string(),
            isPresent: z.boolean(),
            isLate: z.boolean(),
            classroomId: z.string(),
            subject: z.string(),
            grade: z.number(),
        })
    ),
});

type AttendanceFormData = z.infer<typeof AttendanceSchema>;

const ClassDetail = () => {
    const [GetClassData, setGetClassData] = useState([]);
    const params = useParams<{ teacherId: string; coursedetailbyID: string; classdetailbyID: string }>();
    const teacherId = params?.teacherId as string;
    const courseId = params?.coursedetailbyID as string;
    const classId = params?.classdetailbyID as string;

    const [isPending, startTransition] = useTransition();
    const [isSubmitted, setIsSubmitted] = useState(false); // 本地狀態追踪是否已提交

    const form = useForm<AttendanceFormData>({
        resolver: zodResolver(AttendanceSchema),
        defaultValues: {
            studentAttendance: [],
        },
    });

    useEffect(() => {
        if (classId) {
            const fetchClassData = async (id: string) => {
                try {
                    const response = await fetch(`/api/Class_detail_data_by_id/${id}`);
                    if (!response.ok) throw new Error("Failed to fetch class data");
                    const data = await response.json();
                    setGetClassData(data);

                    // 初始化表单数据
                    const initialAttendance = data[0]?.student.map((student) => ({
                        studentId: student.id,
                        isPresent: false,
                        isLate: false,
                        classroomId: classId,
                        subject: data[0]?.class_subject || "",
                        grade: student.grade || 0,
                    }));
                    form.reset({ studentAttendance: initialAttendance });

                    // 設置是否已提交
                    setIsSubmitted(data[0]?.isSubmittedform || false);
                } catch (error) {
                    console.error("Error fetching class data:", error);
                }
            };
            fetchClassData(classId);
        }
    }, [classId, form]);

    const onSubmit = async (data: AttendanceFormData) => {
        startTransition(async () => {
            const classData = GetClassData[0];
            const grade = classData.grade;
            const classTimeH = classData.class_time_h;

            // 计算出勤学生数量并按年级分类
            const attendanceSummary = {
                P_number: data.studentAttendance.filter((s) => s.isPresent && s.grade >= 1 && s.grade <= 6).length,
                JHS_number: data.studentAttendance.filter((s) => s.isPresent && s.grade >= 7 && s.grade <= 9).length,
                HS_number: data.studentAttendance.filter((s) => s.isPresent && s.grade >= 10 && s.grade <= 12).length,
                P_HR: grade >= 1 && grade <= 6 ? classTimeH : 0,
                JHS_HR: grade >= 7 && grade <= 9 ? classTimeH : 0,
                HS_HR: grade >= 10 && grade <= 12 ? classTimeH : 0,
                teacherId,
                classId,
            };

            // 提交点名数据和教师工作时间数据
            const [attendanceResult, teacherTimeWorkResult] = await Promise.all([
                createAttenDance(data.studentAttendance), // 傳入整個學生陣列
                createTeacherTimeWork(attendanceSummary),
            ]);

            // 如果提交成功，更新本地狀態
            if (attendanceResult.data && !attendanceResult.error) {
                setIsSubmitted(true);
            }
        });
    };

    console.log("GetClassData :",GetClassData)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <span>ClassDetail</span>
                <br />
                學生列表
                <br />
                {GetClassData[0]?.student.map((student, index) => {
                    if(student.pay){
                        return(
                            <>
                                                 <div key={student.id}>
                        學生名稱: {student.name} (年級: {student.grade})
                        <br />
                        <FormField
                            control={form.control}
                            name={`studentAttendance.${index}.isPresent`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>出席</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value || false}
                                            onCheckedChange={(value) => field.onChange(value)}
                                            disabled={isSubmitted} // 提交後禁用
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`studentAttendance.${index}.isLate`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>遲到</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value || false}
                                            onCheckedChange={(value) => field.onChange(value)}
                                            disabled={isSubmitted} // 提交後禁用
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                            </>
                        )
                    }
   
}    
            )}
                <Button
                    disabled={isPending || isSubmitted}
                    type="submit"
                    className={isSubmitted ? "bg-gray-400 cursor-not-allowed" : ""}
                >
                    {isSubmitted ? "已提交" : "提交"}
                </Button>
            </form>
        </Form>
    );
};

export default ClassDetail;