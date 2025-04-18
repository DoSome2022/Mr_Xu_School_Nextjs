import Link from "next/link"

const userLists = () => {
    return(
        <>
        <div>
        <Link href="/admin/userLists/parentsLists" >家長列表</Link>
        <br />
        <Link href="/admin/userLists/teachersLists" >老師列表</Link>
        <br />
        <Link href="/admin/userLists/adminsLists" >管理員列表</Link>  
        </div>

        <span> userLists</span>


        </>
    )
}

export default userLists