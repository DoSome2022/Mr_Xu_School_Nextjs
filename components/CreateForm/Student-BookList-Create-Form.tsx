// "use client";

// import * as z from "zod";
// import { useState, useEffect, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useParams } from "next/navigation";
// import Image from "next/image";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { SWR_School_Year } from "../fatchdata/swrschool_year";
// import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
// import { student_booklist_Create_Schema } from "@/actions/Create-Student_Booklist/schema";
// import { createStudentBookList } from "@/actions/Create-Student_Booklist";

// interface StudentData {
//   id: string;
//   name: string;
//   grade: number;
//   school: string;
// }

// interface Student_BookList_Create_FormProps {
//   studentId: string;
//   data: StudentData[];
// }

// const Student_BookList_Create_Form = ({ studentId, data }: Student_BookList_Create_FormProps) => {
//   console.log("-- Student Data _form: --", data, "-- end --");

//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [isPending, startTransition] = useTransition();
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const param = useParams<{
//     parentdetailbyID: string;
//     studentdetailbyID: string;
//   }>();
//   const studentid = param.studentdetailbyID as string;
//   const parentid = param.parentdetailbyID as string;

//   console.log("params: ", param);

//   const student_booklist_create_form = useForm<z.infer<typeof student_booklist_Create_Schema>>({
//     resolver: zodResolver(student_booklist_Create_Schema),
//     defaultValues: {
//       studentId: studentid,
//       parentId: parentid,
//       name: "",
//       student_name: "",
//       year: "",
//       grade: 0,
//       img: "",
//       student_booklist_id: studentId,
//       school: "",
//     },
//   });

//   useEffect(() => {
//     if (data && data[0] && data[0].name) {
//       student_booklist_create_form.setValue("student_name", data[0].name);
//     }
//     if (data && data[0] && data[0].school) {
//       student_booklist_create_form.setValue("school", data[0].school);
//     }
//   }, [data, student_booklist_create_form]);

//   // 處理圖片上傳
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       const reader = new FileReader();

//       reader.onload = () => {
//         const base64String = reader.result as string;
//         student_booklist_create_form.setValue("img", base64String);
//         setPreviewImage(base64String);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const student_booklist_create_form_onSubmit = (
//     values: z.infer<typeof student_booklist_Create_Schema>
//   ) => {
//     console.log("-- create student_booklist -- : ", values, "-- End --");
//     setError("");
//     setSuccess("");
//     startTransition(() => {
//       createStudentBookList(values).then((data) => {
//         setError(data?.error);
//         setSuccess(typeof data?.success === "string" ? data?.success : data?.success ? "資料更新成功" : undefined);
//       });
//     });
//   };

//   return (
//     <div className="border border-gray-200 rounded p-6 bg-white shadow-sm">
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       {success && <p className="text-green-500 mb-4">{success}</p>}
//       <Form {...student_booklist_create_form}>
//         <form
//           onSubmit={student_booklist_create_form.handleSubmit(student_booklist_create_form_onSubmit)}
//           className="space-y-6"
//         >
//           <FormField
//             control={student_booklist_create_form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-[#80A8BD] font-medium">檔案名稱</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="請輸入檔案名稱"
//                     type="text"
//                     className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD]"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={student_booklist_create_form.control}
//             name="school"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-[#80A8BD] font-medium">學校</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={true}
//                     placeholder="學校"
//                     value={data[0]?.school || ""}
//                     type="text"
//                     className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD]"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={student_booklist_create_form.control}
//             name="student_name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-[#80A8BD] font-medium">學生名稱</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={true}
//                     placeholder="學生名稱"
//                     type="text"
//                     className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD]"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={student_booklist_create_form.control}
//             name="student_booklist_id"
//             render={({ field }) => (
//               <FormItem hidden>
//                 <FormControl>
//                   <Input {...field} type="text" value={studentId} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={student_booklist_create_form.control}
//             name="year"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-[#80A8BD] font-medium">年份</FormLabel>
//                 <FormControl>
//                   <SWR_School_Year field={field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={student_booklist_create_form.control}
//             name="grade"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-[#80A8BD] font-medium">年級</FormLabel>
//                 <FormControl>
//                   <SWR_School_Grade field={field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={student_booklist_create_form.control}
//             name="img"
//             render={() => (
//               <FormItem>
//                 <FormLabel className="text-[#80A8BD] font-medium">上傳圖片</FormLabel>
//                 <FormControl>
//                   <Input
//                     disabled={isPending}
//                     onChange={handleImageUpload}
//                     type="file"
//                     accept="image/*"
//                     className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:border-[#80A8BD] focus:ring-[#80A8BD]"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <Button
//             disabled={isPending}
//             type="submit"
//             className="bg-[#80A8BD] hover:bg-cyan-200 text-white hover:text-[#80A8BD] transition-colors duration-300"
//           >
//             建立
//           </Button>
//         </form>

//         {previewImage && (
//           <div className="mt-6">
//             <p className="text-[#80A8BD] font-medium mb-2">圖片預覽</p>
//             <Image
//               width={500}
//               height={500}
//               src={previewImage}
//               alt="書單圖片預覽"
//               className="rounded-md object-cover max-w-full h-auto"
//             />
//           </div>
//         )}
//       </Form>
//     </div>
//   );
// };

// export default Student_BookList_Create_Form;

"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SWR_School_Year } from "../fatchdata/swrschool_year";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { student_booklist_Create_Schema } from "@/actions/Create-Student_Booklist/schema";
import { createStudentBookList } from "@/actions/Create-Student_Booklist";

interface StudentData {
  id: string;
  name: string;
  grade: number;
  school: string;
}

interface Student_BookList_Create_FormProps {
  studentId: string;
  data: StudentData[];
}

const Student_BookList_Create_Form = ({ studentId, data }: Student_BookList_Create_FormProps) => {
  console.log("-- Student Data _form: --", data, "-- end --");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const param = useParams<{
    parentdetailbyID: string;
    studentdetailbyID: string;
  }>();
  const router = useRouter();
  const studentid = param.studentdetailbyID as string;
  const parentid = param.parentdetailbyID as string;

  console.log("params: ", param);

  const student_booklist_create_form = useForm<z.infer<typeof student_booklist_Create_Schema>>({
    resolver: zodResolver(student_booklist_Create_Schema),
    defaultValues: {
      studentId: studentid,
      parentId: parentid,
      name: "",
      student_name: "",
      year: "",
      grade: 0,
      img: "",
      student_booklist_id: studentId,
      school: "",
    },
  });

  useEffect(() => {
    if (data && data[0] && data[0].name) {
      student_booklist_create_form.setValue("student_name", data[0].name);
    }
    if (data && data[0] && data[0].school) {
      student_booklist_create_form.setValue("school", data[0].school);
    }
  }, [data, student_booklist_create_form]);

  // 處理圖片/文件上傳
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validExtensions = ["jpg", "jpeg", "png", "pdf"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!fileExtension || !validExtensions.includes(fileExtension)) {
        setError("僅支持 JPG、JPEG、PNG 或 PDF 格式");
        student_booklist_create_form.setError("img", { message: "僅支持 JPG、JPEG、PNG 或 PDF 格式" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("文件大小不能超過 5MB");
        student_booklist_create_form.setError("img", { message: "文件大小不能超過 5MB" });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        student_booklist_create_form.setValue("img", base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const student_booklist_create_form_onSubmit = (
    values: z.infer<typeof student_booklist_Create_Schema>
  ) => {
    console.log("-- create student_booklist -- : ", values, "-- End --");
    setError("");
    setSuccess("");
    startTransition(() => {
      createStudentBookList(values).then((data) => {
        if (data?.success === "true" && data.data) {
          setSuccess("學生書單創建成功");
          toast.success("學生書單創建成功");
          router.push(`/admin/userLists/parentsLists/${parentid}/studentLists/${studentid}/bookLists`);
          student_booklist_create_form.reset();
          setPreviewImage(null);
        } else {
          setError(data?.error || "創建學生書單失敗");
          toast.error(data?.error || "創建學生書單失敗，請檢查輸入數據或文件格式");
        }
      });
    });
  };

  return (
    <div className="border border-gray-200 rounded p-6 bg-white shadow-sm">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <Form {...student_booklist_create_form}>
        <form
          onSubmit={student_booklist_create_form.handleSubmit(student_booklist_create_form_onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={student_booklist_create_form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#80A8BD] font-medium">檔案名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="請輸入檔案名稱"
                    type="text"
                    className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={student_booklist_create_form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#80A8BD] font-medium">學校</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={true}
                    placeholder="學校"
                    value={data[0]?.school || ""}
                    type="text"
                    className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={student_booklist_create_form.control}
            name="student_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#80A8BD] font-medium">學生名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={true}
                    placeholder="學生名稱"
                    type="text"
                    className="border-gray-300 focus:border-[#80A8BD] focus:ring-[#80A8BD]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={student_booklist_create_form.control}
            name="student_booklist_id"
            render={({ field }) => (
              <FormItem hidden>
                <FormControl>
                  <Input {...field} type="text" value={studentId} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={student_booklist_create_form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#80A8BD] font-medium">年份</FormLabel>
                <FormControl>
                  <SWR_School_Year field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={student_booklist_create_form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#80A8BD] font-medium">年級</FormLabel>
                <FormControl>
                  <SWR_School_Grade field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={student_booklist_create_form.control}
            name="img"
            render={() => (
              <FormItem>
                <FormLabel className="text-[#80A8BD] font-medium">上傳文件</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    onChange={handleImageUpload}
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:border-[#80A8BD] focus:ring-[#80A8BD]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isPending}
            type="submit"
            className="bg-[#80A8BD] hover:bg-cyan-200 text-white hover:text-[#80A8BD] transition-colors duration-300"
          >
            {isPending ? "正在提交..." : "建立"}
          </Button>
        </form>

        {previewImage && (
          <div className="mt-6">
            <p className="text-[#80A8BD] font-medium mb-2">文件預覽</p>
            {previewImage.startsWith("data:image/") ? (
              <Image
                width={500}
                height={500}
                src={previewImage}
                alt="書單圖片預覽"
                className="rounded-md object-cover max-w-full h-auto"
              />
            ) : (
              <p className="text-gray-500">已選擇 PDF 文件，無法預覽</p>
            )}
          </div>
        )}
      </Form>
    </div>
  );
};

export default Student_BookList_Create_Form;