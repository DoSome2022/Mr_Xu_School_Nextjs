import BookList_Create_Form from "@/components/CreateForm/BookList-Create-Form"
import { useEffect, useState } from "react";

interface SchoolID {
    SchoolId : string;
    data : string;
}

interface Booklist_uploadFormProps{
    SchoolId : SchoolID
}





const Booklist_uploadForm = ({SchoolId} : Booklist_uploadFormProps) => {

    console.log(SchoolId)

    const [ GetSchoolById , setGetSchoolById ] = useState([]);


                    // 拿School data by id
                    useEffect(() =>{

                        if(SchoolId) {
                            const getSchoolDetail = async (id: string) => {
                                try {
                                const res = await fetch(`/api/School_detail_data_by_id/${id}`);
                                if(!res.ok) {
                                    throw new Error("斷線！");
                                }
                                const result = await res.json();
                                setGetSchoolById(result);                    
                                } catch (error) {
                                    console.error(error);
                                }
                            };
                            getSchoolDetail(SchoolId);
                        }
                    },[SchoolId] )
                
                



    return (
        <>
            <span>Booklist_uploadForm</span>
            <br />
            <BookList_Create_Form SchoolId={SchoolId} data={GetSchoolById} />
        </>
    )
}

export default Booklist_uploadForm