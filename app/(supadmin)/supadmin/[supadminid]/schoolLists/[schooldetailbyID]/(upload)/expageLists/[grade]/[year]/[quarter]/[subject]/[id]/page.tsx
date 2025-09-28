"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Image from "next/image"; 
import Link from 'next/link';

interface SchoolExPageData {
    name: string;
    img: string;
    school_ex_pager_id: string;
    grade: number;
    subject: string;
    year: string;
    quarter: number;
}
const ExPageLists_grade_year_quarter_subject_expagelists_by_id_bysupadmin = () => {

    const params = useParams<{grade: string; year: string; quarter: string; subject: string, id:string ,schooldetailbyID:string; supadminid:string }>();
    const SchoolId = params?.schooldetailbyID as string;
    const GradeId = params?.grade as string;
    const YearId = params?.year as string;
    const QuarterId = params?.quarter as string;
    const SubjectId = params?.subject ? decodeURIComponent(params.subject) : '';
    const ExPageListById = params?.id as string; // 獲取URL中的Id參數
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);

    const [ GetExPageListDetailDataById , setGetExPageListDetailDataById ] = useState<SchoolExPageData[]>([]);

    useEffect(() =>{
        if(SchoolId && YearId && GradeId && QuarterId && SubjectId && ExPageListById) {
            const getExPageListsDetailById = async (SchoolId: string ,YearId:string , GradeId:string ,QuarterId:string,SubjectId:string,ExPageListById:string ) => {
                try {
                const res = await fetch(`/api/Expagelists_detail_data_by_id/${SchoolId}/${GradeId}/${YearId}/${QuarterId}/${SubjectId}/${ExPageListById}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
                if(!res.ok) {
                    throw new Error("斷線！");
                }
                const result = await res.json();
                setGetExPageListDetailDataById(result);                    
                } catch (error) {
                    console.error(error);
                }
            };
            getExPageListsDetailById(SchoolId,YearId,GradeId,QuarterId,SubjectId,ExPageListById);
        }
    },[SchoolId,YearId,GradeId,QuarterId,SubjectId,ExPageListById] )


      // 定義年級對應對象，與 ExPageLists 和 ExPageLists_year_grade 一致
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

  // 下載圖片的功能
  const handleDownload = async (imgUrl: string, fileName: string) => {
    try {
    //   const response = await fetch(imgUrl, { mode: "cors" });
    const response = await fetch(`/api/proxy-image?img=${encodeURIComponent(imgUrl)}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
      if (!response.ok) {
        throw new Error("無法下載圖片");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "ExPage-image.jpg"; // 使用書單名稱或默認文件名
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("下載圖片失敗:", error);
      alert("下載圖片失敗，請稍後再試");
    }
  };

    console.log(GetExPageListDetailDataById)

    const data = GetExPageListDetailDataById[0];

  if (
    data.grade !== Number(GradeId) ||
    data.quarter !== Number(QuarterId) ||
    data.year !== YearId ||
    data.subject !== SubjectId ||
    data.school_ex_pager_id !== SchoolId
  ) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">考試卷資料不匹配</p>
      </div>
    );
  }



    return(
        <>
            {/* {data.map((d)=>{
                                if(d.grade == Number(GradeId) && d.quarter == Number(QuarterId) && d.year == YearId && d.subject == SubjectId && d.school_ex_pager_id == SchoolId){
                                
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

    <div className="min-h-screen bg-gray-100 pt-20">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/supadmin/${supadminid}`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/supadmin/${supadminid}/schoolLists`} className="text-blue-600 hover:text-blue-800">
          學枚列表
        </Link>
        <span className="mx-2">/</span>
            <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}`} className="text-blue-600 hover:text-blue-800">
          學枚資料
        </Link>
        <span className="mx-2">/</span>
          <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists`} className="text-blue-600 hover:text-blue-800">
          學枚名
        </Link>
        <span className="mx-2">/</span>
                
          <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists/${GradeId}`} className="text-blue-600 hover:text-blue-800">
          {GradeId}
        </Link>

        <span className="mx-2">/</span>
                
          <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}`} className="text-blue-600 hover:text-blue-800">
          {YearId}
        </Link>

        <span className="mx-2">/</span>
                
          <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}/${QuarterId}`} className="text-blue-600 hover:text-blue-800">
          {QuarterId}
        </Link>
        <span className="mx-2">/</span>
                
          <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}/${QuarterId}/${SubjectId}`} className="text-blue-600 hover:text-blue-800">
          {SubjectId}
        </Link>
        <span className="mx-2">/</span>
        <span>{data.name}</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">
            考試卷詳情 - {gradeMapping[GradeId] || GradeId} {YearId} 季度 {QuarterId} {SubjectId}
          </h1>
          <div className="flex space-x-4">
 
            <Link
              href={`/admin/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}/${QuarterId}/${SubjectId}`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回考試卷列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">{data.name}</h2>
          <div className="space-y-4">
            <p className="text-gray-800">
              <span className="font-semibold">年級:</span> {gradeMapping[GradeId] || GradeId}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">年份:</span> {data.year}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">季度:</span> {data.quarter}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">科目:</span> {data.subject}
            </p>
            {data.img ? (
                <div>
              <div className="relative w-full max-w-md h-64">
                <Image
                  src={data.img}
                  alt={data.name}
                  fill
                  className="object-contain rounded-md"
                  priority
                />
              </div>
                <button
                  onClick={() => handleDownload(data.img, `${data.name}.jpg`)}
                  className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
                >
                  下載圖片
                </button>
            </div>
            ) : (
              <p className="text-gray-500">無圖片</p>
            )}
          </div>
        </div>
      </div>
    </div>
        </>
    )
}

export default ExPageLists_grade_year_quarter_subject_expagelists_by_id_bysupadmin