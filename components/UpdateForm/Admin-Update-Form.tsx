
// "use client"


// import * as z from "zod";
// import { useEffect, useState, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useSearchParams } from "next/navigation";

// import { Input } from "@/components/ui/input"; 
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { useParams } from 'next/navigation';

// import { 
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage
//  } from "@/components/ui/form"
// import { Admin_Update_Schema } from "@/actions/Update-Admin/schema";
// import { updateAdmin } from "@/actions/Update-Admin";


// const Admin_Update_Form = () =>{
//     const params = useParams<{admindetailbyID: string}>();
//     const SupAdminID = params?.admindetailbyID as string;

//     const [isPending , startTransition] = useTransition();
//     const [GetSupAdminDetailByID , setGetSupAdminDetailByID] = useState([]);
//     const [ error, setError ] = useState<string | undefined>("");
//     const [ success, setSuccess  ] = useState<string | undefined>("");


//     useEffect(()=>{
//         if(SupAdminID) {
//             const fetchsupadmindetailbyid = async (id: string) => {
//                 try {
//                     const res = await fetch(`/api/SupAdmin_detail_data_by_id/${id}`);
//                     if(!res.ok) {
//                         throw new Error("斷線！");
//                     }
//                     const result = await res.json();
//                     setGetSupAdminDetailByID(result);                    
//                     } catch (error) {
//                         console.error(error);
//                     }
//             };
//             fetchsupadmindetailbyid(SupAdminID)
//         }

//     },[SupAdminID])

//     // console.log(GetSupAdminDetailByID)
//     const [GetUserName , setGetUserName] = useState('');
//     const [GetNickName , setGetNickName] = useState('');
//     const [GetEmail , setGetEmail] = useState('');
//     const [GetPhone , setGetPhone] = useState('');
//     const [GetStaff , setGetStaff] = useState();
//     const [GetIsadmin , setGetIsadmin] = useState();
//     const [GetCram , setGetCram] = useState('');


//     const admin_update_form = useForm<z.infer<typeof Admin_Update_Schema>>({
//         resolver: zodResolver(Admin_Update_Schema),
//         defaultValues:{
//             userid: SupAdminID ,
//             username: GetUserName,
//             nickname: GetNickName,
//             email: GetEmail,
//             phone: GetPhone,
//             staff: GetStaff,
//             isadmin: GetIsadmin,
//             cram: GetCram
//         }
//     })


//     useEffect(()=>{
//         if(GetSupAdminDetailByID && GetSupAdminDetailByID[0] && GetSupAdminDetailByID[0].username){
//             setGetUserName(GetSupAdminDetailByID[0].username);
//             admin_update_form.setValue("username", GetSupAdminDetailByID[0].username);
//         }
//         if(GetSupAdminDetailByID && GetSupAdminDetailByID[0] && GetSupAdminDetailByID[0].nickname){
//             setGetNickName(GetSupAdminDetailByID[0].nickname);
//             admin_update_form.setValue("nickname", GetSupAdminDetailByID[0].nickname);
//         }
//         if(GetSupAdminDetailByID && GetSupAdminDetailByID[0] && GetSupAdminDetailByID[0].email){
//             setGetEmail(GetSupAdminDetailByID[0].email);
//             admin_update_form.setValue("email", GetSupAdminDetailByID[0].email);
//         }
//         if(GetSupAdminDetailByID && GetSupAdminDetailByID[0] && GetSupAdminDetailByID[0].phone){
//             setGetPhone(GetSupAdminDetailByID[0].phone);
//             admin_update_form.setValue("phone", GetSupAdminDetailByID[0].phone);
//         }
//         if(GetSupAdminDetailByID && GetSupAdminDetailByID[0] && GetSupAdminDetailByID[0].Staff){
//             setGetStaff(GetSupAdminDetailByID[0].Staff);
//             admin_update_form.setValue("staff", GetSupAdminDetailByID[0].Staff);
//         }
//         if(GetSupAdminDetailByID && GetSupAdminDetailByID[0] && GetSupAdminDetailByID[0].ISADMIN){
//             setGetIsadmin(GetSupAdminDetailByID[0].ISADMIN);
//             admin_update_form.setValue("isadmin", GetSupAdminDetailByID[0].ISADMIN);
//         }
//         if(GetSupAdminDetailByID && GetSupAdminDetailByID[0] && GetSupAdminDetailByID[0].cram){
//             setGetCram(GetSupAdminDetailByID[0].cram);
//             admin_update_form.setValue("cram", GetSupAdminDetailByID[0].cram);
//         }
//     },[GetSupAdminDetailByID])





