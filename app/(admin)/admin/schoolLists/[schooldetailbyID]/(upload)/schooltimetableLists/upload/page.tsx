"use client";

// import SchoolTimeTable_Create_Form from '@/components/CreateForm/SchoolTimeTable-Create-Form';
import School_Timetable_uploadForm from '@/components/uploadForm/school/School_Timetable_uploadForm';
import { useParams } from 'next/navigation';


const SchoolTimeTableLists_upload = () =>{
    const params = useParams();
    const SchoolId = params.schooldetailbyID as string;

    return(
       <School_Timetable_uploadForm  SchoolId={SchoolId}/>
    )

}

export default SchoolTimeTableLists_upload