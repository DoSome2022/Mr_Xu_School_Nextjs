"use client"

import Link from "next/link"
import { useParams } from "next/navigation";


const userListsbysupadmin = () => {

    const param = useParams();

    console.log("param :",  param ,"--end --"  );

    const supadminId = param?.supadminId as string;

    return(
        <>
        <div>
        <Link href={`/supadmin/${supadminId}/userLists/parentsLists`} >家長列表</Link>
        <br />
        <Link href={`/supadmin/${supadminId}/userLists/teachersLists`} >老師列表</Link>
        
        </div>

        <span> userListsbysupadmin</span>


        </>
    )
}

export default userListsbysupadmin