//     const admin_update_form_onSubmit = (values:z.infer<typeof Admin_Update_Schema>) =>{
//         console.log("-- admin update輸入 -- : ",values,"-- End --")
//         setError("");
//         setSuccess("");

//         startTransition( async () => {
//         const result = await updateAdmin(values)
//         if (result.error) {
//             setError(result.error);
//           } else {
//             setError("")
//           }
//         } )
//     }

    
//     return(
//         <>
//         Admin_Update_Form
//         <br />
//         {error && <p className="error-message" >{error}</p>}
//         <br />
//         <br />
//         <Form {...admin_update_form} >

//         <form 
//             onSubmit={admin_update_form.handleSubmit(admin_update_form_onSubmit)}
//         className="space-y-6">

//         {GetSupAdminDetailByID.map((d)=>{
//             return(
//                 <>
//             <div className="space-y-4">
//                 <FormField
//                     control={admin_update_form.control}
//                     name="userid"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormControl>
//                         <Input 
//                             {...field}
//                             value={SupAdminID}
//                             type="text"
//                             />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//             </div>
//                 <div className="space-y-4">
//                 <FormField
//                     control={admin_update_form.control}
//                     name="username"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 用戶名稱 </FormLabel>
//                     <FormControl>
//                         <Input 
//                             {...field}
//                             disabled={isPending}
//                             placeholder={d.username}
//                             defaultValue={d.username}
//                             type="text"
//                             />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//             </div>
//             <div className="space-y-4">
//                 <FormField
//                     control={admin_update_form.control}
//                     name="nickname"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 暱稱 </FormLabel>
//                     <FormControl>
//                         <Input 
//                             {...field}
//                             disabled={isPending}
//                             placeholder={d.nickname}
//                             defaultValue={d.nickname}
//                             type="text"
//                             />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//             </div>
//             <div className="space-y-4">
//                 <FormField
//                     control={admin_update_form.control}
//                     name="email"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 電郵 </FormLabel>
//                     <FormControl>
//                         <Input 
//                             {...field}
//                             disabled={isPending}
//                             placeholder={d.email}
//                             defaultValue={d.email}
//                             type="text"
//                             />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//             </div>
//             <div className="space-y-4">
//                 <FormField
//                     control={admin_update_form.control}
//                     name="phone"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 電話 </FormLabel>
//                     <FormControl>
//                         <Input 
//                             {...field}
//                             disabled={isPending}
//                             placeholder={d.phone}
//                             defaultValue={d.phone}
//                             type="number"
//                             />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//             </div>

//             <div className="space-y-4">
//                 <FormField
//                     control={admin_update_form.control}
//                     name="cram"
//                     render={({ field }) => (
//                 <FormItem>
//                     <FormLabel> 分校 </FormLabel>
//                     <FormControl>
//                         <Input 
//                             {...field}
//                             disabled={isPending}
//                             placeholder={d.cram}
//                             defaultValue={d.cram}
//                             type="text"
//                             />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//                     )}
//                 />
//             </div>

//             <div className="space-y-4"
                        
//                     >
//                         <FormField 
//                             control={admin_update_form.control}
//                             name="staff"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel> 職員 </FormLabel>
//                                     <FormControl>
//                                         <Checkbox 
//                                             checked={field.value}
//                                             onCheckedChange={field.onChange}
//                                             defaultValue={d.staff}
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
//                             control={admin_update_form.control}
//                             name="isadmin"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel> 是否ADMIN </FormLabel>
//                                     <FormControl>
//                                         <Checkbox 
//                                             checked={field.value}
//                                             onCheckedChange={field.onChange}
//                                             defaultValue={d.isadmin}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}  
//                         />
//                     </div>
                
//                 </>
//             )
//         })}

// <Button disabled={isPending} type="submit" >

// 更改
// </Button>

// </form>

// </Form>

//         </>
//     )
// }

// export default Admin_Update_Form

"use client";
import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
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
import { Admin_Update_Schema } from "@/actions/Update-Admin/schema";
import { updateAdmin } from "@/actions/Update-Admin";

