// "use client";



// import Student_SchoolTimeTable_Create_Form from "@/components/CreateForm/Student-SchoolTimeTable-Create-Form";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// interface StudentData {
//     id: string;
//     name: string;
//     grade: number;
//     school: string;
// }

// const Student_SchoolTimeTable_upload = () =>{
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
// <Student_SchoolTimeTable_Create_Form studentId={StudentID} data={GetStudentData}/>
//         </>
//     )
    
// }

// export default Student_SchoolTimeTable_upload


"use client";

import Student_SchoolTimeTable_Create_Form from "@/components/CreateForm/Student-SchoolTimeTable-Create-Form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface StudentData {
    id: string;
    name: string;
    grade: number;
    school: string;
}

const Student_SchoolTimeTable_upload = () => {
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
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#80A8BD]"></div>
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
                    <div className="bg-[#80A8BD] px-6 py-4">
                        <h1 className="text-xl font-bold text-white">
                            新增學校時間表
                        </h1>
                    </div>
                    <div className="p-6">
                        <Student_SchoolTimeTable_Create_Form 
                            studentId={StudentID} 
                            data={GetStudentData} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Student_SchoolTimeTable_upload;