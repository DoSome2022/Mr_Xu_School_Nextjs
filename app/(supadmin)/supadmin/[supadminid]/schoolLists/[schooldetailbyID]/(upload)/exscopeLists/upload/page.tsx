"use client"

import Ex_scope_uploadFormbysupadmin from '@/components/CreateForm/SUPADMIN/UploadForm/school/Sup-Ex_scope_uploadForm';
import Ex_scope_uploadForm from '@/components/uploadForm/school/Ex_scope_uploadForm';
import { useParams } from 'next/navigation';


const ExScopeLists_uploadbysupadmin = () =>{

    const params = useParams();
    const SchoolId = params.schooldetailbyID as string;


    return(
        <>
        ExScopeLists_upload
        <Ex_scope_uploadFormbysupadmin  SchoolId={SchoolId}/>
        </>
    )
}

export default ExScopeLists_uploadbysupadmin