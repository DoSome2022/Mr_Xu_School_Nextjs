// import Link from "next/link";

// interface Course {
//     id : string;
//     course_name: string,
//     course_subject: string,
//     persons: number,
//     grade: number,
//     course_level: string,
//     teacher: string,
//     class:[],
//     student:[],
//     joinStudent:[]
// }

// interface JoinStudent{
//     student_name:string
// }


// interface ClassDetailListsProps{
//     data : Course
// }

// interface StudentData{
//     name: string
// }

// // 定義年級對應對象
// const gradeMapping:{[key:string]:string} = {
//     "1": "小學1年級",
//     "2": "小學2年級",
//     "3": "小學3年級",
//     "4": "小學4年級",
//     "5": "小學5年級",
//     "6": "小學6年級",
//     "7": "初中1年級",
//     "8": "初中2年級",
//     "9": "初中3年級",
//     "10": "高中1年級",
//     "11": "高中2年級",
//     "12": "高中3年級",
//   };




// const ClassDetailLists = ({ data } : ClassDetailListsProps) => {
//     console.log("課程：", data)
//     return(
//         <>
//            <div>

//             課程名稱: {data.course_name}
//             <br />
//             課程科目:{data.course_subject}

//             <br />
//             年級：{gradeMapping[data.grade]}

//             <br />
//             老師：{data.teacher}
//             <br />
//             插班生: {data?.joinStudent.map((student:JoinStudent) => {
                
//                 return(
//                     <>
//                    姓名:{student.student_name}
                   
//                     </>
//                 )
//             }
//                 )}
//             <br />
//             <Link href={`/admin/courseLists/${data.id}/classLists`}>
//             課堂數目: {data.class.length}
//             </Link>
//                 <br />

//                 學生:{data?.student.map((student:StudentData) => student.name)}
//                 <br />
//             <Link href={`/admin/courseLists/${data.id}/AddStudent`} >
//             加入學生
//             </Link>
//             <br />
//             <Link href={`/admin/courseLists/${data.id}/JoinStudent`} >
//             加入插班生
//             </Link>
//             <br />
//            </div>
//         </>
//     )
// }
// export default ClassDetailLists


"use client";

import { Course } from "@/types/course";
import Link from "next/link";

interface ClassDetailListsProps {
  data: Course;
}

interface JoinStudent {
  id: string;
  student_name: string;
}

interface StudentData {
  id: string;
  name: string;
}

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

const ClassDetailLists = ({ data }: ClassDetailListsProps) => {
  console.log("課程：", data);
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">課程詳情</h2>
      <div className="grid gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">課程名稱</h3>
          <p className="text-gray-600">{data.course_name}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">課程科目</h3>
          <p className="text-gray-600">{data.course_subject}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">年級</h3>
          <p className="text-gray-600">{gradeMapping[data.grade] || "未知年級"}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">老師</h3>
          <p className="text-gray-600">{data.teacher}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">插班生</h3>
          {data.joinStudent && data.joinStudent.length > 0 ? (
            <ul className="text-gray-600">
              {data.joinStudent.map((student: JoinStudent) => (
                <li key={student.id}>姓名: {student.student_name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">無插班生</p>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">課堂數目</h3>
          <Link
            href={`/admin/courseLists/${data.id}/classLists`}
            className="text-[#e7915b] hover:text-cyan-200 transition-colors duration-300"
          >
            {data.class.length} 堂課
          </Link>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">學生</h3>
          {data.student && data.student.length > 0 ? (
            <ul className="text-gray-600">
              {data.student.map((student: StudentData) => (
                <li key={student.id}>{student.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">無學生</p>
          )}
        </div>
        <div className="flex space-x-4">
          <Link
            href={`/admin/courseLists/${data.id}/AddStudent`}
            className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            加入學生
          </Link>
          <Link
            href={`/admin/courseLists/${data.id}/JoinStudent`}
            className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            加入插班生
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailLists;