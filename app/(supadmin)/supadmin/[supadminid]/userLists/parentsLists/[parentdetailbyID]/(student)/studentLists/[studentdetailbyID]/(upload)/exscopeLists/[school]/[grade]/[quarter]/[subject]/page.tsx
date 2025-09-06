// "use client";

// import { useParams } from 'next/navigation';
// import Link from "next/link";
// import { useEffect, useState } from "react";

// interface StudentName {
//     id: string
//     name: string
//     school: string
//     grade: string
//     quarter: string
//     subject: string
// }


// const ExScope_Grade_Quarter_Subject_Listsbysupadmin = () => {

//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; school : string; grade : string ; quarter : string ; subject : string;supadminId:string;}>();
//     const ParentID = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const SchoolName = params?.school as string;
//     const Grade = params?.grade as string;
//     const Quarter = params?.quarter as string;
//     const Subject = params?.subject ? decodeURIComponent(params.subject) : '';
//     const supadminId = params?.supadminId as string;



//     const [ GetStudentExScopeLists , setGetStudentExScopeLists ] = useState<StudentName[]>([]);

//     useEffect(()=>{
//         if(StudentID){
//             const getstudentexscopelist = async (StudentID: string) => {
//                 try {
//                     const res = await fetch(`/api/student/Student_ExScope_by_id_Lists/${StudentID}`)
//                     if(!res.ok) {
//                         throw new Error("斷線！");
//                     }
//                     const result = await res.json();
//                     setGetStudentExScopeLists(result);                    
//                 } catch (error) {
//                     console.error(error)
//                 }
//             };
//             getstudentexscopelist(StudentID)
//         }
//     },[StudentID])


//     console.log(GetStudentExScopeLists)

//     return(
//         <>
//             <span> ExScope_Grade_Quarter_Subject_Lists </span>
//             <br />
//         {GetStudentExScopeLists.map((d)=>{
//             if(d.school == SchoolName && d.grade == Grade && d.quarter == Quarter && d.subject == Subject ){
//             return(
//                 <>
//         <Link className='text-stone-950 hover:text-gray-700'
//                 href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}/${Quarter}/${Subject}/${d.id}`}
//             >
//                 名稱:{d.name}
//             </Link>

//             <br />
//                 </>
//             )
//             }



//         })}

//         </>
//     )
// }

// export default ExScope_Grade_Quarter_Subject_Listsbysupadmin

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface StudentName {
  id: string;
  name: string;
  school: string;
  grade: string;
  quarter: string;
  subject: string;
}

const ExScope_Grade_Quarter_Subject_Listsbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    grade: string;
    quarter: string;
    subject: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const SchoolName = params?.school ? decodeURIComponent(params.school) : "";
  const Grade = params?.grade ? decodeURIComponent(params.grade) : "";
  const Quarter = params?.quarter ? decodeURIComponent(params.quarter) : "";
  const Subject = params?.subject ? decodeURIComponent(params.subject) : "";

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || !SchoolName || !Grade || !Quarter || !Subject) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const [GetStudentExScopeLists, setGetStudentExScopeLists] = useState<StudentName[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getstudentexscopelist = async (studentId: string) => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(
          `${apiUrl}/api/student/Student_ExScope_by_id_Lists/${StudentID}`
        );
        if (!res.ok) {
          throw new Error(`請求失敗：${res.statusText}`);
        }
        const result = await res.json();
        if (!Array.isArray(result)) {
          throw new Error("無效的考試範圍資料格式");
        }
        if (
          !result.every(
            (item) =>
              typeof item.id === "string" &&
              typeof item.name === "string" &&
              typeof item.school === "string" &&
              typeof item.grade === "string" &&
              typeof item.quarter === "string" &&
              typeof item.subject === "string"
          )
        ) {
          throw new Error("無效的資料格式");
        }
        setGetStudentExScopeLists(result);
      } catch (err: any) {
        setError(err.message || "無法獲取考試範圍資料");
      } finally {
        setIsLoading(false);
      }
    };

    if (StudentID) {
      getstudentexscopelist(StudentID);
    }
  }, [StudentID, SchoolName, Grade, Quarter, Subject]);

  // 過濾數據
  const filteredData = GetStudentExScopeLists.filter(
    (d) => d.school === SchoolName && d.grade === Grade && d.quarter === Quarter && d.subject === Subject
  );

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("-- Student ExScope Lists : --", GetStudentExScopeLists, "-- END --");
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
        <span>{Subject}</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {SchoolName} {Grade} 第{Quarter}季度 {Subject} 考試範圍列表
      </h2>

      {isLoading && <div className="text-gray-600 p-4">載入中...</div>}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      {!isLoading && !error && filteredData.length === 0 && (
        <div className="text-gray-600 p-4">無符合條件的考試範圍資料</div>
      )}

      <div className="flex flex-col space-y-4">
        {filteredData.map((d) => (
          <Link
            key={d.id}
            className="text-blue-600 hover:text-blue-800 font-medium"
            href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}/${Quarter}/${Subject}/${d.id}`}
          >
            名稱：{d.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExScope_Grade_Quarter_Subject_Listsbysupadmin;