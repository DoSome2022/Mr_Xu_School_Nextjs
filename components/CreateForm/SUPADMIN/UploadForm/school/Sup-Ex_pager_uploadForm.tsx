
import { useEffect ,useState } from "react";
import EX_Pager_Create_Form_bysupadmin from "../../Sup-EX-Pager-Create-Form";


interface SchoolID {
    id: string
    school_name: string
}

interface EX_Pager_Create_FormProps{
    SchoolId : string
}

const Ex_pager_uploadFormbysupadmin = ({SchoolId} : EX_Pager_Create_FormProps) => {
    


    const [ GetSchoolById , setGetSchoolById ] = useState<SchoolID[]>([]);


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


    console.log(GetSchoolById)
    
    
    return (
        <>
            <span>Ex_pager_uploadForm</span>

            <EX_Pager_Create_Form_bysupadmin  SchoolId={SchoolId} data={GetSchoolById} />
        </>
    )
}

export default Ex_pager_uploadFormbysupadmin