// 定義 StaffUser 的 TypeScript 類型，與 Prisma 模式對應
interface StaffUser {
  id: string;
  username?: string | null;
  nickname: string;
  email: string;
  phone: string;
  Staff: boolean;
  ISADMIN: boolean;
  cram?: string | null;
}

const Admin_Update_Form = () => {
  const params = useParams<{ admindetailbyID: string }>();
  const SupAdminID = params?.admindetailbyID as string;

  const [isPending, startTransition] = useTransition();
  const [adminData, setAdminData] = useState<StaffUser | null>(null); // 明確指定類型
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  // 獲取管理員數據
  useEffect(() => {
    if (SupAdminID) {
      const fetchSupAdminDetailById = async (id: string) => {
        try {
          const res = await fetch(`/api/SupAdmin_detail_data_by_id/${id}`);
          if (!res.ok) {
            throw new Error("無法連接到服務器！");
          }
          const result = await res.json();
          // 假設 API 返回單個 StaffUser 對象
          setAdminData(result);
        } catch (error) {
          console.error(error);
          setError("無法獲取管理員數據");
        }
      };
      fetchSupAdminDetailById(SupAdminID);
    }
  }, [SupAdminID]);

  // 初始化表單
  const admin_update_form = useForm<z.infer<typeof Admin_Update_Schema>>({
    resolver: zodResolver(Admin_Update_Schema),
    defaultValues: {
      userid: SupAdminID,
      username: "",
      nickname: "",
      email: "",
      phone: "",
      staff: false,
      isadmin: false,
      cram: "",
    },
  });

  // 當 adminData 更新時，設置表單值
  useEffect(() => {
    if (adminData) {
      admin_update_form.reset({
        userid: SupAdminID,
        username: adminData.username ?? "", // 使用 ?? 處理 null 或 undefined
        nickname: adminData.nickname ?? "",
        email: adminData.email ?? "",
        phone: adminData.phone ?? "",
        staff: adminData.Staff ?? false,
        isadmin: adminData.ISADMIN ?? false,
        cram: adminData.cram ?? "",
      });
    }
  }, [adminData, admin_update_form, SupAdminID]);

  // 表單提交處理
  const admin_update_form_onSubmit = (values: z.infer<typeof Admin_Update_Schema>) => {
    console.log("-- admin update 輸入 -- : ", values, "-- End --");
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await updateAdmin(values);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("更新成功！");
      }
    });
  };

  return (
    <div className="space-y-6">
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      {success && <p className="text-green-500 text-sm font-medium">{success}</p>}
      <Form {...admin_update_form}>
        <form
          onSubmit={admin_update_form.handleSubmit(admin_update_form_onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={admin_update_form.control}
            name="userid"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#80A8BD] font-medium">用戶 ID</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={SupAdminID}
                    disabled
                    className="bg-gray-100 border-gray-300 text-gray-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={admin_update_form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#80A8BD] font-medium">用戶名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入用戶名稱"
                    className="border-gray-300 focus:ring-[#80A8BD] focus:border-[#80A8BD]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={admin_update_form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#80A8BD] font-medium">暱稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入暱稱"
                    className="border-gray-300 focus:ring-[#80A8BD] focus:border-[#80A8BD]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={admin_update_form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#80A8BD] font-medium">電郵</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入電郵"
                    type="email"
                    className="border-gray-300 focus:ring-[#80A8BD] focus:border-[#80A8BD]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={admin_update_form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#80A8BD] font-medium">電話</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入電話號碼"
                    type="tel"
                    className="border-gray-300 focus:ring-[#80A8BD] focus:border-[#80A8BD]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={admin_update_form.control}
            name="cram"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#80A8BD] font-medium">分校</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入分校名稱"
                    className="border-gray-300 focus:ring-[#80A8BD] focus:border-[#80A8BD]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={admin_update_form.control}
            name="staff"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                    className="border-gray-300 text-[#80A8BD]"
                  />
                </FormControl>
                <FormLabel className="text-[#80A8BD] font-medium">職員</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={admin_update_form.control}
            name="isadmin"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                    className="border-gray-300 text-[#80A8BD]"
                  />
                </FormControl>
                <FormLabel className="text-[#80A8BD] font-medium">是否 ADMIN</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-[#80A8BD] text-white hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            {isPending ? "正在提交..." : "更改"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Admin_Update_Form;