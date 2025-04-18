"use client";

import { useParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Apply_Accept_Schema } from "@/actions/Apply-Accept/schema";
import { Apply_Reject_Schema } from "@/actions/Apply-Reject/schema";
import { z } from "zod";
import { AcceptApplyClass } from "@/actions/Apply-Accept";
import { RejectApplyClass } from "@/actions/Apply-Reject";

const ApplyDetail = () => {
  const params = useParams();
  const applydetailbyID = params.applydetailbyID as string;
  console.log("param :", params);

  const [GetApplyByIdData, setGetApplyByIdData] = useState<any>({});

  useEffect(() => {
    const fetchApplyByIdData = async (id: string) => {
      try {
        const res = await fetch(`/api/Apply_Lists_By_Id/${id}`);
        if (!res.ok) {
          throw new Error("無法獲取數據");
        }
        const result = await res.json();
        setGetApplyByIdData(result);
      } catch (error) {
        console.error("獲取申請數據失敗:", error);
      }
    };
    fetchApplyByIdData(applydetailbyID);
  }, [applydetailbyID]);

  console.log(" -- ApplyLists -- : ", GetApplyByIdData, " -- end -- ");

  const { title, subject, content, apply, isapply } = GetApplyByIdData;

  const apply_status_Accept = useForm<z.infer<typeof Apply_Accept_Schema>>({
    resolver: zodResolver(Apply_Accept_Schema),
    defaultValues: {
      applyId: applydetailbyID,
    },
  });

  const apply_status_Reject = useForm<z.infer<typeof Apply_Reject_Schema>>({
    resolver: zodResolver(Apply_Reject_Schema),
    defaultValues: {
      applyId: applydetailbyID,
    },
  });

  const apply_status_Accept_onSubmit = (values: z.infer<typeof Apply_Accept_Schema>) => {
    console.log("-- apply_status_Accept_onSubmit -- : ", values, "-- End --");
    startTransition(() => {
      AcceptApplyClass(values);
    });
  };

  const apply_status_Reject_onSubmit = (values: z.infer<typeof Apply_Reject_Schema>) => {
    console.log("-- apply_status_Reject_onSubmit -- : ", values, "-- End --");
    startTransition(() => {
      RejectApplyClass(values);
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">申請詳情</h1>
      <p>標題: {title || "載入中..."}</p>
      <p>主題: {subject || "載入中..."}</p>
      <p>內容: {content || "載入中..."}</p>
      <p>申請狀態: {apply ? "申請中" : "未申請"}</p>
      <p>處理狀態: {isapply ? "已處理" : "未處理"}</p>

      {isapply ? (
        <p className="text-green-600 font-semibold">已處理</p>
      ) : (
        <div className="mt-4 space-y-4">
          <Form {...apply_status_Accept}>
            <form onSubmit={apply_status_Accept.handleSubmit(apply_status_Accept_onSubmit)}>
              <Button type="submit" variant="default">
                接受
              </Button>
            </form>
          </Form>

          <Form {...apply_status_Reject}>
            <form onSubmit={apply_status_Reject.handleSubmit(apply_status_Reject_onSubmit)}>
              <Button type="submit" variant="destructive">
                拒絕
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default ApplyDetail;


// "use client";

// import { useParams } from "next/navigation";
// import { startTransition, useEffect, useState } from "react";

// import { 
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage 
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Apply_Accept_Schema } from "@/actions/Apply-Accept/schema";
// import { z } from "zod";
// import { Apply_Reject_Schema } from "@/actions/Apply-Reject/schema";
// import { AcceptApplyClass } from "@/actions/Apply-Accept";
// import { RejectApplyClass } from "@/actions/Apply-Reject";
// const ApplyDetail = () => {
//     const params = useParams();
    
//     const applydetailbyID = params.applydetailbyID as string ;
//         console.log("param :",params);
//     const [ GetApplyByIdData , setGetApplyByIdData ] = useState([]);

//     useEffect(()=>{
    
//         const fetchApplyByIdData = async (id:string) => {
//             const res = await fetch(`/api/Apply_Lists_By_Id/${id}`);
//             if (!res) {
//                 throw new Error("斷線！");
//             }
//             const result = await res.json();
//             setGetApplyByIdData(result);
//         };
//         fetchApplyByIdData(applydetailbyID);
//     },[applydetailbyID])

//     console.log(" --  ApplyLists -- : ", GetApplyByIdData, " -- end -- ");


//     const title = GetApplyByIdData?.title;
//     const subject = GetApplyByIdData?.subject;
//     const content = GetApplyByIdData?.content;
//     const apply = GetApplyByIdData?.apply;

//     const apply_status_Accept = useForm<z.infer<typeof Apply_Accept_Schema>>({
//         resolver : zodResolver(Apply_Accept_Schema),
//         defaultValues:{
//             applyId: applydetailbyID,
            
//         }
//     })

//     const apply_status_Reject = useForm<z.infer<typeof Apply_Reject_Schema>>({
//         resolver : zodResolver(Apply_Reject_Schema),
//         defaultValues:{
//             applyId: applydetailbyID,
            
//         }
//     })


//     const apply_status_Accept_onSubmit = (values:z.infer<typeof Apply_Accept_Schema>) =>{
//         console.log("-- apply_status_Accept_onSubmit -- : ", values, "-- End --");
//         startTransition(()=>{
//             AcceptApplyClass(values)
//         })
//     }

//     const apply_status_Reject_onSubmit = (values:z.infer<typeof Apply_Reject_Schema>) =>{
//         console.log("-- apply_status_Reject_onSubmit -- : ", values, "-- End --");
//         startTransition(()=>{
//             RejectApplyClass(values)
//         })
//     }


//     return(
//         <>
//             <span>ApplyDetail</span>

//             <span>{title}</span>
//             <br />
//             <span>{subject}</span>
//             <br />
//             <span>{content}</span>
//             <br />
//             <span>{apply}</span>

//             <br />

//             <Form {...apply_status_Accept}>
//                 <form onSubmit={apply_status_Accept.handleSubmit(apply_status_Accept_onSubmit)}>
//                     <Button>接受</Button>
//                 </form>
//             </Form>


//             <Form {...apply_status_Reject}>
//                 <form onSubmit={apply_status_Reject.handleSubmit(apply_status_Reject_onSubmit)}>
//                     <Button>拒絕</Button>
//                 </form>
//             </Form>


//         <br />


//         </>
//     )
// }

// export default ApplyDetail