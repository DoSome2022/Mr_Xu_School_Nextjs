"use client";

import Ex_timetable_uploadFormbysupadmin from '@/components/CreateForm/SUPADMIN/UploadForm/school/Sup-Ex_timetable_uploadForm';
import Ex_timetable_uploadForm from '@/components/uploadForm/school/Ex_timetable_uploadForm';
import { useParams } from 'next/navigation';


const ExTimeLists_uploadbysupadmin = () => {
    const params = useParams();
    const SchoolId = params.schooldetailbyID as string;

    return(
        <>
            <Ex_timetable_uploadFormbysupadmin  SchoolId={SchoolId} />
        </>
    )

}

export default ExTimeLists_uploadbysupadmin