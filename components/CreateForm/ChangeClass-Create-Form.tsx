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
import { ChangeClass_Create_Schema } from "@/actions/Create-ChangeClass/schema";
import { createChangeClass } from "@/actions/Create-ChangeClass";

interface Student {
  id: string;
  name: string;
  grade: number;
  student_class: {
    class_date: string;
  }[];
  student_id: string;
}

const ChangeClass_Create_Form = () => {
  const [isPending, startTransition] = useTransition();
  const param = useParams();
  const classId = param?.classdetailbyID as string;
  const courseId = param?.coursedetailbyID as string;

  console.log("param : ",param)

  const [GetStudentData, setGetStudentData] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<{
    name: string;
    class_date: string;
  } | null>(null);

  const [GetClassData, setGetClassData] = useState([])

  useEffect(()=>{
    if(classId){
        const fatchClassData = async (id : string) =>{
            //在app/api/Course_data/route.ts
            const res = await fetch(`/api/Class_detail_data_by_id/${id}`);
            if(!res){
                throw new Error("斷線！")
            }
            
           const result = await res.json()

           setGetClassData(result)

        }
        fatchClassData(classId)
    }
  },[classId])

  console.log("GetClassData :",GetClassData)


  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await fetch(`/api/student/Student_AllLists`);
        if (!res.ok) {
          throw new Error("斷線！");
        }
        const result = await res.json();
        setGetStudentData(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStudentData();
  }, []);

  console.log("GetStudentData :",GetStudentData)

  const ChangeClass_create_form = useForm<
    z.infer<typeof ChangeClass_Create_Schema>
  >({
    resolver: zodResolver(ChangeClass_Create_Schema),
    defaultValues: {
      studentId: "",
      currentclassId: classId,
      targetclassId:"",
      courseId: courseId,
      class_date: "",
      name: "",
      student_class_date: "",
    },
  });

  const class_date = GetClassData[0]?.class_date
 useEffect(()=>{
    ChangeClass_create_form.setValue("class_date", class_date)
    
 },[GetClassData])

  const ChangeClass_create_form_onSubmit = (
    values: z.infer<typeof ChangeClass_Create_Schema>
  ) => {
    console.log("-- create booklist -- : ", values, "-- End --");

    startTransition(() => {
        createChangeClass(values)
    })
  };

  const handleSelectStudent = (
    studentId: string,
    name: string,
    class_date: string,
    id: string
  ) => {
    ChangeClass_create_form.setValue("studentId", studentId);
    ChangeClass_create_form.setValue("name", name);
    ChangeClass_create_form.setValue("student_class_date", class_date);
    ChangeClass_create_form.setValue("targetclassId",id);
    setSelectedStudent({ name, class_date });
    setIsModalOpen(false);
  };

  const filteredStudents = GetStudentData.filter((student) =>
    student.name.toLowerCase().includes(filter.toLowerCase())
  );

  console.log(" Bug " , ChangeClass_create_form.formState.errors ,"-- End --")


  return (
    <div className="p-4">
      <h2>ChangeClass_Create_Form</h2>

      <br />

這堂的時間是:{class_date}

<br />

      <Form {...ChangeClass_create_form}>
        <form
          onSubmit={ChangeClass_create_form.handleSubmit(
            ChangeClass_create_form_onSubmit
          )}
          className="space-y-4"
        >
          <FormField
            control={ChangeClass_create_form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>學生</FormLabel>
                <FormControl>
                  <Input
                    placeholder="輸入學生"
                    {...field}
                    onClick={() => setIsModalOpen(true)}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} type="submit">
            {isPending ? "loading..." : "submit"}
          </Button>
        </form>
      </Form>

      {selectedStudent && (
        <div className="mt-4 text-pink-500">
          選擇的學生: {selectedStudent.name}, 上課時間: {selectedStudent.class_date}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>選擇學生</DialogTitle>
          </DialogHeader>
          <div className="my-4">
            <Input
              placeholder="篩選學生姓名"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">姓名</th>
                  <th className="border p-2 text-left">年級</th>
                  <th className="border p-2 text-left">上課時間</th>
                  <th className="border p-2 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) =>
                  student.student_class.map((classItem, index) => (
                    <tr key={`${student.id}-${index}`}>
                      <td className="border p-2">{student.name}</td>
                      <td className="border p-2">{student.grade}</td>
                      <td className="border p-2">{classItem.class_date}</td>
                      <td className="border p-2">
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
                        >
                          選擇
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              關閉
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChangeClass_Create_Form;


