import Link from "next/link"

const schoolLists = () => {
    return(
        <>
        <Link className="text-stone-950 hover:text-gray-700" href={"/admin/:id/schoolLists/createSchool"}>
            建立學校
        </Link>
            <span>schoolLists</span>
        </>
    )
}

export default schoolLists