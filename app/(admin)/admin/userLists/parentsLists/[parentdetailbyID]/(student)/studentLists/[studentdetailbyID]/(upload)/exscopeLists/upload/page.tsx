// "use client";

// import Student_EX_Scope_Create_Form from "@/components/CreateForm/Student-EX-Scope-Create-Form";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// interface GetStudentData {
//     id: string;
//     name: string;
//     grade: number;
//     school: string;
// }
// const Student_ExscopeLists_upload = () =>{

//     const params = useParams();
//     console.log(params)
//     const StudentID = params?.studentdetailbyID as string;

//     const [ GetStudentData , setGetStudentData ] = useState<GetStudentData[]>([]);

//     useEffect(() => {
//         if(StudentID){
//             const fetchStudentData = async (StudentID: string) => {
//                 const res = await fetch(`/api/student/Student_Lists_detail_data_by_id/${StudentID}`)
//                 if(!res.ok){
//                     throw new Error("斷線！")
//                 }
//                 const result = await res.json();
//                 setGetStudentData(result);

//             } 
//             fetchStudentData(StudentID)
//         }
//     },[StudentID])

//     if (!StudentID) {
//         return <div className="p-4 text-red-500">無效的學生 ID</div>;
//       }
    
    
//       if (!GetStudentData) {
//         return <div className="p-4">載入中...</div>;
//       }



//     return(
//         <>
//             <Student_EX_Scope_Create_Form studentId={StudentID} data={GetStudentData} />
//         </>
//     )
    
// }

// export default Student_ExscopeLists_upload

"use client";

import Student_EX_Scope_Create_Form from "@/components/CreateForm/Student-EX-Scope-Create-Form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface GetStudentData {
    id: string;
    name: string;
    grade: number;
    school: string;
}

const Student_ExscopeLists_upload = () => {
    const params = useParams();
    const StudentID = params?.studentdetailbyID as string;
    const [GetStudentData, setGetStudentData] = useState<GetStudentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (StudentID) {
            const fetchStudentData = async (StudentID: string) => {
                try {
                    setIsLoading(true);
                    const res = await fetch(`/api/student/Student_Lists_detail_data_by_id/${StudentID}`);
                    if (!res.ok) {
                        throw new Error("獲取資料失敗！");
                    }
                    const result = await res.json();
                    setGetStudentData(result);
                } catch (error) {
                    console.error(error);
                    setError(error instanceof Error ? error.message : "發生未知錯誤");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchStudentData(StudentID);
        }
    }, [StudentID]);

    if (!StudentID) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow-md p-6 text-red-500">
                        無效的學生 ID
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e7915b]"></div>
                        <p className="mt-2 text-gray-600">載入中...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-[#e7915b] px-6 py-4">
                        <h1 className="text-xl font-bold text-white">
                            新增學生學習範圍
                        </h1>
                    </div>
                    <div className="p-6">
                        <Student_EX_Scope_Create_Form 
                            studentId={StudentID} 
                            data={GetStudentData} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Student_ExscopeLists_upload;