import Link from "next/link"

const CourseDetail = () => {
    return(
        <>
        <Link className="text-stone-950 hover:text-gray-700" href={"/admin/:id/courseLists/:id/createClass"}>
            建立課堂
        </Link>
            <span>CourseDetail</span>
        </>
    )
}

export default CourseDetail