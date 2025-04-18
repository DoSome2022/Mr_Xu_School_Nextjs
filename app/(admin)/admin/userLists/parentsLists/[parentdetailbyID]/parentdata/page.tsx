import Parent_Data_create_Form from "@/components/CreateForm/Parent_Data_Create_Form"

interface ParentDataProps{
    params:{
        ParentId: string
    }
}

const ParentData = ({params} : ParentDataProps) =>{
    return(
        <>
        <Parent_Data_create_Form  ParentId={params}/>
        </>
    )
}

export default ParentData