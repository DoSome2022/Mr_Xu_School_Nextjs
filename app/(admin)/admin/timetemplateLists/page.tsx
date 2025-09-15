// "use client";

// import Link from "next/link";
// import React ,{ useEffect, useState } from "react";

// interface DayData {
//     date:string;
//     start_time:string;
//     end_time:string;
//     lesson:string;
// }

// interface Weekdays{
//     date:string;
//     start_time:string;
//     end_time:string;
//     lesson:string;
// }


// interface TimeTemplateData{
//     id: string;
//     publicholiday_model:{
//         [porp:number]:string;
//     };
//     title: string;
//     day_start: string;
//     day_end:string;
//     start_time:string;
//     end_time:string;
//     weekdays:Weekdays[];
//     days:DayData[];
//     grade:number;
//     lesson:string;
// }


// const TimeTemplateLists :React.FC=()=>{
//     const [GetTimeTempList, setGetTimeTempList] = useState<TimeTemplateData[]>([]);

//         const fetchtimetemp = async (): Promise<void> => {
//             try {
//             const res = await fetch('/api/TimeTemplate_Lists');
//             if(!res) {
//                 throw new Error("斷線！")
//             }    
//             const result = await res.json()
//             console.log(result)
//             setGetTimeTempList(result);


//             } catch (error) {
//                 console.error('Fetch error:', error);  
//             }


//         }
        

//     useEffect(()=>{
// fetchtimetemp()

//     },[])
//     console.log("GetTimeTempList : ",GetTimeTempList)


//     return(
//         <>
//         <Link href={"/admin/timetemplateLists/createtimetemp"} >
//         createtimetemp
//         </Link>
//         <br />

//         TimeTemplateLists

//         {GetTimeTempList?.map((d)=>{
//             return(
//                 <>
//                 <br />
//                 <Link href={`/admin/timetemplateLists/${d.id}`}>
//                     {d.title}
//                 </Link>
//                 <br />
//                 </>
//             )
//         })}
//         </>
//     )
// }

// export default TimeTemplateLists

"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

interface DayData {
    date: string;
    start_time: string;
    end_time: string;
    lesson: string;
}

interface Weekdays {
    date: string;
    start_time: string;
    end_time: string;
    lesson: string;
}

interface TimeTemplateData {
    id: string;
    publicholiday_model: {
        [porp: number]: string;
    };
    title: string;
    day_start: string;
    day_end: string;
    start_time: string;
    end_time: string;
    weekdays: Weekdays[];
    days: DayData[];
    grade: number;
    lesson: string;
}

const TimeTemplateLists: React.FC = () => {
    const [GetTimeTempList, setGetTimeTempList] = useState<TimeTemplateData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchtimetemp = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/TimeTemplate_Lists');
            if (!res.ok) {
                throw new Error("獲取數據失敗！");
            }
            const result = await res.json();
            setGetTimeTempList(result);
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error instanceof Error ? error.message : "發生未知錯誤");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchtimetemp();
    }, []);

    console.log("GetTimeTempList : ", GetTimeTempList);

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
                        <span className="text-[#e7915b] animate-pulse">載入時間模板中...</span>
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
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-[#e7915b]">時間模板列表</h1>
                            <Link 
                                href="/admin/timetemplateLists/createtimetemp"
                                className="bg-[#e7915b] hover:bg-[#d9824c] text-white px-4 py-2 rounded-md transition-colors duration-300"
                            >
                                創建新模板
                            </Link>
                        </div>

                        {GetTimeTempList.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                目前沒有任何時間模板
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {GetTimeTempList.map((d) => (
                                    <Link
                                        key={d.id}
                                        href={`/admin/timetemplateLists/${d.id}`}
                                        className="block p-6 border-2 border-[#e7915b] rounded-lg hover:bg-[#e7915b] hover:text-white transition-colors duration-300"
                                    >
                                        <h3 className="text-lg font-medium">{d.title}</h3>
                                        <div className="mt-2 text-sm">
                                            <p>開始日子: {d.day_start}</p>
                                            <p>結束日期: {d.day_end}</p>
                                            {/* <p>適用年級: {d.grade}</p> */}
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

export default TimeTemplateLists;