// "use client";

// import { useParams } from 'next/navigation';
// import { useEffect, useState } from "react";
// import Image from "next/image";

// interface StudentDetailData {
//     name: string;
//     img: string;
//     id: string;
//     school: string;
//     grade: string;
//     quarter: string;
//     subject: string;
// }

// const ExScope_Grade_Quarter_Subject_Lists_By_ID = () => {

//     const params = useParams<{studentdetailbyID : string ; parentdetailbyID:string; school: string; grade: string; quarter: string; subject: string; id: string;}>();
//     const StudentID = params?.studentdetailbyID as string;
//     const Id = params?.id as string;
//     const SchoolName = params?.school as string;
//     const Grade = params?.grade as string;
//     const Quarter = params?.quarter as string;
//     const Subject = params?.subject ? decodeURIComponent(params.subject) : '';

//     const [ GetStudentExScopeDetailByID , setGetStudentExScopeDetailByID] = useState<StudentDetailData[]>([]);


//     useEffect(()=>{
//         if(StudentID && Id){
//             const getstudentexscopedetailbyid = async (StudentID: string ,id: string) => {
//                 try {
//                     const res = await fetch(`/api/student/Student_ExScope_by_id_Lists_by_id/${StudentID}/${id}`)
//                     if(!res.ok) {
//                         throw new Error("斷線！");
//                     }
//                     const result = await res.json();
//                     setGetStudentExScopeDetailByID(result);                    
//                 } catch (error) {
//                     console.error(error)
//                 }
//             };
//             getstudentexscopedetailbyid(StudentID , Id)
//         }
//     },[StudentID , Id])


//     console.log(GetStudentExScopeDetailByID)

//     return(
//         <>


//             <span> ExScope_Grade_Quarter_Subject_Lists_By_ID </span>
//             <br />
// {GetStudentExScopeDetailByID.map((d)=>{
//     if(d.school == SchoolName && d.grade == Grade && d.quarter == Quarter && d.subject == Subject && d.id == Id){
//  return(
//         <>
//         {d.name}
//         <br />
//         <Image 
//                     width={500}
//                     height={500}
//                     src={d.img}
//                     alt=""
//                     />
//         </>
//     )        
//     }
   
// })}
            
//         </>
//     )
// }

// export default ExScope_Grade_Quarter_Subject_Lists_By_ID

"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from 'next/link';

interface StudentDetailData {
    name: string;
    img: string;
    id: string;
    school: string;
    grade: string;
    quarter: string;
    subject: string;
}

const ExScope_Grade_Quarter_Subject_Lists_By_ID = () => {
    const params = useParams<{studentdetailbyID: string; parentdetailbyID: string; school: string; grade: string; quarter: string; subject: string; id: string;}>();
    const StudentID = params?.studentdetailbyID as string;
    const Id = params?.id as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Quarter = params?.quarter as string;
    const Subject = params?.subject ? decodeURIComponent(params.subject) : '';
    const ParentID = params?.parentdetailbyID;


    const [GetStudentExScopeDetailByID, setGetStudentExScopeDetailByID] = useState<StudentDetailData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (StudentID && Id) {
            const getstudentexscopedetailbyid = async (StudentID: string, id: string) => {
                try {
                    setIsLoading(true);
                    const res = await fetch(`/api/student/Student_ExScope_by_id_Lists_by_id/${StudentID}/${id}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
                    if (!res.ok) {
                        throw new Error("獲取資料失敗！");
                    }
                    const result = await res.json();
                    setGetStudentExScopeDetailByID(result);
                } catch (error) {
                    console.error(error);
                    setError(error instanceof Error ? error.message : "發生未知錯誤");
                } finally {
                    setIsLoading(false);
                }
            };
            getstudentexscopedetailbyid(StudentID, Id);
        }
    }, [StudentID, Id]);

    // 過濾符合條件的資料
    const filteredData = GetStudentExScopeDetailByID.filter(d => 
        d.school === SchoolName && 
        String(d.grade) === String(Grade) && 
        String(d.quarter) === String(Quarter) && 
        d.subject === Subject && 
        d.id === Id
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-20"> {/* pt-20 避免內容被 navbar 遮擋 */}
        {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/admin`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/userLists`} className="text-blue-600 hover:text-blue-800">
          用戶列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          考試範圍
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Grade}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}/${Quarter}`}
          className="text-blue-600 hover:text-blue-800"
        >
          第{Quarter}季度
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}/${Quarter}/${Subject}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Subject}
        </Link>
        <span className="mx-2">/</span>
        <span>詳細資料</span>
      </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* 標題欄 - 使用與 navbar 相同的配色 */}
                    <div className="bg-[#80A8BD] px-6 py-4">
                        <h1 className="text-xl font-bold text-white">
                            學生學習範圍詳細資料
                        </h1>
                    </div>

                    {/* 內容區域 */}
                    <div className="p-6">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#80A8BD]"></div>
                                <p className="mt-4 text-gray-600">資料載入中...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-red-700">{error}</span>
                                </div>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                沒有找到符合條件的學生資料
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredData.map((d) => (
                                    <div key={d.id} className="space-y-4">
                                        {/* 學生基本資訊卡片 */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h2 className="text-2xl font-bold text-gray-800">{d.name}</h2>
                                            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                                                <div>
                                                    <span className="font-medium">學校:</span> {d.school}
                                                </div>
                                                <div>
                                                    <span className="font-medium">年級:</span> {d.grade}
                                                </div>
                                                <div>
                                                    <span className="font-medium">季度:</span> 第{d.quarter}季
                                                </div>
                                                <div className="md:col-span-3">
                                                    <span className="font-medium">科目:</span> {d.subject}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 圖片展示區域 */}
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="bg-gray-100 p-3 border-b border-gray-200">
                                                <h3 className="font-medium text-gray-700">學習範圍圖片</h3>
                                            </div>
                                            <div className="p-4 flex justify-center bg-white">
                                                <Image
                                                    width={600}
                                                    height={600}
                                                    src={d.img}
                                                    alt={`${d.name}的學習範圍圖片`}
                                                    className="rounded-md shadow-sm object-contain max-h-[500px]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExScope_Grade_Quarter_Subject_Lists_By_ID;