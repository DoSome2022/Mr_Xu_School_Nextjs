"use client";

import Student_EX_Page_Create_Formbysupadminbysupadmin from "@/components/CreateForm/SUPADMIN/UploadForm/student/Sup-Student-EX-Pager-Create-Form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface StudentData {
  id: string;
  name: string;
  grade: number;
  school: string; // 修改為 school，與 API 響應一致
  img?: string; // 添加 img 字段，為圖片與 PDF 分類做準備
  BookList?: any[]; // 可選字段，根據需要擴展
  EX_Paper?: any[]; // 可選字段，根據需要擴展

}

const Student_ExpageLists_uploadbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;

  const [GetStudentData, setGetStudentData] = useState<StudentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("params : ", params, " -- End -- ");

  useEffect(() => {
    if (StudentID && StudentID.trim() !== "") {
      const fetchStudentData = async (studentID: string) => {
        try {
          setIsLoading(true);
          setError(null);
          console.log("請求 URL:", `/api/student/Student_Lists_detail_data_by_id/${studentID}`);
          const res = await fetch(`/api/student/Student_Lists_detail_data_by_id/${studentID}`, {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" },
          });
          if (!res.ok) {
            const errorText = await res.text();
            console.error("API 請求失敗:", { status: res.status, statusText: res.statusText, errorText });
            throw new Error(`獲取學生數據失敗：${res.statusText}`);
          }
          const result = await res.json();
          console.log("inuseEffectData : ", result);
          if (!Array.isArray(result)) {
            throw new Error("無效的數據格式：預期為陣列");
          }
          // 驗證數據結構
          if (
            !result.every(
              (item: any) =>
                typeof item.id === "string" &&
                typeof item.name === "string" &&
                typeof item.grade === "number" &&
                typeof item.school === "string" // 修改為 school
            )
          ) {
            console.error("驗證失敗的數據:", result);
            throw new Error("無效的學生數據格式");
          }
          setGetStudentData(result);
        } catch (error) {
          console.error("載入學生數據錯誤:", error);
          const errorMessage = error instanceof Error ? error.message : "發生未知錯誤";
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };
      fetchStudentData(StudentID);
    } else {
      setError("無效的學生ID");
      setIsLoading(false);
    }
  }, [StudentID]);

  // 將 console.log 移到渲染邏輯中，確保捕捉最新狀態
  useEffect(() => {
    console.log("studentDAta : ", GetStudentData, "-- End --");
  }, [GetStudentData]);

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || supadminId.trim() === "" || ParentID.trim() === "" || StudentID.trim() === "") {
    return (
      <div className="flex items-center bg-red-50 text-red-600 p-4 rounded-lg">
        <svg
          className="h-5 w-5 text-red-500 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        錯誤：缺少必要路由參數
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#80A8BD]"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center bg-red-50 text-red-600 p-4 rounded-lg">
        <svg
          className="h-5 w-5 text-red-500 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        錯誤：{error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">
      <Student_EX_Page_Create_Formbysupadminbysupadmin studentId={StudentID} data={GetStudentData} />
    </div>
  );
};

export default Student_ExpageLists_uploadbysupadmin;

// "use client";


// import Student_EX_Page_Create_Formbysupadminbysupadmin from "@/components/CreateForm/SUPADMIN/UploadForm/student/Sup-Student-EX-Pager-Create-Form";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// interface StudentData {
//   id: string;
//   name: string;
//   grade: number;
//   school_name: string; // 改為 school_name，與 SchoolData 和後端一致
// }

// const Student_ExpageLists_uploadbysupadmin = () => {
//   const params = useParams<{
//     supadminid: string;
//     parentdetailbyID: string;
//     studentdetailbyID: string;
//   }>();
//   const supadminId = params?.supadminid;
//   const ParentID = params?.parentdetailbyID;
//   const StudentID = params?.studentdetailbyID;

//   const [GetStudentData, setGetStudentData] = useState<StudentData[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

// console.log(" params : ",params, " -- End -- ")

//   useEffect(() => {
//     if (StudentID) {
//       const fetchStudentData = async (StudentID: string) => {
//         try {
//           setIsLoading(true);
//           const res = await fetch(`/api/student/Student_Lists_detail_data_by_id/${StudentID}`, {
//             cache: "no-store",
//             headers: {
//               "Cache-Control": "no-cache",
//             },
//           });
//           if (!res.ok) {
//             throw new Error(`獲取學生數據失敗：${res.statusText}`);
//           }
//           const result = await res.json();
//           console.log(" inuseEffectData : ",result);
//           if (!Array.isArray(result)) {
//             throw new Error("無效的數據格式：預期為陣列");
//           }
//           // 驗證數據結構
//           if (
//             !result.every(
//               (item: any) =>
//                 typeof item.id === "string" &&
//                 typeof item.name === "string" &&
//                 typeof item.grade === "number" &&
//                 typeof item.school_name === "string" // 假設 API 返回 school_name
//             )
//           ) {
//             throw new Error("無效的學生數據格式");
//           }
//           setGetStudentData(result);
//         } catch (error) {
//           console.error("載入學生數據錯誤:", error);
//           const errorMessage = error instanceof Error ? error.message : "發生未知錯誤";
//           setError(errorMessage);
//           toast.error(errorMessage);
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       fetchStudentData(StudentID);
//     }
//   }, [StudentID]);

// console.log(" studentDAta : " , GetStudentData , "-- End --")

//   // 驗證路由參數
//   if (!supadminId || !ParentID || !StudentID) {
//     return (
//       <div className="flex items-center bg-red-50 text-red-600 p-4 rounded-lg">
//         <svg
//           className="h-5 w-5 text-red-500 mr-3"
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path
//             fillRule="evenodd"
//             d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//             clipRule="evenodd"
//           />
//         </svg>
//         錯誤：缺少必要路由參數
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#80A8BD]"></div>
//           <p className="mt-4 text-gray-600">載入中...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center bg-red-50 text-red-600 p-4 rounded-lg">
//         <svg
//           className="h-5 w-5 text-red-500 mr-3"
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path
//             fillRule="evenodd"
//             d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//             clipRule="evenodd"
//           />
//         </svg>
//         錯誤：{error}
//       </div>
//     );
//   }

  

//   return (
//     <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">
//       <Student_EX_Page_Create_Formbysupadminbysupadmin studentId={StudentID} data={GetStudentData} />
//     </div>
//   );
// };

// export default Student_ExpageLists_uploadbysupadmin;


