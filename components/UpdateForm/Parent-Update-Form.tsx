
// "use client"


// import * as z from "zod";
// import { useState, useTransition, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useSearchParams } from "next/navigation";

// import { Input } from "@/components/ui/input"; 

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
// import { Parent_Update_Schema } from "@/actions/Update-Parent/schema";
// import { updateParent } from "@/actions/Update-Parent";


// const Parent_Update_Form = () =>{

//     //這個是由user db開始出發拉下去直到parent data
//     const [GetParentData , setGetParentData] = useState([]);

//     const params = useParams();
//     const ParentId = params?.parentdetailbyID as string;

//     const [isPending , startTransition] = useTransition();
//     const [ error, setError ] = useState<string | undefined>("");
//     const [ success, setSuccess  ] = useState<string | undefined>("");

//       //拿 parent data
//       useEffect(() => {
//         if(ParentId){
//             const fetchParentsData = async (userId :string) =>{
//                 //在app/api/other/User_Parent/route.ts
//                 const res = await fetch(`/api/other/User_Parent/${userId}`);
//                 if(!res){
//                     throw new Error("斷線！")
//                 }
//                const result = await res.json();
//                setGetParentData(result)
//             }
//             fetchParentsData(ParentId)
//             }
//     },[ParentId])


//     // console.log(GetParentData)

//     const [ UserName , setUserName ] = useState('');
//     const [ NickName , setNickName ] = useState('');
//     const [ Email , setEmail ] = useState('');
//     const [ Phone , setPhone ] = useState('');



//     const parent_update_form = useForm<z.infer<typeof Parent_Update_Schema>>({
//         resolver: zodResolver(Parent_Update_Schema),
//         defaultValues:{
//             userid : ParentId,
//             username: UserName,
//             nickname: NickName,
//             email: Email,
//             phone: Phone,
//         }
//     })

//     useEffect(()=>{
//         if(GetParentData && GetParentData[0] && GetParentData[0].username){
//             setUserName(GetParentData[0].username);
//             parent_update_form.setValue("username", GetParentData[0].username);
//         }
//         if(GetParentData && GetParentData[0] && GetParentData[0].nickname){
//             setNickName(GetParentData[0].nickname);
//             parent_update_form.setValue("nickname", GetParentData[0].nickname);
//         }
//         if(GetParentData && GetParentData[0] && GetParentData[0].email){
//             setEmail(GetParentData[0].email);
//             parent_update_form.setValue("email", GetParentData[0].email);
//         }
//         if(GetParentData && GetParentData[0] && GetParentData[0].phone){
//             setPhone(GetParentData[0].phone);
//             parent_update_form.setValue("phone", GetParentData[0].phone);
//         }

//      },[GetParentData ])
    

//     const parent_update_form_onSubmit = (values:z.infer<typeof Parent_Update_Schema>) =>{
//         console.log("-- 普通用戶update輸入 -- : ",values,"-- End --")
//         setError("");
//         setSuccess("");

//         startTransition(() => {
//             updateParent(values).then((data) => {
//                 setError(data?.error);
//                 setSuccess(data?.success);
//             })
//         })
//     }

//     return(
//         <>
// <Form {...parent_update_form} >

// <form 
//     onSubmit={parent_update_form.handleSubmit(parent_update_form_onSubmit)}
// className="space-y-6">

// {GetParentData.map((d)=>{

// return(
//     <>
    

// <div className="space-y-4" hidden>
//         <FormField
//             control={parent_update_form.control}
//             name="userid"
//             render={({ field }) => (
//         <FormItem>
//             <FormControl>
//                 <Input 
//                     {...field}
//                     disabled={isPending}
//                     value={ParentId}
//                     type="text"
//                     />
//             </FormControl>
//         </FormItem>
//             )}
//         />
//     </div>

//     <div className="space-y-4">
//         <FormField
//             control={parent_update_form.control}
//             name="username"
//             render={({ field }) => (
//         <FormItem>
//             <FormLabel> 用戶名稱 </FormLabel>
//             <FormControl>
//                 <Input 
//                     {...field}
//                     disabled={isPending}
//                     placeholder={d.username}
//                     defaultValue={d.username}
//                     type="text"
//                     />
//             </FormControl>
//         </FormItem>
//             )}
//         />
//     </div>
//     <div className="space-y-4">
//         <FormField
//             control={parent_update_form.control}
//             name="nickname"
//             render={({ field }) => (
//         <FormItem>
//             <FormLabel> 暱稱 </FormLabel>
//             <FormControl>
//                 <Input 
//                     {...field}
//                     disabled={isPending}
//                     placeholder={d.nickname}
//                     defaultValue={d.nickname}
//                     type="text"
//                     />
//             </FormControl>
//         </FormItem>
//             )}
//         />
//     </div>
//     <div className="space-y-4">
//         <FormField
//             control={parent_update_form.control}
//             name="email"
//             render={({ field }) => (
//         <FormItem>
//             <FormLabel> 電郵 </FormLabel>
//             <FormControl>
//                 <Input 
//                     {...field}
//                     disabled={isPending}
//                     placeholder={d.email}
//                     defaultValue={d.email}
//                     type="text"
//                     />
//             </FormControl>
//         </FormItem>
//             )}
//         />
//     </div>
//     <div className="space-y-4">
//         <FormField
//             control={parent_update_form.control}
//             name="phone"
//             render={({ field }) => (
//         <FormItem>
//             <FormLabel> 電話 </FormLabel>
//             <FormControl>
//                 <Input 
//                     {...field}
//                     disabled={isPending}
//                     placeholder={d.phone}
//                     defaultValue={d.phone}
//                     type="number"
//                     />
//             </FormControl>
//         </FormItem>
//             )}
//         />
//     </div>
// \
    
