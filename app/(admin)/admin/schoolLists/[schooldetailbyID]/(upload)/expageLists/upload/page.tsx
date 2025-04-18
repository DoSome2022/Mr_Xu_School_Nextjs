"use client"

import Ex_pager_uploadForm from '@/components/uploadForm/school/Ex_pager_uploadForm';
import { useParams } from 'next/navigation';


const ExpageLists_upload = () =>{

    const params = useParams();
    const SchoolId = params.schooldetailbyID as string;


    return(
        <>
            ExpageLists_upload
            <Ex_pager_uploadForm  SchoolId={SchoolId}/>
        </>
    )
}

export default ExpageLists_upload