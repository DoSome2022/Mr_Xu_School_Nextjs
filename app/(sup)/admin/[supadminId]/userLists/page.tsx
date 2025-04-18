import Link from "next/link"

const userLists = () => {
    return(
        <>

        <div>
        <Link href="/admin/:id/userLists/parentsLists" >家長列表</Link>
        <br />
        <Link href="/admin/:id/userLists/teachersLists" >老師列表</Link>
        <br />
        <Link href="/admin/:id/userLists/adminsLists" >管理員列表</Link>  
        </div>

        <span> userLists</span>
        </>
    )
}

export default userLists