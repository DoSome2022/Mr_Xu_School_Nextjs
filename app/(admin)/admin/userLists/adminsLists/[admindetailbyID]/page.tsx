"use client";
import Link from "next/link"
import { useParams } from 'next/navigation';
const AdminDetail = () => {

    const params = useParams<{admindetailbyID: string }>();
    const SupAdminID = params?.admindetailbyID as string;


    return(
        <>
            <span>AdminDetail</span>
        <br />
        <Link 
        className="text-stone-950 hover:text-gray-700" 
        href={`/admin/userLists/adminsLists/${SupAdminID}/edit`} 
        > 更改 </Link>
        <br />
        </>
    )
}
export default AdminDetail