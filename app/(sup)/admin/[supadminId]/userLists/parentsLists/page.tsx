import Link from "next/link"

const parentsLists = () => {
    return(
        <>
        <Link className="text-stone-950 hover:text-gray-700" href={"/admin/:id/parentsLists/createParent"}>
            建立家長
        </Link>
            <span>

                parentsLists
            </span>
        </>
    )
}

export default parentsLists