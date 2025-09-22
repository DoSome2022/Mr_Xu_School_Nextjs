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

// const ExScope_Grade_Quarter_Subject_Lists_By_IDbysuadmin = () => {

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

// export default ExScope_Grade_Quarter_Subject_Lists_By_IDbysuadmin

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

interface StudentDetailData {
  id: string;
  name: string;
  img: string;
  school: string;
  grade: string;
  quarter: string;
  subject: string;
}

const ExScope_Grade_Quarter_Subject_Lists_By_IDbysuadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    grade: string;
    quarter: string;
    subject: string;
    id: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const SchoolName = params?.school ? decodeURIComponent(params.school) : "";
  const Grade = params?.grade ? decodeURIComponent(params.grade) : "";
  const Quarter = params?.quarter ? decodeURIComponent(params.quarter) : "";
  const Subject = params?.subject ? decodeURIComponent(params.subject) : "";
  const Id = params?.id;

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || !SchoolName || !Grade || !Quarter || !Subject || !Id) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const [studentDetail, setStudentDetail] = useState<StudentDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getstudentexscopedetailbyid = async (StudentID: string, id: string) => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(
          `${apiUrl}/api/student/Student_ExScope_by_id_Lists_by_id/${StudentID}/${id}`
        );
        if (!res.ok) {
          throw new Error(`請求失敗：${res.statusText}`);
        }
        const result = await res.json();
        // 假設 API 返回單一對象
        if (
          !result ||
          typeof result.id !== "string" ||
          typeof result.name !== "string" ||
          typeof result.img !== "string" ||
          typeof result.school !== "string" ||
          typeof result.grade !== "string" ||
          typeof result.quarter !== "string" ||
          typeof result.subject !== "string"
        ) {
          throw new Error("無效的考試範圍資料格式");
        }
        setStudentDetail(result);
      } catch (err: any) {
        setError(err.message || "無法獲取考試範圍詳細資料");
      } finally {
        setIsLoading(false);
      }
    };

    if (StudentID && Id) {
      getstudentexscopedetailbyid(StudentID, Id);
    }
  }, [StudentID, Id, SchoolName, Grade, Quarter, Subject]);

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
      link.download = fileName || "ExScope-image.jpg"; // 使用書單名稱或默認文件名
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("下載圖片失敗:", error);
      alert("下載圖片失敗，請稍後再試");
    }
  };

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("-- Student ExScope Detail : --", studentDetail, "-- END --");
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/supadmin/${supadminId}`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/supadmin/${supadminId}/userLists`} className="text-blue-600 hover:text-blue-800">
          用戶列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生資料
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          考試範圍
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Grade}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}/${Quarter}`}
          className="text-blue-600 hover:text-blue-800"
        >
          第{Quarter}季度
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}/${Quarter}/${Subject}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Subject}
        </Link>
        <span className="mx-2">/</span>
        <span>詳細資料</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {SchoolName} {Grade} 第{Quarter}季度 {Subject} 考試範圍詳細資料
      </h2>

      {isLoading && <div className="text-gray-600 p-4">載入中...</div>}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      {!isLoading && !error && !studentDetail && (
        <div className="text-gray-600 p-4">無符合條件的考試範圍資料</div>
      )}

      {studentDetail && studentDetail.school === SchoolName && studentDetail.grade === Grade && studentDetail.quarter === Quarter && studentDetail.subject === Subject && studentDetail.id === Id && (
        <div className="flex flex-col space-y-4">
          <p className="text-blue-600 font-medium text-lg">{studentDetail.name}</p>
          <Image
            width={500}
            height={500}
            src={studentDetail.img}
            alt={studentDetail.name}
            className="w-full max-w-md h-auto object-contain rounded-lg"
          />
          <button
            onClick={() => handleDownload(studentDetail.img, `${studentDetail.name}.jpg`)}
          className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
                  下載圖片
          </button>

        </div>
      )}
    </div>
  );
};

export default ExScope_Grade_Quarter_Subject_Lists_By_IDbysuadmin;