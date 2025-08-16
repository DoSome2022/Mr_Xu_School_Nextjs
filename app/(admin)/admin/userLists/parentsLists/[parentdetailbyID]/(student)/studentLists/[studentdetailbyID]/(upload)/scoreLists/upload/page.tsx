// "use client";




// import Student_Score_Create_Form from "@/components/CreateForm/Student-Score-Create-Form";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// interface StudentData {
//     id: string;
//     name: string;
//     grade: number;
//     school: string;
// }
// const Student_Score_upload = () =>{

//     const params = useParams();
//     console.log(params)
//     const StudentID = params?.studentdetailbyID as string;

//     const [ GetStudentData , setGetStudentData ] = useState<StudentData[]>([]);

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

//     return(
//         <>
// <Student_Score_Create_Form studentId={StudentID} data={GetStudentData} />
//         </>
//     )
    
// }

// export default Student_Score_upload

"use client";

import Student_Score_Create_Form from "@/components/CreateForm/Student-Score-Create-Form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface StudentData {
    id: string;
    name: string;
    grade: number;
    school: string;
}

const Student_Score_upload = () => {
    const params = useParams();
    const StudentID = params?.studentdetailbyID as string;
    const [GetStudentData, setGetStudentData] = useState<StudentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (StudentID) {
            const fetchStudentData = async (StudentID: string) => {
                try {
                    setIsLoading(true);
                    const res = await fetch(`/api/student/Student_Lists_detail_data_by_id/${StudentID}`);
                    if (!res.ok) {
                        throw new Error("獲取學生資料失敗！");
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

    if (error) {
        return (
            <div className="pt-16 min-h-screen bg-gray-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-red-500 font-medium">錯誤: {error}</h2>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="pt-16 min-h-screen bg-gray-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <span className="text-[#e7915b] animate-pulse">載入學生資料中...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-16 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-[#e7915b] mb-6">上傳學生成績</h1>
                        <Student_Score_Create_Form 
                            studentId={StudentID} 
                            data={GetStudentData} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Student_Score_upload;