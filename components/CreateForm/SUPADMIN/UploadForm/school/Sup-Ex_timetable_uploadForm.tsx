import EX_Time_Create_Form from "@/components/CreateForm/EX-Time-Create-Form"
import { useEffect ,useState } from "react";

interface SchoolData {
    id: string;
    school_name: string;
}

interface Ex_timetable_uploadFormProps{
    SchoolId : string
}

const Ex_timetable_uploadFormbysupadmin = ({SchoolId} : Ex_timetable_uploadFormProps) => {
    
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

    console.log(GetSchoolById)   

    return (
        <>
            <span>Ex_timetable_uploadForm</span>
            <EX_Time_Create_Form SchoolId={SchoolId} data={GetSchoolById} />
        </>
    )
}

export default Ex_timetable_uploadFormbysupadmin