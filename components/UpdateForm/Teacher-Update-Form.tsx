
// "use client"


// import * as z from "zod";
// import { useState, useTransition, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useSearchParams } from "next/navigation";

// import { Input } from "@/components/ui/input"; 

// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useParams } from 'next/navigation';

// import { 
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage
//  } from "@/components/ui/form"
// import { SupTeacher_Update_Schema } from "@/actions/Update-Teacher/schema";
// import { updateTeacher } from "@/actions/Update-Teacher";



// const Teacher_Update_Form = () => {

//     //這個是由user db開始出發拉下去直到teacher data
//     const [GetTeacherData , setGetTeacherData] = useState([]);

//     const params = useParams();
//     const TeacherId = params?.teacherdetailbyID as string;

//     const [isPending , startTransition] = useTransition();
//     const [ error, setError ] = useState<string | undefined>("");
//     const [ success, setSuccess  ] = useState<string | undefined>("");

//       //拿 teacher data
//       useEffect(() => {
//         if(TeacherId){
//             const fetchTeacherData = async (userId :string) =>{
//                 //在app/api/Course_data_teacher_by_id/[id]/route.ts
//                 const res = await fetch(`/api/Course_data_teacher_by_id/${userId}`);
//                 if(!res){
//                     throw new Error("斷線！")
//                 }
//                const result = await res.json();
//                setGetTeacherData(result)
//             }
//             fetchTeacherData(TeacherId)
//             }
//     },[TeacherId])
//     //  console.log(GetTeacherData)

//      const [ UserName , setUserName ] = useState('');
//      const [ NickName , setNickName ] = useState('');
//      const [ Email, setEmail ] = useState('');
//      const [ Phone , setPhone ] = useState('');
//      const [ Staff , setStaff ] = useState<boolean>(false);
//      const [ Isadmin , setIsadmin ] = useState<boolean>(false);




//      const teacher_update_form = useForm<z.infer<typeof SupTeacher_Update_Schema>>({
//         resolver: zodResolver(SupTeacher_Update_Schema),
//         defaultValues:{
//             teacherid:TeacherId,
//             username: UserName,
//             nickname: NickName,
//             email: Email,
//             phone: Phone,
//             staff: GetTeacherData.Staff,
//             isadmin: GetTeacherData.ISADMIN,
//         }
//     })


//     useEffect(()=>{
//         if(GetTeacherData  && GetTeacherData.username){
//             setUserName(GetTeacherData.username);
//             teacher_update_form.setValue("username", GetTeacherData.username);
//         }
//         if(GetTeacherData && GetTeacherData.nickname){
//             setNickName(GetTeacherData.nickname);
//             teacher_update_form.setValue("nickname", GetTeacherData.nickname);
//         }
//         if(GetTeacherData && GetTeacherData.email){
//             setEmail(GetTeacherData.email);
//             teacher_update_form.setValue("email", GetTeacherData.email);
//         }
//         if(GetTeacherData && GetTeacherData.phone){
//             setPhone(GetTeacherData.phone);
//             teacher_update_form.setValue("phone", GetTeacherData.phone);
//         }        
//         if(GetTeacherData && GetTeacherData.Staff !== undefined){
//             setStaff(GetTeacherData.Staff);
//             teacher_update_form.setValue("staff", GetTeacherData.Staff);
//         }
//         if(GetTeacherData &&  GetTeacherData.ISADMIN !== undefined){
//             setIsadmin(GetTeacherData.ISADMIN);
//             teacher_update_form.setValue("isadmin", GetTeacherData.ISADMIN);
//         }

//      },[GetTeacherData])




//     const teacher_update_form_onSubmit = (values:z.infer<typeof SupTeacher_Update_Schema>) =>{
//         console.log("-- teacher update輸入 -- : ",values,"-- End --")
//         startTransition( async () => {
//             const result = await updateTeacher(values);
//             if(result.error) {
//                 setError(result.error);
//             } else {
//                 setEmail("");
//             }
//         } )
//     }




//     return(
//         <>
// {error && <p className="error-message" >{error}</p>}
// <br />
// <br />

//         <Form {...teacher_update_form} >

// <form 
//     onSubmit={teacher_update_form.handleSubmit(teacher_update_form_onSubmit)}
// className="space-y-6">


//         <>
//             <div className="space-y-4">
//                 <FormField
//                     control={teacher_update_form.control}
//                     name="teacherid"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormControl>
//                         <Input 
//                             {...field}
//                             value={TeacherId}
//                             type="text"
//                             />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//             </div>


