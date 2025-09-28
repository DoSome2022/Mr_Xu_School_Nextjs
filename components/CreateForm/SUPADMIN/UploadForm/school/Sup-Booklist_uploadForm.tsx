import BookList_Create_Form from "@/components/CreateForm/BookList-Create-Form"
import { useEffect, useState } from "react";
import BookList_Create_Form_bysupadmin from "../../Sup-BookList-Create-Form";

interface SchoolData {
    id : string;
    school_name : string;
}

interface Booklist_uploadFormProps{
    SchoolId : string
}


const Booklist_uploadFormbysupadmin = ({SchoolId} : Booklist_uploadFormProps) => {

    console.log(SchoolId)

    const [ GetSchoolById , setGetSchoolById ] = useState<SchoolData[]>([]);


                    // 拿School data by id
                    useEffect(() =>{

                        if(SchoolId) {
                            const getSchoolDetail = async (id: string) => {
                                try {
                                const res = await fetch(`/api/School_detail_data_by_id/${id}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
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
            <BookList_Create_Form_bysupadmin SchoolId={SchoolId} data={GetSchoolById} />
        </>
    )
}

export default Booklist_uploadFormbysupadmin