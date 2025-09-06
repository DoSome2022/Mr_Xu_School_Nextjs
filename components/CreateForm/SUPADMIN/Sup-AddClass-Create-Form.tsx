"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { SupAddClass_Create_Schema } from "@/actions/supadmin/Create-AddClass/schema";
import { SupcreateAddClass } from "@/actions/supadmin/Create-AddClass";

interface Class {
  id: string;
  classroom: string;
  class_lesson: string;
  persons: number;
  teacher: string;
  student: { id: string; name: string }[];
  node: number;
  class_date: string;
  grade: number;
}

interface Student {
  id: string;
  name: string;
  grade: number;
  student_class: {
    id: string;
    class_date: string;
  }[];
  student_id: string;
}

const AddClass_Create_Formbysupadmin = () => {
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const classId = params?.classdetailbyID as string;
  const courseId = params?.coursedetailbyID as string;
  // const supadminId = params?.supadminid as string;

  const [GetStudentData, setGetStudentData] = useState<Student[]>([]);
  const [GetClassData, setGetClassData] = useState<Class | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<{
    name: string;
    class_date: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [studentRes, classRes] = await Promise.all([
          fetch(`/api/student/Student_AllLists`),
          fetch(`/api/Class_detail_data_by_id/${classId}`),
        ]);

        if (!studentRes.ok) throw new Error("無法獲取學生數據");
        const studentResult = await studentRes.json();
        setGetStudentData(studentResult);

        if (!classRes.ok) throw new Error("無法獲取課堂數據");
        const classResult = await classRes.json();
        setGetClassData(classResult);
      } catch (error: any) {
        console.error("數據獲取失敗:", error);
        setError("無法載入數據");
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchData();
    } else {
      setError("無效的課堂ID");
      setLoading(false);
    }
  }, [classId]);

  const AddClass_create_form = useForm<z.infer<typeof SupAddClass_Create_Schema>>({
    resolver: zodResolver(SupAddClass_Create_Schema),
    defaultValues: {
      studentId: "",
      currentclassId: classId,
      targetclassId: "",
      class_date: "",
      name: "",
      student_class_date: "",
      courseId: courseId,
    },
  });

  useEffect(() => {
    if (GetClassData?.class_date) {
      AddClass_create_form.setValue("class_date", GetClassData.class_date);
    }
  }, [GetClassData, AddClass_create_form]);

  const AddClass_create_form_onSubmit = (values: z.infer<typeof SupAddClass_Create_Schema>) => {
    console.log("-- create add class -- : ", values, "-- End --");
    setError(null);
    startTransition(() => {
      SupcreateAddClass(values).then((result) => {
        if (result?.error) {
          setError(result.error);
        } else {
          AddClass_create_form.reset();
          setSelectedStudent(null);
        }
      });
    });
  };

  const handleSelectStudent = (
    studentId: string,
    name: string,
    class_date: string,
    id: string
  ) => {
    AddClass_create_form.setValue("studentId", studentId);
    AddClass_create_form.setValue("name", name);
    AddClass_create_form.setValue("student_class_date", class_date);
    AddClass_create_form.setValue("targetclassId", id);
    setSelectedStudent({ name, class_date });
    setIsModalOpen(false);
  };

  const filteredStudents = GetStudentData.filter((student) =>
    student.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">
        課堂時間: {GetClassData?.class_date || "載入中..."}
      </h2>
      <Form {...AddClass_create_form}>
        <form
          onSubmit={AddClass_create_form.handleSubmit(AddClass_create_form_onSubmit)}
          className="space-y-6"
        >
          {error && (
            <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>
          )}
          <FormField
            control={AddClass_create_form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">學生</FormLabel>
                <FormControl>
                  <Input
                    placeholder="點擊選擇學生"
                    {...field}
                    onClick={() => setIsModalOpen(true)}
                    readOnly
                    className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          {selectedStudent && (
            <div className="text-gray-600 bg-gray-50 p-4 rounded-md">
              <p>
                <span className="font-semibold">選擇的學生:</span> {selectedStudent.name}
              </p>
              <p>
                <span className="font-semibold">上課時間:</span> {selectedStudent.class_date}
              </p>
            </div>
          )}
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-[#e7915b] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            {isPending ? "正在提交..." : "提交"}
          </Button>
        </form>
      </Form>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-gray-700 text-xl font-semibold">
              選擇學生
            </DialogTitle>
          </DialogHeader>
          <div className="my-4">
            <Input
              placeholder="篩選學生姓名"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border-gray-300 focus:border-[#e7915b] focus:ring-[#e7915b] transition-colors duration-300"
            />
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-3 text-left text-gray-700 font-semibold">
                    姓名
                  </th>
                  <th className="border border-gray-300 p-3 text-left text-gray-700 font-semibold">
                    年級
                  </th>
                  <th className="border border-gray-300 p-3 text-left text-gray-700 font-semibold">
                    上課時間
                  </th>
                  <th className="border border-gray-300 p-3 text-left text-gray-700 font-semibold">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="border border-gray-300 p-3 text-center text-gray-600">
                      沒有找到匹配的學生
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) =>
                    student.student_class.map((classItem, index) => (
                      <tr key={`${student.id}-${index}`} className="hover:bg-gray-100">
                        <td className="border border-gray-300 p-3 text-gray-600">
                          {student.name}
                        </td>
                        <td className="border border-gray-300 p-3 text-gray-600">
                          {student.grade}
                        </td>
                        <td className="border border-gray-300 p-3 text-gray-600">
                          {classItem.class_date}
                        </td>
                        <td className="border border-gray-300 p-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleSelectStudent(
                                student.id,
                                student.name,
                                classItem.class_date,
                                classItem.id
                              )
                            }
                            className="border-[#e7915b] text-[#e7915b] hover:bg-[#e7915b] hover:text-white transition-colors duration-300"
                          >
                            選擇
                          </Button>
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-300"
            >
              關閉
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddClass_Create_Formbysupadmin;