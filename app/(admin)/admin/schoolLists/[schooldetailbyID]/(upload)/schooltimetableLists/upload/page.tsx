// "use client";

// // import SchoolTimeTable_Create_Form from '@/components/CreateForm/SchoolTimeTable-Create-Form';
// import School_Timetable_uploadForm from '@/components/uploadForm/school/School_Timetable_uploadForm';
// import { useParams } from 'next/navigation';


// const SchoolTimeTableLists_upload = () =>{
//     const params = useParams();
//     const SchoolId = params.schooldetailbyID as string;

//     return(
//        <School_Timetable_uploadForm  SchoolId={SchoolId}/>
//     )

// }

// export default SchoolTimeTableLists_upload

"use client";

import School_Timetable_uploadForm from '@/components/uploadForm/school/School_Timetable_uploadForm';
import { useParams } from 'next/navigation';

const SchoolTimeTableLists_upload = () => {
    const params = useParams();
    const SchoolId = params.schooldetailbyID as string;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">上傳學校時間表</h1>
                    <School_Timetable_uploadForm SchoolId={SchoolId} />
                </div>
            </div>
        </div>
    );
}

export default SchoolTimeTableLists_upload;