"use client";

import School_Timetable_uploadFormbysupadmin from '@/components/CreateForm/SUPADMIN/UploadForm/school/Sup-School_Timetable_uploadForm';

import { useParams } from 'next/navigation';


const SchoolTimeTableLists_uploadbysupadmin = () =>{
    const params = useParams();
    const SchoolId = params.schooldetailbyID as string;

    return(
       <School_Timetable_uploadFormbysupadmin  SchoolId={SchoolId}/>
    )

}

export default SchoolTimeTableLists_uploadbysupadmin