//     <div className="space-y-4">
//         <FormField
//             control={teacher_update_form.control}
//             name="username"
//             render={({ field }) => (
//         <FormItem>
//             <FormLabel> 用戶名稱 </FormLabel>
//             <FormControl>
//                 <Input 
//                     {...field}
//                     disabled={isPending}
//                     placeholder={GetTeacherData.username}
//                     defaultValue={GetTeacherData.username}
//                     type="text"
//                     />
//             </FormControl>
//             <FormMessage />
//         </FormItem>
//             )}
//         />
//     </div>
//     <div className="space-y-4">
//         <FormField
//             control={teacher_update_form.control}
//             name="nickname"
//             render={({ field }) => (
//         <FormItem>
//             <FormLabel> 暱稱 </FormLabel>
//             <FormControl>
//                 <Input 
//                     {...field}
//                     disabled={isPending}
//                     placeholder={GetTeacherData.nickname}
//                     defaultValue={GetTeacherData.nickname}
//                     type="text"
//                     />
//             </FormControl>
//             <FormMessage />
//         </FormItem>
//             )}
//         />
//     </div>
//     <div className="space-y-4">
//         <FormField
//             control={teacher_update_form.control}
//             name="email"
//             render={({ field }) => (
//         <FormItem>
//             <FormLabel> 電郵 </FormLabel>
//             <FormControl>
//                 <Input 
//                     {...field}
//                     disabled={isPending}
//                     placeholder={GetTeacherData.email}
//                     defaultValue={GetTeacherData.email}
//                     type="text"
//                     />
//             </FormControl>
//             <FormMessage />
//         </FormItem>
//             )}
//         />
//     </div>
//     <div className="space-y-4">
//         <FormField
//             control={teacher_update_form.control}
//             name="phone"
//             render={({ field }) => (
//         <FormItem>
//             <FormLabel> 電話 </FormLabel>
//             <FormControl>
//                 <Input 
//                     {...field}
//                     disabled={isPending}
//                     placeholder={GetTeacherData.phone}
//                     defaultValue={GetTeacherData.phone}
//                     type="number"
//                     />
//             </FormControl>
//             <FormMessage />
//         </FormItem>
//             )}
//         />
//     </div>

//     <div className="space-y-4"
    
//     >
//                         <FormField 
//                             control={teacher_update_form.control}
//                             name="staff"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel> 職員 </FormLabel>
//                                     <FormControl>
//                                         <Checkbox 
//                                         {...field}
//                                             checked={field.value}
//                                             onCheckedChange={(staff) => field.onChange(staff)}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}  
//                         />
//                     </div>

//                     <div className="space-y-4"
                        
//                     >
//                         <FormField 
//                             control={teacher_update_form.control}
//                             name="isadmin"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel> 是否ADMIN </FormLabel>
//                                     <FormControl>
//                                         <Checkbox 
//                                         {...field}
//                                             checked={field.value}
//                                             onCheckedChange={(isadmin) =>field.onChange(isadmin)}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}  
//                         />
//                     </div>
//         </>


  

//     <Button disabled={isPending} type="submit" >

//     建立
//             </Button>

// </form>

// </Form>
//         </>
//     )
// }

// export default Teacher_Update_Form


// app/[您的路徑]/Teacher_Update_Formbysupadmin.tsx

"use client";

import * as z from "zod";
import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { SupupdateTeacher } from "@/actions/supadmin/Update-Teacher";
import { SupTeacher_Update_Schema } from "@/actions/supadmin/Update-Teacher/schema";

interface TeacherData {
  username: string;
  nickname?: string;
  email: string;
  phone?: string;
  staff: boolean;
  isadmin: boolean;
}

