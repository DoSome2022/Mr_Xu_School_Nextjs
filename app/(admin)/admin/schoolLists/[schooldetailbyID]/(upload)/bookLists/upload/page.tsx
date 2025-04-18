"use client"

import Booklist_uploadForm from "@/components/uploadForm/school/Booklist_uploadForm"
import { useParams } from 'next/navigation';



const BookLists_upload = () =>{

    const params = useParams();
    const SchoolId = params.schooldetailbyID as string;


    
    return(
        <>
        上傳書單
        <Booklist_uploadForm  SchoolId={SchoolId} />
        

        </>
    )

}

export default BookLists_upload