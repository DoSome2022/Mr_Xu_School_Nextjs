// "use client";

// import { useParams } from "next/navigation";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// interface BookListsData {
//   id: string;
//   name: string;
//   year: string;
//   grade: number;
//   school: string;
// }
// const Student_BookLists_School_Year_Grade_Lists = () => {
//   const params = useParams<{
//     parentId: string;
//     studentid: string;
//     school: string;
//     year: string;
//     grade: string;
//   }>();
//   const ParentID = params?.parentId as string;
//   const StudentID = params?.studentid as string;
//   const SchoolName = params?.school as string;
//   const Year = params?.year as string;
//   const Grade = params?.grade as string;

//   console.log("params : ",params)
//   const [GetStudentBookLists, setGetStudentBookLists] = useState<BookListsData[]>([]);

//   useEffect(() => {
//     if (StudentID) {
//       const getstudentexbooklists = async (StudentID: string) => {
//         try {
//           const res = await fetch(`/api/student/Student_Booklist_by_id_Lists/${StudentID}`, {
//                 cache: 'no-store',  // 強制不快取，確保每次請求新數據
//                 headers: {
//                     'Cache-Control': 'no-cache',
//                 },
//             });
//           if (!res.ok) {
//             throw new Error("斷線！");
//           }
//           const result = await res.json();
//           setGetStudentBookLists(result);
//         } catch (error) {
//           console.error(error);
//         }
//       };
//       getstudentexbooklists(StudentID);
//     }
//   }, [StudentID]);

//   console.log(GetStudentBookLists);

//   return (
//     <>
//       <span>Student_BookLists_School_Year_Grade_Lists</span>
//       <br />
//       {GetStudentBookLists.map((d) => {

//         if(d.school == SchoolName && d.year == Year && d.grade == Number(Grade)
//           //


//         ){
//           return (
//             <> 
//                 <Link
//           key={d.id}
//           className="text-stone-950 hover:text-gray-700"
//           href={`/parent/${ParentID}/profiles/${StudentID}/upload/bookLists/${SchoolName}/${Year}/${Grade}/${d.id}`}
//         >
//           名稱：{d.name}
//         </Link>
//             </>
//           );
//         }
//       }

//       )}
//     </>
//   );
// };

// export default Student_BookLists_School_Year_Grade_Lists;

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BookListsData {
  id: string;
  name: string;
  year: string;
  grade: number;
  school: string;
}

const Student_BookLists_School_Year_Grade_Lists = () => {
  const params = useParams<{
    parentId: string;
    studentid: string;
    school: string;
    year: string;
    grade: string;
  }>();
  const ParentID = params?.parentId as string;
  const StudentID = params?.studentid as string;
  const SchoolName = params?.school as string;
  const Year = params?.year as string;
  const Grade = params?.grade as string;

  console.log("params : ", params);
  const [GetStudentBookLists, setGetStudentBookLists] = useState<BookListsData[]>([]);

  useEffect(() => {
    if (StudentID) {
      const getstudentexbooklists = async (StudentID: string) => {
        try {
          const res = await fetch(`/api/student/Student_Booklist_by_id_Lists/${StudentID}`, {
            cache: "no-store", // 強制不快取，確保每次請求新數據
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          if (!res.ok) {
            throw new Error("斷線！");
          }
          const result = await res.json();
          setGetStudentBookLists(result);
        } catch (error) {
          console.error(error);
        }
      };
      getstudentexbooklists(StudentID);
    }
  }, [StudentID]);

  console.log(GetStudentBookLists);

  return (
    <div className="bg-gray-800 min-h-screen">
      {/* 麵包屑導航（可選，借用 navbar 風格） */}


      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {SchoolName} {Year} {Grade} 書單列表
        </h2>

        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
          {GetStudentBookLists.length === 0 && (
            <div className="text-gray-300 p-4">無書單資料</div>
          )}

          <div className="flex flex-col space-y-4">
            {GetStudentBookLists.map((d) => {
              if (d.school === SchoolName && d.year === Year && d.grade === Number(Grade)) {
                return (
                  <Link
                    key={d.id}
                    className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200 block p-4 border border-gray-600 rounded-lg hover:bg-gray-600"
                    href={`/parent/${ParentID}/profiles/${StudentID}/upload/bookLists/${SchoolName}/${Year}/${Grade}/${d.id}`}
                  >
                    名稱：{d.name}
                  </Link>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student_BookLists_School_Year_Grade_Lists;