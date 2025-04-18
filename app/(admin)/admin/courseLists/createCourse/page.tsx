import Course_Create_Form from "@/components/CreateForm/Course-Create-Form"
import { db } from "@/lib/db";



const CreateCourse = async () =>{
    


    return(
        <>
        
            <span>
                CreateCourse

                <Course_Create_Form />
            </span>
        </>
    )
}

export default CreateCourse