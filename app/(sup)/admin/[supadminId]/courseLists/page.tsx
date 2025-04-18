import Link from "next/link"

const CourseLists = () => {
    return(
        <>
        <Link className="text-stone-950 hover:text-gray-700" href={"/admin/:id/courseLists/createCourse"}>
            建立課程
        </Link>
        <span>CourseLists</span>
        </>
    )
}

export default CourseLists