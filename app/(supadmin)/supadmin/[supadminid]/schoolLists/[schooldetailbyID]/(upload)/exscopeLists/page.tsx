// "use client";

// import useSWR from "swr";

// import { useParams } from 'next/navigation';

// import Link from "next/link";

// import {  useEffect, useState } from "react";

// // 定義年級對應對象
// const gradeMapping:{[key:string]:string} = {
//     "1": "小學1年級",
//     "2": "小學2年級",
//     "3": "小學3年級",
//     "4": "小學4年級",
//     "5": "小學5年級",
//     "6": "小學6年級",
//     "7": "初中1年級",
//     "8": "初中2年級",
//     "9": "初中3年級",
//     "10": "高中1年級",
//     "11": "高中2年級",
//     "12": "高中3年級",
//   };

//   interface StudentSchoolGrade{
//     school_grade: string
// }

// interface SchoolData {
//     school_name: string;
// }

// const fetcher = (url: string, init?: RequestInit):Promise<StudentSchoolGrade[]>  => fetch(url, init).then((res) => res.json());
// const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"

// const ExScopeListsbysupadmin = () =>{

//    const [ getschooldata , setgetschooldata ] = useState<SchoolData[] | null>(null);
//     const apiUrl_nextjs = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:3000";


//     const params = useParams();
//     const supadminid = params?.supadminid as string;
//     console.log("supadminid :", supadminid);
//     const SchoolId = params?.schooldetailbyID  as string;

//     const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolgrades/` , fetcher);



//         useEffect(() => {
//             if (SchoolId) {
//               const fetchSchoolData = async (id: string) => {
//                 try {
//                   const res = await fetch(`${apiUrl_nextjs}/api/School_Lists_by_id/${id}`);
//                   if (!res.ok) {
//                     throw new Error("斷線！");
//                   }
//                   const result = await res.json();
//                   setgetschooldata(result);
//                 } catch (error) {
//                   console.error(error);
//                 }
//               }
//             fetchSchoolData(SchoolId)
    
//             }
//         }, [SchoolId]);
    
    
//     if(error) return <> error : {error} </>
//     if(isLoading) return <> 載入中 .... </>
//       // 確保 data 是陣列
//     if (!data || !Array.isArray(data)) {
//         return <div className="p-4 text-red-500">無效的資料格式</div>;
//     }



//       console.log("getschooldata : ", getschooldata)

// const SchoolName = getschooldata && getschooldata[0] ? getschooldata[0].school_name : undefined;

//   console.log("SchoolName :" , SchoolName)
    
    
//     console.log(data)


//     return(
//         <>
// {/* 
//             <span>考試範圍</span>

//             <br />
//                     <Link className="text-stone-950 hover:text-gray-700"  
//                         href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/exscopeLists/upload`}
//                     >
//                         上傳考試卷
//                     </Link>
//                     <br />


//             {data.map((grades) => {
//                 return(
//                     <>
//             <br />
//                 <Link className="text-stone-950 hover:text-gray-700" 
//                     href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/exscopeLists/${grades.school_grade}`}
//                 >
//                 {gradeMapping[grades.school_grade]}
//                 </Link>
//             <br />
//                     </>
//                 )
//             })} */}

//     <div className="min-h-screen bg-gray-100 pt-20">
//                                   {/* 麵包屑導航 */}
//       <nav className="mb-4 text-sm">
//         <Link href={`/supadmin/${supadminid}`} className="text-blue-600 hover:text-blue-800">
//           主理員主頁
//         </Link>
//         <span className="mx-2">/</span>
//         <Link href={`/supadmin/${supadminid}/schoolLists`} className="text-blue-600 hover:text-blue-800">
//           學枚列表
//         </Link>
//         <span className="mx-2">/</span>
//             <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}`} className="text-blue-600 hover:text-blue-800">
//           學枚資料
//         </Link>

//         <span className="mx-2">/</span> 
//         <span>{SchoolName}</span>
//       </nav>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h1 className="text-2xl font-bold text-gray-800 mb-6">考試範圍</h1>

//           <Link
//             href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/exscopeLists/upload`}
//             className="inline-block mb-6 px-4 py-2 bg-[#80A8BD] text-white rounded-md hover:bg-[#d17a4a] transition-colors duration-300"
//           >
//             上傳考試卷
//           </Link>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {data.map((grades) => (
//               <Link
//                 key={grades.school_grade}
//                 href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/exscopeLists/${grades.school_grade}`}
//                 className="block p-4 bg-gray-50 rounded-md hover:bg-[#80A8BD] hover:text-white transition-colors duration-300 text-gray-800 font-medium text-center"
//               >
//                 {gradeMapping[grades.school_grade]}
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>