//     </>
// )
// })}
//     <Button disabled={isPending} type="submit" >

//     更改
//     </Button>

// </form>

// </Form>
//         </>
//     )
// }

// export default Parent_Update_Form


"use client";

import * as z from "zod";
import { useState, useTransition, useEffect } from "react";
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
import { Parent_Update_Schema } from "@/actions/Update-Parent/schema";
import { updateParent } from "@/actions/Update-Parent";

interface ParentData {
  userid: string;
  username: string;
  nickname: string;
  email: string;
  phone: string;
}

const Parent_Update_Form = () => {
  const params = useParams();
  const parentId = params?.parentdetailbyID as string;

  const [parentData, setParentData] = useState<ParentData | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const parent_update_form = useForm<z.infer<typeof Parent_Update_Schema>>({
    resolver: zodResolver(Parent_Update_Schema),
    defaultValues: {
      userid: parentId,
      username: "",
      nickname: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (parentId) {
      const fetchParentData = async (userId: string) => {
        try {
          const res = await fetch(`/api/other/User_Parent/${userId}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
          if (!res.ok) {
            throw new Error("無法連接到伺服器");
          }
          const result = await res.json();
          const data = result[0]; // 假設 API 返回數組且第一項為所需數據
          if (data) {
            setParentData(data);
            parent_update_form.reset({
              userid: parentId,
              username: data.username || "",
              nickname: data.nickname || "",
              email: data.email || "",
              phone: data.phone || "",
            });
          }
        } catch (error) {
          console.error("獲取家長數據失敗:", error);
          setError("無法載入家長數據，請稍後再試");
        }
      };
      fetchParentData(parentId);
    }
  }, [parentId, parent_update_form]);

  const parent_update_form_onSubmit = (values: z.infer<typeof Parent_Update_Schema>) => {
    console.log("-- 家長用戶更新輸入 -- : ", values, "-- End --");
    setError("");
    setSuccess("");
    startTransition(() => {
      updateParent(values).then((data) => {
        setError(data?.error);
        setSuccess(typeof data?.success === "string" ? data?.success : data?.success ? "資料更新成功" : undefined);
      });
    });
  };

  return (
    <Form {...parent_update_form}>
      <form onSubmit={parent_update_form.handleSubmit(parent_update_form_onSubmit)} className="space-y-6">
        {error && <p className="text-cyan-200 text-center">{error}</p>}
        {success && <p className="text-white text-center">{success}</p>}
        {!parentData ? (
          <p className="text-white text-center">正在載入數據...</p>
        ) : (
          <>
            <FormField
              control={parent_update_form.control}
              name="userid"
              render={({ field }) => (
                <FormItem hidden>
                  <FormControl>
                    <Input {...field} disabled value={parentId} type="text" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={parent_update_form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">用戶名稱</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入用戶名稱"
                      type="text"
                      className="border-0 bg-white text-[#80A8BD] placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-200"
                    />
                  </FormControl>
                  <FormMessage className="text-cyan-200" />
                </FormItem>
              )}
            />
            <FormField
              control={parent_update_form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">暱稱</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入暱稱"
                      type="text"
                      className="border-0 bg-white text-[#80A8BD] placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-200"
                    />
                  </FormControl>
                  <FormMessage className="text-cyan-200" />
                </FormItem>
              )}
            />
            <FormField
              control={parent_update_form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">電郵</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入電郵"
                      type="email"
                      className="border-0 bg-white text-[#80A8BD] placeholder:text-gold-400 focus:ring-2 focus:ring-cyan-200"
                    />
                  </FormControl>
                  <FormMessage className="text-cyan-200" />
                </FormItem>
              )}
            />
            <FormField
              control={parent_update_form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">電話</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入電話"
                      type="tel"
                      className="border-0 bg-white text-[#80A8BD] placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-200"
                    />
                  </FormControl>
                  <FormMessage className="text-cyan-200" />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              type="submit"
              className="w-full bg-white text-[#80A8BD] font-medium hover:bg-cyan-200 hover:text-[#80A8BD] transition-colors duration-300"
            >
              更改
            </Button>
          </>
        )}
      </form>
    </Form>
  );
};

export default Parent_Update_Form;