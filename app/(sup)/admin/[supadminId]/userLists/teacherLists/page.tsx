import Link from "next/link"

const teacherLists = () => {
    return(
        <>
        <Link className="text-stone-950 hover:text-gray-700" href={"/admin/:id/teacherLists/createTeacher"}>
            建立老師
        </Link>
            <span>

                teacherLists
            </span>
        </>
    )
}

export default teacherLists