"use client"

import Booklist_uploadFormbysupadmin from "@/components/CreateForm/SUPADMIN/UploadForm/school/Sup-Booklist_uploadForm";
import Booklist_uploadForm from "@/components/uploadForm/school/Booklist_uploadForm"
import { useParams } from 'next/navigation';



const BookLists_uploadbysupadmin = () =>{

    const params = useParams();
    const SchoolId = params.schooldetailbyID as string;


    
    return(
        <>
        上傳書單
        <Booklist_uploadFormbysupadmin  SchoolId={SchoolId} />
        

        </>
    )

}

export default BookLists_uploadbysupadmin