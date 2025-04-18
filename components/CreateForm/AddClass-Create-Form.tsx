"use client";


import * as z from "zod";
import { useState, useEffect ,useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useSearchParams } from "next/navigation";

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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
import { AddClass_Create_Schema } from "@/actions/Create-AddClass/schema";
import { createAddClass } from "@/actions/Create-AddClass";


interface Student {
    id: string;
    name: string;
    grade: number;
    student_class: {
      class_date: string;
    }[];
    student_id: string;
  }
  

const AddClass_Create_Form = () => {

    const [isPending , startTransition] = useTransition();
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

//   console.log("GetClassData :",GetClassData)


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



    const AddClass_create_form = useForm<z.infer<typeof AddClass_Create_Schema >>({
        resolver : zodResolver(AddClass_Create_Schema),
        defaultValues:{
            studentId:"",
            currentclassId:classId,
            targetclassId:"",
            class_date:"",
            name:"",
            student_class_date:"",
            courseId:courseId
        }
    })

      const class_date = GetClassData[0]?.class_date
     useEffect(()=>{
        AddClass_create_form.setValue("class_date", class_date)
     },[GetClassData])
    
    const  AddClass_create_form_onSubmit = (values : z.infer<typeof AddClass_Create_Schema>) =>{
        console.log("--  create booklist -- : ", values ,"-- End --")

        startTransition(()=>{
            createAddClass(values)
        })
    }
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
    
      console.log(" Bug " , AddClass_create_form.formState.errors ,"-- End --")
    

    return(
        <>
        <br />

        這堂的時間是:{class_date}

<br />
            <Form {...AddClass_create_form}>
                <form
                    onSubmit={AddClass_create_form.handleSubmit(AddClass_create_form_onSubmit)}
                    className="space-y-6"
                >
                
                <FormField
            control={AddClass_create_form.control}
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

        </>
    )
}

export default AddClass_Create_Form