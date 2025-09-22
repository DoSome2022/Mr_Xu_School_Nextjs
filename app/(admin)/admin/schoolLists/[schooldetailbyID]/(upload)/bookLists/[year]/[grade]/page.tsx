// "use client";

// import Link from "next/link";
// import { useParams } from 'next/navigation';
// import { useEffect, useState } from "react";
// //     為了拿 booklists data id/year/grade

// // const fetcher = (...args) => fetch(...args).then((res) => res.json());

// // const { data , error , isLoading } = useSWR(`http://localhost:3000/api/Booklists_by_id/${schoolId}/${yearId}/${gradeId.toString()}` , fetcher);


// //     為了拿 booklists data id/year/


// // const fetcher = (...args) => fetch(...args).then((res) => res.json());

// //const { data , error , isLoading } = useSWR(`http://localhost:3000/api/Booklists_by_id/${schoolId}/${yearId}}` , fetcher);


// //     為了拿 booklists data id/


// // const fetcher = (...args) => fetch(...args).then((res) => res.json());
// // const { data , error , isLoading } = useSWR(`/api/Booklists_by_id/${schoolId}` , fetcher);


// interface SchoolBookData {
//     id: string;
//     name: string;
//     year : string;
//     grade: number;
//     school_booklist_id: string;
// }

// const School_detail_data_by_id_bookLists_year_grade_booklist = () =>{

//     const params = useParams<{year: string ; grade: string; schooldetailbyID: string}>();//plz use console.log check params name
//     const schoolId = params?.schooldetailbyID as string;// 獲取URL中的schoolId參數
//     const yearId = params?.year as string// 獲取URL中的yearId參數
//     const gradeId = params?.grade as string // 獲取URL中的gradeId參數
//     console.log("params : ", params)

    
// const [ GetBooklistsDataById , setGetBooklistsDataById ] = useState<SchoolBookData[]>([]);



// useEffect(() =>{
//     if(schoolId && yearId && gradeId) {
//         const getBooklitsDetail = async (id: string ,yearId:string , gradeId:string) => {
//             try {
//             const res = await fetch(`/api/Booklists_by_id/${id}/${yearId}/${gradeId}`);
//             if(!res.ok) {
//                 throw new Error("斷線！");
//             }
//             const result = await res.json();
//             setGetBooklistsDataById(result);                    
//             } catch (error) {
//                 console.error(error);
//             }
//         };
//         getBooklitsDetail(schoolId,yearId,gradeId);
//     }
// },[schoolId ,yearId , gradeId] )
    

//     console.log("-- booklist Data : --",GetBooklistsDataById,"-- end --")

//     return(
//         <>
//             bookLists
//         {GetBooklistsDataById.map((d)=>{
//             if(d.grade == Number(gradeId) && d.year == yearId &&  d.school_booklist_id == schoolId
//                 // 
//             ){
//                 return(
//                     <>
//                 <br />
//                             <Link className="text-stone-950 hover:text-gray-700" 
//                             href={`/admin/schoolLists/${schoolId}/bookLists/${yearId}/${gradeId}/${d.id}`}
//                             >
//                                 name:{d.name} 
//                                 <br />
//                             </Link>
//                         <br />
//                         </> 
//                 )

//             }
//         })}       
//         </>
//     )
// }

// export default School_detail_data_by_id_bookLists_year_grade_booklist



"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SchoolBookData {
  id: string;
  name: string;
  year: string;
  grade: number;
  school_booklist_id: string;
}

const School_detail_data_by_id_bookLists_year_grade_booklist = () => {
  const params = useParams();
  const schoolId = params?.schooldetailbyID as string;
  const yearId = params?.year as string;
  const gradeId = params?.grade as string;

  const [GetBooklistsDataById, setGetBooklistsDataById] = useState<SchoolBookData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (schoolId && yearId && gradeId) {
      const getBooklistsDetail = async (id: string, yearId: string, gradeId: string) => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/Booklists_by_id/${id}/${yearId}/${gradeId}`);
          if (!res.ok) {
            throw new Error("無法載入書單資料");
          }
          const result = await res.json();
          if (!Array.isArray(result)) {
            throw new Error("無效的資料格式");
          }
          setGetBooklistsDataById(result);
        } catch (err: unknown) { // 使用 unknown 避免 any
          console.error("載入錯誤:", err);
          const errorMessage = err instanceof Error ? err.message : "無法載入書單資料";
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      getBooklistsDetail(schoolId, yearId, gradeId);
    } else {
      setError("無效的學校ID、年份或年級");
      setLoading(false);
    }
  }, [schoolId, yearId, gradeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
      </div>
    );
  }

  // 定義年級對應對象，與 BookLists_grade_Links 一致
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

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/admin`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists`} className="text-blue-600 hover:text-blue-800">
          學枚列表
        </Link>
        <span className="mx-2">/</span>
            <Link href={`/admin/schoolLists/${schoolId}`} className="text-blue-600 hover:text-blue-800">
          學枚資料
        </Link>
        <span className="mx-2">/</span>
                    <Link href={`/admin/schoolLists/${schoolId}/bookLists`} className="text-blue-600 hover:text-blue-800">
          書單年份列表
        </Link>
        <span className="mx-2">/</span>
                
                    <Link href={`/admin/schoolLists/${schoolId}/bookLists/${yearId}`} className="text-blue-600 hover:text-blue-800">
          {yearId}
        </Link>

        <span className="mx-2">/</span>
        <span>{gradeId}</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">
            書單列表 - {yearId} {gradeMapping[gradeId] || gradeId}
          </h1>
          <div className="flex space-x-4">
            <Link
              href={`/admin/schoolLists/${schoolId}/bookLists/upload`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              上傳書單
            </Link>
            <Link
              href={`/admin/schoolLists/${schoolId}/bookLists/${yearId}`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回年級列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">書單列表</h2>
          {GetBooklistsDataById.length === 0 ? (
            <p className="text-gray-500">尚未新增書單</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {GetBooklistsDataById.map((book) => (
                <Link
                  key={book.id}
                  href={`/admin/schoolLists/${schoolId}/bookLists/${yearId}/${gradeId}/${book.id}`}
                  className="block p-4 bg-gray-50 rounded-md hover:bg-[#80A8BD] hover:text-white transition-colors duration-300"
                >
                  <p className="text-gray-800 font-semibold">{book.name}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default School_detail_data_by_id_bookLists_year_grade_booklist;