//         </>
//     )
// }

// export default ExScopeListsbysupadmin


"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

// 定義年級對應對象
const gradeMapping: { [key: string]: string } = {
  "1": "小學1年級",
  "2": "小學2年級",
  "3": "小學3年級",
  "4": "小學4年級",
  "5": "小學5年級",
  "6": "小學6年級",
  "7": "初中1年級",
  "8": "初中2年級",
  "9": "初中3年級",
  "10": "高中1年級",
  "11": "高中2年級",
  "12": "高中3年級",
};

// 定義型別，與後端 API 和 Prisma 模型對應
interface StudentSchoolGrade {
  id: number;
  school_grade: number;
}

interface SchoolData {
  school_name: string;
}

const fetcher = (url: string, init?: RequestInit): Promise<StudentSchoolGrade[]> =>
  fetch(url, {
    ...init, // 保留傳入的 init 配置（若有）
    cache: 'no-store', // 強制不快取，確保每次請求新數據
    headers: {
      ...init?.headers, // 合併傳入的 headers（若有）
      'Cache-Control': 'no-cache', // 設置快取控制頭部
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`請求失敗：${res.statusText}`);
    }
    return res.json();
  });

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const ExScopeListsbysupadmin = () => {
  const [getschooldata, setgetschooldata] = useState<SchoolData[] | null>(null);
  const apiUrl_nextjs = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:3000";

  const params = useParams<{ supadminid: string; schooldetailbyID: string }>();
  const supadminid = params?.supadminid;
  const SchoolId = params?.schooldetailbyID;

  // 驗證路由參數
  if (!supadminid || !SchoolId) {
    return (
      <div className="p-4 text-red-500">錯誤：缺少必要路由參數（supadminid 或 schooldetailbyID）</div>
    );
  }

  const { data, error, isLoading } = useSWR(`${apiUrl}/api/School_data/schoolgrades/`, fetcher);

  // 獲取學校資料
  useEffect(() => {
    const fetchSchoolData = async (id: string) => {
      try {
        const res = await fetch(`${apiUrl_nextjs}/api/School_Lists_by_id/${id}`);
        if (!res.ok) {
          throw new Error("無法連接到伺服器");
        }
        const result = await res.json();
        setgetschooldata(result);
      } catch (error) {
        console.error("獲取學校資料失敗：", error);
      }
    };

    if (SchoolId) {
      fetchSchoolData(SchoolId);
    }
  }, [SchoolId, apiUrl_nextjs]);

  // 錯誤處理
  if (error) {
    return <div className="p-4 text-red-500">錯誤：{error.message || "無法載入資料"}</div>;
  }

  // 載入中
  if (isLoading || !getschooldata) {
    return <div className="p-4 text-gray-600">載入中...</div>;
  }

  // 確保 data 是陣列
  if (!data || !Array.isArray(data)) {
    return <div className="p-4 text-red-500">無效的資料格式</div>;
  }

  // 提取學校名稱
  const SchoolName = getschooldata && getschooldata[0] ? getschooldata[0].school_name : "未知學校";

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm px-4 sm:px-6 lg:px-8">
        <Link href={`/supadmin/${supadminid}`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/supadmin/${supadminid}/schoolLists`} className="text-blue-600 hover:text-blue-800">
          學校列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學校資料
        </Link>
        <span className="mx-2">/</span>
        <span>{SchoolName}</span>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">考試範圍</h1>

          <Link
            href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/exscopeLists/upload`}
            className="inline-block mb-6 px-4 py-2 bg-[#80A8BD] text-white rounded-md hover:bg-[#d17a4a] transition-colors duration-300"
          >
            上傳考試範圍
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((grades) => {
              // 確保 school_grade 是有效的數字或字符串
              const schoolGrade = grades.school_grade;
              
              // 檢查 schoolGrade 是否有效
              if (schoolGrade === null || schoolGrade === undefined || isNaN(Number(schoolGrade))) {
                console.warn(`無效的 school_grade: ${schoolGrade}`);
                return null;
              }
              
              // 轉換為字符串
              const gradeString = schoolGrade.toString();
              
              // 檢查 gradeMapping 中是否存在對應的年級
              if (!gradeMapping[gradeString]) {
                console.warn(`無效的年級代碼: ${gradeString}`);
                return null;
              }

              return (
                <Link
                  key={gradeString}
                  href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/exscopeLists/${gradeString}`}
                  className="block p-4 bg-gray-50 rounded-md hover:bg-[#80A8BD] hover:text-white transition-colors duration-300 text-gray-800 font-medium text-center"
                >
                  {gradeMapping[gradeString]}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExScopeListsbysupadmin;