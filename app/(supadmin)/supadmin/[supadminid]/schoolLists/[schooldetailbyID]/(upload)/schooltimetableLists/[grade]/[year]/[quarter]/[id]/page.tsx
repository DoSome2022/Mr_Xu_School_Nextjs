"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";

interface SchoolTimeTable {
    name: string;
    img: string;
    grade: number;
    quarter: number;
    year: string;
    schooldetailbyID:string;
}

const SchoolTimeTableLists_Grade_Year_Quarter_Subject_extimelists_Detailbysupadmin = () =>{
    const params = useParams<{grade : string; year : string; quarter: string; id:string; schooldetailbyID:string;supadminid:string;}>();
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);
    const SchoolId = params?.schooldetailbyID  as string;
    const GradeId = params?.grade as string;
    const YearId = params?.year as string;
    const QuarterId = params?.quarter as string;
    const SchoolTimeTableListById = params?.id as string;

    const [ GetSchoolTimeTableListDetailDataById , setGetSchoolTimeTableListDetailDataById ] = useState<SchoolTimeTable[]>([]);


    useEffect(() =>{
        if(SchoolId && YearId && GradeId && QuarterId &&  SchoolTimeTableListById) {
            const getSchoolTimeTableListsDetailById = async (SchoolId: string ,yearId:string , GradeId:string ,QuarterId:string,SchoolTimeTableListById:string ) => {
                try {
                const res = await fetch(`/api/Schooltimetablelists_detail_data_by_id/${SchoolId}/${GradeId}/${yearId}/${QuarterId}/${SchoolTimeTableListById}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
                if(!res.ok) {
                    throw new Error("斷線！");
                }
                const result = await res.json();
                setGetSchoolTimeTableListDetailDataById(result);                    
                } catch (error) {
                    console.error(error);
                }
            };
            getSchoolTimeTableListsDetailById(SchoolId,YearId,GradeId,QuarterId,SchoolTimeTableListById);
        }
    },[SchoolId,YearId,GradeId,QuarterId,SchoolTimeTableListById] )


  // 下載圖片的功能
  const handleDownload = async (imgUrl: string, fileName: string) => {
    try {
    //   const response = await fetch(imgUrl, { mode: "cors" });
    const response = await fetch(`/api/proxy-image?img=${encodeURIComponent(imgUrl)}`);
      if (!response.ok) {
        throw new Error("無法下載圖片");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "schooltimetable-image.jpg"; // 使用書單名稱或默認文件名
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("下載圖片失敗:", error);
      alert("下載圖片失敗，請稍後再試");
    }
  };


    console.log(GetSchoolTimeTableListDetailDataById)

    return(
        <>
            {/* {GetSchoolTimeTableListDetailDataById.map((d)=>{
                if(d.grade  == Number(GradeId) && d.year == YearId && d.quarter == Number(QuarterId) && d.schooldetailbyID == SchoolTimeTableListById){
                                return(
                                    <>
                                    name:{d.name}
                
                                    <br />
                
                                    {
                                        d.img && (
                                            <Image width={500} height={500} src={d.img} alt="" />
                                        )
                
                                    }
                                    </>
                                )                    
                }

            })} */}

                    <div className="container mx-auto px-4 py-8">
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
        <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/schooltimetableLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學校名
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {GradeId}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}/${YearId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {YearId}
        </Link>
        <span className="mx-2">/</span>
                <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}/${YearId}/${QuarterId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {QuarterId}
        </Link>
        <span className="mx-2">/</span>
        <span>{GetSchoolTimeTableListDetailDataById[0].name}</span>
      </nav>
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
                <button
                  onClick={() => handleDownload(d.img, `${d.name}.jpg`)}
                  className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                >
                  下載圖片
                </button>

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
        </>
    )
}

export default SchoolTimeTableLists_Grade_Year_Quarter_Subject_extimelists_Detailbysupadmin