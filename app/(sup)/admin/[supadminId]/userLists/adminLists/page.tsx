import Link from "next/link"

const adminLists = () => {
    return(
        <>
        <Link className="text-stone-950 hover:text-gray-700" href={"/admin/:id/adminLists/createAdmin"}>
            建立管理員
        </Link>
            <span>

                adminLists
            </span>
        </>
    )
}

export default adminLists