const Teacher_Update_Formbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    teacherdetailbyID: string;
  }>();
  const router = useRouter();
  const teacherId = params?.teacherdetailbyID;
  const supadminId = params?.supadminid;

  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(true);

  const teacher_update_form = useForm<z.infer<typeof SupTeacher_Update_Schema>>({
    resolver: zodResolver(SupTeacher_Update_Schema),
    defaultValues: {
      teacherid: teacherId || "",
      username: "",
      nickname: "",
      email: "",
      phone: "",
      staff: false,
      isadmin: false,
      supadminId: supadminId || "",
    },
  });

  useEffect(() => {
    if (!teacherId || !supadminId) {
      setError("缺少必要路由參數");
      setLoading(false);
      return;
    }

    const fetchTeacherData = async (userId: string) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/Course_data_teacher_by_id/${userId}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        if (!res.ok) {
          throw new Error("無法連接到伺服器");
        }
        const result = await res.json();
        if (!result || typeof result !== "object") {
          throw new Error("無效的教師數據格式");
        }
        setTeacherData(result);
        teacher_update_form.reset({
          teacherid: teacherId,
          username: result.username || "",
          nickname: result.nickname || "",
          email: result.email || "",
          phone: result.phone || "",
          staff: result.staff || false,
          isadmin: result.isadmin || false,
          supadminId: supadminId || "",
        });
      } catch (error: any) {
        console.error("獲取老師數據失敗:", error);
        setError("無法載入老師數據，請稍後再試");
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherData(teacherId);
  }, [teacherId, supadminId, teacher_update_form]);

  const teacher_update_form_onSubmit = (values: z.infer<typeof SupTeacher_Update_Schema>) => {
    console.log("-- 老師用戶更新輸入 -- : ", values, " -- End --");
    setError("");
    setSuccess("");
    startTransition(() => {
      SupupdateTeacher(values).then((data) => {
        if (data?.success) {
          setSuccess("資料更新成功");
          teacher_update_form.reset();
          router.push(`/supadmin/${supadminId}/userLists/teachersLists/${teacherId}`);
        } else {
          setError(data?.error || "更新失敗，請重試。");
        }
      });
    });
  };

  console.log("teacher_update_form : ", teacher_update_form.formState.errors, " -- End --");

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
    <div className="min-h-screen bg-gray-100 pt-20 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-xl font-semibold text-[#e7915b] mb-6">編輯教師資料</h2>
        <Form {...teacher_update_form}>
          <form onSubmit={teacher_update_form.handleSubmit(teacher_update_form_onSubmit)} className="space-y-6">
            <FormError message={error} />
            <FormSuccess message={success} />
            <FormField
              control={teacher_update_form.control}
              name="teacherid"
              render={({ field }) => (
                <FormItem hidden>
                  <FormControl>
                    <Input {...field} disabled value={teacherId} type="text" />
                  </FormControl>
                  <FormMessage className="text-cyan-200" />
                </FormItem>
              )}
            />
            <FormField
              control={teacher_update_form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black font-medium">用戶名稱</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入用戶名稱"
                      type="text"
                      className="border-0 bg-white text-[#e7915b] placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-200"
                    />
                  </FormControl>
                  <FormMessage className="text-cyan-200" />
                </FormItem>
              )}
            />
            <FormField
              control={teacher_update_form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black font-medium">暱稱</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入暱稱"
                      type="text"
                      className="border-0 bg-white text-[#e7915b] placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-200"
                    />
                  </FormControl>
                  <FormMessage className="text-cyan-200" />
                </FormItem>
              )}
            />
            <FormField
              control={teacher_update_form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black font-medium">電郵</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入電郵"
                      type="email"
                      className="border-0 bg-white text-[#e7915b] placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-200"
                    />
                  </FormControl>
                  <FormMessage className="text-cyan-200" />
                </FormItem>
              )}
            />
            <FormField
              control={teacher_update_form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black font-medium">電話</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入電話"
                      type="tel"
                      className="border-0 bg-white text-[#e7915b] placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-200"
                    />
                  </FormControl>
                  <FormMessage className="text-cyan-200" />
                </FormItem>
              )}
            />
            <FormField
              control={teacher_update_form.control}
              name="staff"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black font-medium">職員</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                      className="border-[#e7915b] data-[state=checked]:bg-[#e7915b] data-[state=checked]:border-[#e7915b]"
                    />
                  </FormControl>
                  <FormMessage className="text-cyan-200" />
                </FormItem>
              )}
            />
            <FormField
              control={teacher_update_form.control}
              name="isadmin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black font-medium">是否管理員</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                      className="border-[#e7915b] data-[state=checked]:bg-[#e7915b] data-[state=checked]:border-[#e7915b]"
                    />
                  </FormControl>
                  <FormMessage className="text-cyan-200" />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              type="submit"
              className="w-full bg-white text-[#e7915b] font-medium hover:bg-cyan-200 hover:text-[#e7915b] transition-colors duration-300"
            >
              {isPending ? "正在提交..." : "更新"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Teacher_Update_Formbysupadmin;