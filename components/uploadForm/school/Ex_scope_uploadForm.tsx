import EX_Scope_Create_Form from "@/components/CreateForm/EX-Scope-Create-Form"
import { useEffect ,useState } from "react";

interface SchoolData {
    id: string;
    school_name: string;
}

interface Ex_scope_uploadFormProps{
    SchoolId : string
}


const Ex_scope_uploadForm = ({SchoolId} : Ex_scope_uploadFormProps) => {

    const [ GetSchoolById , setGetSchoolById ] = useState<SchoolData[]>([]);
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
            <span>Ex_scope_uploadForm</span>

            <EX_Scope_Create_Form SchoolId={SchoolId} data={GetSchoolById} />

        </>
    )
}

export default Ex_scope_uploadForm