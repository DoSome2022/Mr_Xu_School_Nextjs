// "use client";

// import { useParams } from 'next/navigation';
// import Link from "next/link";
// import { useEffect, useState } from 'react';

// interface StudentName {
//     id:string;
//     name:string;
//     grade:string;
//     year:string;
//     quarter:string;
//     subject:string;
// }
// const ScoreLists_Year_Quarter_Subject_List = () => {
//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ;  grade : string ; year: string; quarter:string; subject: string;}>();
//     const ParentID = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const Grade = params?.grade as string;
//     const Year = params?.year as string;
//     const Quarter = params?.quarter as string;
//     const Subject = params?.subject ? decodeURIComponent(params.subject) : '';

//     const [ GetStudentScoreLists , setGetStudentScoreLists ] = useState<StudentName[]>([]);

//     console.log("params : ", params )

//     useEffect(()=>{
//         if(StudentID){
//             const getstudentscorelists = async (StudentID: string) => {
//                 try {
//                     const res = await fetch(`/api/student/Student_Score_by_id_Lists/${StudentID}`)
//                     if(!res.ok) {
//                         throw new Error("斷線！");
//                     }
//                     const result = await res.json();
//                     setGetStudentScoreLists(result);                    
//                 } catch (error) {
//                     console.error(error)
//                 }
//             };
//             getstudentscorelists(StudentID)
//         }
//     },[StudentID])


//     console.log(GetStudentScoreLists[0])


//     return(
//         <>
//             <span> ScoreLists_Year_Quarter_Subject_List </span>
//             <br />
//             {GetStudentScoreLists.map((d)=>{
//                 if(d.grade == Grade && d.year == Year && d.quarter == Quarter && d.subject == Subject){
//                 return(
//                     <>
//             <br />
//                 <Link className="text-stone-950 hover:text-gray-700" 
//                     href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${Grade}/${Year}/${Quarter}/${Subject}/${d.id}`}
//                 >
//                     名稱: {d.name}
//                 </Link>
//             <br />
//                     </>
//                 )                    
//                 }

//             })}
//         </>
//     )
// }

// export default ScoreLists_Year_Quarter_Subject_List

"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from 'react';


// 定義季度對應對象（從 ScoreLists_Year_Quarterbysupadmin 借用）
const quarterMapping: { [key: string]: string } = {
  "1": "第一季度",
  "2": "第二季度",
  "3": "第三季度",
  "4": "第四季度",
};

// 定義年級對應對象（從 ScoreListsbysupadmin 借用）
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


interface StudentName {
    id: string;
    name: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
}

const ScoreLists_Year_Quarter_Subject_List = () => {
    const params = useParams<{
        parentdetailbyID: string;
        studentdetailbyID: string;
        grade: string;
        year: string;
        quarter: string;
        subject: string;
    }>();
    
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;
    const Subject = params?.subject ? decodeURIComponent(params.subject) : '';

    const [GetStudentScoreLists, setGetStudentScoreLists] = useState<StudentName[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (StudentID) {
            const getstudentscorelists = async (StudentID: string) => {
                try {
                    setIsLoading(true);
                    const res = await fetch(`/api/student/Student_Score_by_id_Lists/${StudentID}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
                    if (!res.ok) {
                        throw new Error("獲取數據失敗！");
                    }
                    const result = await res.json();
                    setGetStudentScoreLists(result);
                } catch (error) {
                    console.error(error);
                    setError(error instanceof Error ? error.message : "發生未知錯誤");
                } finally {
                    setIsLoading(false);
                }
            };
            getstudentscorelists(StudentID);
        }
    }, [StudentID]);

    const filteredData = GetStudentScoreLists.filter(
        d => String(d.grade) === String(Grade) && // 確保比較時為字串
             d.year === Year && 
            String(d.quarter) === String(Quarter)&& // 確保比較時為字串
             d.subject === Subject
    );

    if (error) {
        return (
            <div className="pt-16 min-h-screen bg-gray-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-red-500 font-medium">錯誤: {error}</h2>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="pt-16 min-h-screen bg-gray-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <span className="text-[#80A8BD] animate-pulse">載入中...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-16 min-h-screen bg-gray-50">
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
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生詳情
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          成績表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(Grade)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {gradeMapping[Grade]}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Year}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {quarterMapping[Quarter]}
        </Link>
        <span className="mx-2">/</span>
        <span>{Subject}</span>
      </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-[#80A8BD]">
                                {Subject} 成績列表
                            </h1>
                            <div className="text-gray-600 mt-2">
                                <span className="mr-4">學年: {Year}</span>
                                <span className="mr-4">季度: 第 {Quarter} 季</span>
                                <span>年級: {Grade}</span>
                            </div>
                        </div>

                        {filteredData.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                暫無相關成績記錄
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredData.map((d) => (
                                    <Link
                                        key={d.id}
                                        href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${Grade}/${Year}/${Quarter}/${Subject}/${d.id}`}
                                        className="block p-4 border border-[#80A8BD] rounded-lg hover:bg-[#80A8BD] hover:text-white transition-colors duration-300"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{d.name}</span>
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                className="h-5 w-5" 
                                                viewBox="0 0 20 20" 
                                                fill="currentColor"
                                            >
                                                <path 
                                                    fillRule="evenodd" 
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                                                    clipRule="evenodd" 
                                                />
                                            </svg>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreLists_Year_Quarter_Subject_List;