"use client"

import Ex_scope_uploadForm from '@/components/uploadForm/school/Ex_scope_uploadForm';
import { useParams } from 'next/navigation';


const ExScopeLists_upload = () =>{

    const params = useParams();
    const SchoolId = params.schooldetailbyID as string;


    return(
        <>
        ExScopeLists_upload
        <Ex_scope_uploadForm  SchoolId={SchoolId}/>
        </>
    )
}

export default ExScopeLists_upload