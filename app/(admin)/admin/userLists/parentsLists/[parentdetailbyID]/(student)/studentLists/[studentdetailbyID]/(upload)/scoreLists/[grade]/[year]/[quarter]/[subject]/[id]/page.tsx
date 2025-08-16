// "use client";

// import { useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import Image from 'next/image';

// interface StudentDetailData {
//     name: string;
//     img: string;
//     id : string;
//     grade: string;
//     year: string;
//     quarter: string;
//     subject: string;
// }
// const ScoreLists_Year_Quarter_Subject_List_By_ID = () => {
//     const params = useParams<{ studentdetailbyID : string ; id : string ;parentdetailbyID : string ;  grade : string ; year: string; quarter:string; subject: string;}>();
//     const StudentID = params?.studentdetailbyID as string;
//     const Grade = params?.grade as string;
//     const Year = params?.year as string;
//     const Quarter = params?.quarter as string;
//     const Subject = params?.subject ? decodeURIComponent(params.subject) : '';
//     const Id = params?.id as string;

//     const [ GetStudentScoreDetailByID , setGetStudentScoreDetailByID] = useState<StudentDetailData[]>([]);

//     useEffect(()=>{
//         if(StudentID && Id){
//             const getstudentscoredetailbyid = async (StudentID: string, id: string) => {
//                 try {
//                     const res = await fetch(`/api/student/Student_Score_by_id_Lists_by_id/${StudentID}/${id}`)
//                     if(!res.ok) {
//                         throw new Error("斷線！");
//                     }
//                     const result = await res.json();
//                     setGetStudentScoreDetailByID(result);                    
//                 } catch (error) {
//                     console.error(error)
//                 }
//             };
//             getstudentscoredetailbyid(StudentID , Id)
//         }
//     },[StudentID , Id])


//     console.log(GetStudentScoreDetailByID[0])

//     return(
//         <>
//             <span> ScoreLists_Year_Quarter_Subject_List_By_ID </span>
//             <br />
// {GetStudentScoreDetailByID.map((d)=>{
//     if(d.grade == Grade && d.year == Year && d.quarter == Quarter && d.subject == Subject && d.id == Id) {
//     return(
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

// export default ScoreLists_Year_Quarter_Subject_List_By_ID

"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface StudentDetailData {
    name: string;
    img: string;
    id: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
}

const ScoreLists_Year_Quarter_Subject_List_By_ID = () => {
    const params = useParams<{ 
        studentdetailbyID: string;
        id: string;
        parentdetailbyID: string;
        grade: string;
        year: string;
        quarter: string;
        subject: string;
    }>();
    
    const StudentID = params?.studentdetailbyID as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;
    const Subject = params?.subject ? decodeURIComponent(params.subject) : '';
    const Id = params?.id as string;

    const [GetStudentScoreDetailByID, setGetStudentScoreDetailByID] = useState<StudentDetailData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (StudentID && Id) {
            const getstudentscoredetailbyid = async (StudentID: string, id: string) => {
                try {
                    setIsLoading(true);
                    const res = await fetch(`/api/student/Student_Score_by_id_Lists_by_id/${StudentID}/${id}`);
                    if (!res.ok) {
                        throw new Error("獲取數據失敗！");
                    }
                    const result = await res.json();
                    setGetStudentScoreDetailByID(result);
                } catch (error) {
                    console.error(error);
                    setError(error instanceof Error ? error.message : "發生未知錯誤");
                } finally {
                    setIsLoading(false);
                }
            };
            getstudentscoredetailbyid(StudentID, Id);
        }
    }, [StudentID, Id]);

    const filteredData = GetStudentScoreDetailByID.filter(
        d => d.grade === Grade && 
             d.year === Year && 
             d.quarter === Quarter && 
             d.subject === Subject && 
             d.id === Id
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
                        <span className="text-[#e7915b] animate-pulse">載入中...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-16 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-[#e7915b]">
                                {Subject} 成績詳情
                            </h1>
                            <div className="text-gray-600 mt-2 space-y-1">
                                <div>學生姓名: {filteredData[0]?.name || '無資料'}</div>
                                <div>學年: {Year} | 季度: 第 {Quarter} 季 | 年級: {Grade}</div>
                            </div>
                        </div>

                        {filteredData.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                找不到指定的成績記錄
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="w-full max-w-2xl border border-[#e7915b] rounded-lg p-4 mb-6">
                                    <div className="relative w-full h-96">
                                        <Image
                                            src={filteredData[0].img}
                                            alt={`${filteredData[0].name}的成績單`}
                                            fill
                                            className="object-contain"
                                            priority
                                        />
                                    </div>
                                </div>
                                <div className="w-full max-w-2xl bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#e7915b] mb-2">成績資訊</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-600">學生ID:</p>
                                            <p className="font-medium">{filteredData[0].id}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">科目:</p>
                                            <p className="font-medium">{filteredData[0].subject}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreLists_Year_Quarter_Subject_List_By_ID;