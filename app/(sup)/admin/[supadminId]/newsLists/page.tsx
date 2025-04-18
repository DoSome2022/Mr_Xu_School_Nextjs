import Link from "next/link"

const newsLists = () =>{
    return(
        <>
        <Link className="text-stone-950 hover:text-gray-700" href={"/admin/:id/newLists/createNews"}>
            建立公告
        </Link>
            <span>newsLists</span>
        </>
    )
}

export default newsLists