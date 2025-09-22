"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { mutate } from "swr";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ex_scope_Create_Schema } from "@/actions/Create-Ex_scope/schema";
import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
import { SWR_School_Quarter } from "../fatchdata/swrschool_quarter";
import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
import Image from "next/image";
import { createExScope } from "@/actions/Create-Ex_scope";

interface SchoolData {
  id: string;
  school_name: string;
}

interface EX_Scope_Create_FormProps {
  SchoolId: string;
  data: SchoolData[];
}

const EX_Scope_Create_Form = ({ SchoolId, data }: EX_Scope_Create_FormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();

  const ex_scope_create_form = useForm<z.infer<typeof Ex_scope_Create_Schema>>({
    resolver: zodResolver(Ex_scope_Create_Schema),
    defaultValues: {
      name: "",
      school_name: data[0]?.school_name || "",
      grade: 0,
      quarter: 0,
      school_ex_scope_id: SchoolId,
      subject: "",
      img: "",
    },
  });

  useEffect(() => {
    if (data[0]?.school_name) {
      ex_scope_create_form.setValue("school_name", data[0].school_name);
    }
  }, [data, ex_scope_create_form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validExtensions = ["jpg", "jpeg", "png", "pdf"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!fileExtension || !validExtensions.includes(fileExtension)) {
        setError("僅支持 JPG、JPEG、PNG 或 PDF 格式");
        ex_scope_create_form.setError("img", { message: "僅支持 JPG、JPEG、PNG 或 PDF 格式" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("文件大小不能超過 5MB");
        ex_scope_create_form.setError("img", { message: "文件大小不能超過 5MB" });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        ex_scope_create_form.setValue("img", base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const ex_scope_create_form_onSubmit = (values: z.infer<typeof Ex_scope_Create_Schema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createExScope(values).then((data) => {
        if (data?.success === "true" && data.data) {
          setSuccess("考試範圍創建成功");
          toast.success("考試範圍創建成功");
          // 刷新 SWR 緩存
          mutate(`/api/School_Lists`); // 假設 SWR 鍵，根據實際調整
          // 重定向
          router.push(`/admin/schoolLists/${SchoolId}/exscopeLists/`);
          ex_scope_create_form.reset();
          setPreviewImage(null);
        } else {
          setError(data?.error || "創建考試範圍失敗");
          toast.error(data?.error || "創建考試範圍失敗，請檢查輸入數據或文件格式");
        }
      });
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700">上傳考試範圍 - {data[0]?.school_name || "學校"}</h2>
      <Form {...ex_scope_create_form}>
        <form
          onSubmit={ex_scope_create_form.handleSubmit(ex_scope_create_form_onSubmit)}
          className="space-y-6"
        >
          <div className="text-red-500 text-sm">{error}</div>
          <div className="text-green-500 text-sm">{success}</div>
          <FormField
            control={ex_scope_create_form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">標題</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入考試範圍標題"
                    className="border-gray-300 focus:ring-[#80A8BD] focus:border-[#80A8BD] rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={ex_scope_create_form.control}
            name="school_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">學校名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled
                    placeholder={data[0]?.school_name || "學校名稱"}
                    className="border-gray-300 bg-gray-50 rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={ex_scope_create_form.control}
            name="school_ex_scope_id"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input {...field} type="hidden" value={SchoolId} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={ex_scope_create_form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">科目</FormLabel>
                <FormControl>
                  <SWR_School_Subject field={field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={ex_scope_create_form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">年級</FormLabel>
                <FormControl>
                  <SWR_School_Grade field={field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={ex_scope_create_form.control}
            name="quarter"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">季度</FormLabel>
                <FormControl>
                  <SWR_School_Quarter field={field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={ex_scope_create_form.control}
            name="img"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">上傳考試範圍文件</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    disabled={isPending}
                    onChange={handleImageUpload}
                    accept="image/jpeg,image/png,application/pdf"
                    className="border-gray-300 rounded-md file:bg-[#80A8BD] file:text-white file:border-none file:rounded-md file:px-4 file:py-2 hover:file:bg-[#d17a4a]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-[#80A8BD] hover:bg-[#d17a4a] text-white rounded-md px-6 py-2"
          >
            {isPending ? "正在提交..." : "建立"}
          </Button>
        </form>
      </Form>
      {previewImage && (
        <div className="mt-6">
          <h3 className="text-gray-700 font-medium mb-2">文件預覽</h3>
          {previewImage.startsWith("data:image/") ? (
            <Image
              width={500}
              height={500}
              src={previewImage}
              alt="考試範圍預覽"
              className="rounded-md shadow-md"
            />
          ) : (
            <div className="text-gray-500">已選擇 PDF 文件，無法預覽</div>
          )}
        </div>
      )}
    </div>
  );
};

export default EX_Scope_Create_Form;

// "use client";

// import * as z from "zod";
// import { useState, useEffect, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Ex_scope_Create_Schema } from "@/actions/Create-Ex_scope/schema";
// import { SWR_School_Grade } from "../fatchdata/swrschool_grade";
// import { SWR_School_Quarter } from "../fatchdata/swrschool_quarter";
// import { SWR_School_Subject } from "../fatchdata/swrschool_subject";
// import Image from "next/image";
// import { createExScope } from "@/actions/Create-Ex_scope";

// interface SchoolData {
//   id: string;
//   school_name: string;
// }

// interface EX_Scope_Create_FormProps {
//   SchoolId: string;
//   data: SchoolData[];
// }

// const EX_Scope_Create_Form = ({ SchoolId, data }: EX_Scope_Create_FormProps) => {
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [isPending, startTransition] = useTransition();
//   const [PreviewImage, setPreviewImage] = useState<string | null>(null);
//   const [SchoolName, setSchoolName] = useState("");

//   useEffect(() => {
//     if (data && data[0] && data[0].school_name) {
//       setSchoolName(data[0].school_name);
//       ex_scope_create_form.setValue("school_name", data[0].school_name);
//     }
//   }, [data]);

//   const ex_scope_create_form = useForm<z.infer<typeof Ex_scope_Create_Schema>>({
//     resolver: zodResolver(Ex_scope_Create_Schema),
//     defaultValues: {
//       name: "",
//       school_name: SchoolName,
//       grade: 0,
//       quarter: 0,
//       school_ex_scope_id: SchoolId,
//       subject: "",
//       img: "",
//     },
//   });

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       const reader = new FileReader();
//       reader.onload = () => {
//         const base64String = reader.result as string;
//         ex_scope_create_form.setValue("img", base64String);
//         setPreviewImage(base64String);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const ex_scope_create_form_onSubmit = (values: z.infer<typeof Ex_scope_Create_Schema>) => {
//     setError("");
//     setSuccess("");
//     startTransition(() => {
//       createExScope(values).then((data) => {
//         setError(data?.error);
//         setSuccess(data?.success);
//       });
//     });
//   };

//   return (
//     <div className="space-y-6">
//       {error && <div className="text-red-500 text-sm">{error}</div>}
//       {success && <div className="text-green-500 text-sm">{success}</div>}

//       <Form {...ex_scope_create_form}>
//         <form
//           onSubmit={ex_scope_create_form.handleSubmit(ex_scope_create_form_onSubmit)}
//           className="space-y-6"
//         >
//           <FormField
//             control={ex_scope_create_form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-gray-700 font-medium">標題</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="輸入考試範圍標題"
//                     className="border-gray-300 focus:ring-[#80A8BD] focus:border-[#80A8BD] rounded-md"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {data.map((d) => (
//             <FormField
//               key={d.id}
//               control={ex_scope_create_form.control}
//               name="school_name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-gray-700 font-medium">學校名稱</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       placeholder={d.school_name}
//                       defaultValue={d.school_name}
//                       disabled
//                       className="border-gray-300 bg-gray-50 rounded-md"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           ))}

//           <FormField
//             control={ex_scope_create_form.control}
//             name="school_ex_scope_id"
//             render={({ field }) => (
//               <FormItem hidden>
//                 <FormControl>
//                   <Input {...field} type="text" value={SchoolId} disabled />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={ex_scope_create_form.control}
//             name="subject"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-gray-700 font-medium">科目</FormLabel>
//                 <FormControl>
//                   <SWR_School_Subject field={field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={ex_scope_create_form.control}
//             name="grade"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-gray-700 font-medium">年級</FormLabel>
//                 <FormControl>
//                   <SWR_School_Grade field={field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={ex_scope_create_form.control}
//             name="quarter"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-gray-700 font-medium">季度</FormLabel>
//                 <FormControl>
//                   <SWR_School_Quarter field={field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={ex_scope_create_form.control}
//             name="img"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-gray-700 font-medium">上傳考試範圍圖片</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="file"
//                     disabled={isPending}
//                     onChange={handleImageUpload}
//                     className="border-gray-300 rounded-md file:bg-[#80A8BD] file:text-white file:border-none file:rounded-md file:px-4 file:py-2 hover:file:bg-[#d17a4a]"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <Button
//             disabled={isPending}
//             type="submit"
//             className="bg-[#80A8BD] hover:bg-[#d17a4a] text-white rounded-md px-6 py-2"
//           >
//             建立
//           </Button>
//         </form>
//       </Form>

//       {PreviewImage && (
//         <div className="mt-6">
//           <h3 className="text-gray-700 font-medium mb-2">圖片預覽</h3>
//           <Image
//             width={500}
//             height={500}
//             src={PreviewImage}
//             alt="考試範圍預覽"
//             className="rounded-md shadow-md"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default EX_Scope_Create_Form;