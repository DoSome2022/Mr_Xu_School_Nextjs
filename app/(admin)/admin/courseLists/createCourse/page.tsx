// import Course_Create_Form from "@/components/CreateForm/Course-Create-Form"



// const CreateCourse = async () =>{
    


//     return(
//         <>
        
//             <span>
//                 CreateCourse

//                 <Course_Create_Form />
//             </span>
//         </>
//     )
// }

// export default CreateCourse

"use client";

import Course_Create_Form from "@/components/CreateForm/Course-Create-Form";
import Link from "next/link";

const CreateCourse = () => {
  return (
    <div className="min-h-screen bg-gray-100 pt-20"> {/* 留出空間給固定導航欄 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#e7915b]">創建課程</h1>
          <Link
            href="/admin/courseLists"
            className="inline-block text-white bg-[#e7915b] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
          >
            返回課程列表
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Course_Create_Form />
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;