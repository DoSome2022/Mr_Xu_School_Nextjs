"use client";

import Ex_timetable_uploadForm from '@/components/uploadForm/school/Ex_timetable_uploadForm';
import { useParams } from 'next/navigation';


const ExTimeLists_upload = () => {
    const params = useParams();
    const SchoolId = params.schooldetailbyID as string;

    return(
        <>
            <Ex_timetable_uploadForm  SchoolId={SchoolId} />
        </>
    )

}

export default ExTimeLists_upload