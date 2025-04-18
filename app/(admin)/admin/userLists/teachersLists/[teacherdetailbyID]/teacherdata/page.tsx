import { auth } from "@/auth";
import Teacher_Data_Create_Form from "@/components/CreateForm/Teacher-Data-Create-Form "

interface TeacherDataProps{
    params:{
        TeacherId: string
    };
    
}


const TeacherData = ({params } : TeacherDataProps) => {


    return(
        <>
            <Teacher_Data_Create_Form  TeacherId={params}/>
        </>
    )
}

export default TeacherData