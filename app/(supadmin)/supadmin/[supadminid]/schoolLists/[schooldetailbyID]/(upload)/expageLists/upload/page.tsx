"use client"

import Ex_pager_uploadFormbysupadmin from '@/components/CreateForm/SUPADMIN/UploadForm/school/Sup-Ex_pager_uploadForm';

import { useParams } from 'next/navigation';


const ExpageLists_uploadbysupadmin = () =>{

    const params = useParams();
    const SchoolId = params.schooldetailbyID as string;


    return(
        <>
            ExpageLists_upload
            <Ex_pager_uploadFormbysupadmin  SchoolId={SchoolId}/>
        </>
    )
}

export default ExpageLists_uploadbysupadmin