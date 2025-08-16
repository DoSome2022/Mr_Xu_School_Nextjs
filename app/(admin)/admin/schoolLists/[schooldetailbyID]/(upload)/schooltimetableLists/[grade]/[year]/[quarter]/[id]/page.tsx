"use client";
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";

interface SchoolTimeTable {
    name: string;
    img: string;
    grade: number;
    quarter: number;
    year: string;
    schooldetailbyID: string;
}

const SchoolTimeTableLists_Grade_Year_Quarter_Subject_extimelists_Detail = () => {
    const params = useParams<{grade: string; year: string; quarter: string; id: string; schooldetailbyID: string}>();

    const SchoolId = params?.schooldetailbyID as string;
    const GradeId = params?.grade as string;
    const YearId = params?.year as string;
    const QuarterId = params?.quarter as string;
    const SchoolTimeTableListById = params?.id as string;

    const [GetSchoolTimeTableListDetailDataById, setGetSchoolTimeTableListDetailDataById] = useState<SchoolTimeTable[]>([]);

    useEffect(() => {
        if(SchoolId && YearId && GradeId && QuarterId && SchoolTimeTableListById) {
            const getSchoolTimeTableListsDetailById = async (SchoolId: string, yearId: string, GradeId: string, QuarterId: string, SchoolTimeTableListById: string) => {
                try {
                    const res = await fetch(`/api/Schooltimetablelists_detail_data_by_id/${SchoolId}/${GradeId}/${yearId}/${QuarterId}/${SchoolTimeTableListById}`);
                    if(!res.ok) {
                        throw new Error("請求失敗！");
                    }
                    const result = await res.json();
                    setGetSchoolTimeTableListDetailDataById(result);                    
                } catch (error) {
                    console.error("獲取數據時出錯:", error);
                }
            };
            getSchoolTimeTableListsDetailById(SchoolId, YearId, GradeId, QuarterId, SchoolTimeTableListById);
        }
    }, [SchoolId, YearId, GradeId, QuarterId, SchoolTimeTableListById]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">課程時間表詳細資料</h1>
                
                {GetSchoolTimeTableListDetailDataById.map((d, index) => {
                    if(d.grade == Number(GradeId) && d.year == YearId && d.quarter == Number(QuarterId) && d.schooldetailbyID == SchoolTimeTableListById) {
                        return (
                            <div key={index} className="space-y-4">
                                <div className="border-b pb-4">
                                    <h2 className="text-xl font-semibold text-gray-700">{d.name}</h2>
                                    <div className="text-sm text-gray-500 mt-1">
                                        年級: {d.grade}年級 | 學年: {d.year} | 季度: 第{d.quarter}季度
                                    </div>
                                </div>
                                
                                {d.img && (
                                    <div className="mt-4">
                                        <div className="text-sm font-medium text-gray-700 mb-2">時間表圖片:</div>
                                        <div className="border rounded-lg overflow-hidden">
                                            <Image 
                                                width={800} 
                                                height={600} 
                                                src={d.img} 
                                                alt={`${d.name} 時間表`}
                                                className="w-full h-auto object-contain"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }
                    return null;
                })}

                {GetSchoolTimeTableListDetailDataById.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        沒有找到相關的時間表資料
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchoolTimeTableLists_Grade_Year_Quarter_Subject_extimelists_Detail;