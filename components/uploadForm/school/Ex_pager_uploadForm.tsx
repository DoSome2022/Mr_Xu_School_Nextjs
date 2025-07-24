import EX_Pager_Create_Form from "@/components/CreateForm/EX-Pager-Create-Form"
import { useEffect ,useState } from "react";


interface SchoolID {
    id: string
    school_name: string
}

interface EX_Pager_Create_FormProps{
    SchoolId : string
}

const Ex_pager_uploadForm = ({SchoolId} : EX_Pager_Create_FormProps) => {
    


    const [ GetSchoolById , setGetSchoolById ] = useState<SchoolID[]>([]);


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


    console.log(GetSchoolById)
    
    
    return (
        <>
            <span>Ex_pager_uploadForm</span>

            <EX_Pager_Create_Form  SchoolId={SchoolId} data={GetSchoolById} />
        </>
    )
}

export default Ex_pager_uploadForm