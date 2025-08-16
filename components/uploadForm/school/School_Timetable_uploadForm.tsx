
// import SchoolTimeTable_Create_Form from "@/components/CreateForm/SchoolTimeTable-Create-Form";
// import { useEffect ,useState } from "react";

// interface SchoolData {
//     id: string;
//     school_name: string;
// }

// interface School_Timetable_uploadFormProps{
//     SchoolId : string
// }

// const School_Timetable_uploadForm = ({SchoolId} : School_Timetable_uploadFormProps) => {
    
//     const [ GetSchoolById , setGetSchoolById ] = useState([]);
//     // 拿School data by id
//     useEffect(() =>{

//         if(SchoolId) {
//             const getSchoolDetail = async (id: string) => {
//                 try {
//                 const res = await fetch(`/api/School_detail_data_by_id/${id}`);
//                 if(!res.ok) {
//                     throw new Error("斷線！");
//                 }
//                 const result = await res.json();
//                 setGetSchoolById(result);                    
//                 } catch (error) {
//                     console.error(error);
//                 }
//             };
//             getSchoolDetail(SchoolId);
//         }
//     },[SchoolId] )    

//     console.log(GetSchoolById)   

//     return (
//         <>
//             <span>School_Timetable_uploadForm</span>
//             <SchoolTimeTable_Create_Form SchoolId={SchoolId} data={GetSchoolById}  />
//         </>
//     )
// }

// export default School_Timetable_uploadForm

"use client";

import SchoolTimeTable_Create_Form from "@/components/CreateForm/SchoolTimeTable-Create-Form";
import { useEffect, useState } from "react";

interface SchoolData {
    id: string;
    school_name: string;
}

interface School_Timetable_uploadFormProps {
    SchoolId: string;
}

const School_Timetable_uploadForm = ({ SchoolId }: School_Timetable_uploadFormProps) => {
    const [GetSchoolById, setGetSchoolById] = useState<SchoolData[]>([]);
    
    useEffect(() => {
        if(SchoolId) {
            const getSchoolDetail = async (id: string) => {
                try {
                    const res = await fetch(`/api/School_detail_data_by_id/${id}`);
                    if(!res.ok) {
                        throw new Error("請求失敗！");
                    }
                    const result = await res.json();
                    setGetSchoolById(result);                    
                } catch (error) {
                    console.error("獲取學校資料時出錯:", error);
                }
            };
            getSchoolDetail(SchoolId);
        }
    }, [SchoolId]);

    return (
        <div className="space-y-6">
            <SchoolTimeTable_Create_Form SchoolId={SchoolId} data={GetSchoolById} />
        </div>
    );
}

export default School_Timetable_uploadForm;