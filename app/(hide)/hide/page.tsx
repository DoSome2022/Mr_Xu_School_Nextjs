"use client"

import { useSession } from 'next-auth/react'; 

const hidepage = () => {
    const session = useSession();
    
    // console.log(session?.data?.user)

    const userdata = session?.data?.user 

    if(userdata.staff === true && userdata.isadmin === true){
    return(
        <>
            <span>hidepage</span>
        <br />
            是admin

        </>
    )  
    }

    if(userdata.staff === true && userdata.isadmin === false){
        return(
            <>
                是老師　職員
            </>
        )

    }

    if(userdata.staff === false && userdata.isadmin === false){
        return(
            <>
                甚麼都不是
            </>
        )
    }

}

export default hidepage