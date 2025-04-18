import Link from "next/link"

const nodeList = () => {
    return(
        <>
        <Link className="text-stone-950 hover:text-gray-700" href={"/admin/:id/nodeLists/createNode"}>
            上傅筆記
        </Link>
            <span> nodeList </span>
        </>
    )
}

export default nodeList