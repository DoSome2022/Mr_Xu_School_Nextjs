// import Student_BookList_Create_Form from "@/components/CreateForm/Student-BookList-Create-Form";
import { useParams } from "next/navigation";


//廢案

const Student_Booklist_uploadForm = () => {
    const param = useParams();
    const studentId = param?.studentId as string;

    return (
        <>
            <span>Student_Booklist_uploadForm</span> 
        
            {/* <Student_BookList_Create_Form studentId={studentId} data={[]} /> */}
        </>
    )
}

export default Student_Booklist_uploadForm