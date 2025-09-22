"use client";

import { AdminNavbar } from "@/app/(admin)/admin/_components/navbar";
import AdminComponents from "@/app/(admin)/admin/page";
import SupAdminPage from "@/app/(supadmin)/supadmin/[supadminid]/page";
import TeacherByIdComponents from "@/app/(teacher)/teacher/[teacherId]/page";
import { getUserById } from "@/data/user";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const PublicPage = () => {
    const session = useSession();
    const [isRefreshed, setIsRefreshed] = useState(false);


    useEffect(()=>{
        if(!isRefreshed){
            setTimeout(()=>{
            setIsRefreshed(true)
            if(typeof window !== "undefined") {

                window.location.reload();
            }
            },1000)
 

        }
    },[isRefreshed])


            

        

    console.log("--publicpage_session data : --  ",session?.data?.user.role, "-- END --")

    const staffuserdata = session?.data?.user

    //admin權限
    // if(staffuserdata?.staff === true && staffuserdata?.isadmin === true ){
        if(staffuserdata?.role === "ADMIN"){
            if(typeof window !== "undefined") {
                window.location.replace('/admin')
            }
                
        
        return(
            <>
            <AdminNavbar />
             <AdminComponents />   
            </>
        )
    }


    //supadmin 權限

    if(staffuserdata?.role === "SUPADMIN"){
        if(typeof window !== "undefined") {
            window.location.replace(`/supadmin/${staffuserdata?.id}`)
        }
            
    
    return(
        <>
  
         <SupAdminPage />   
        </>
    )
}

    //staff teacher權限
    // if(staffuserdata?.staff === true && staffuserdata?.isadmin === false ){
        if(staffuserdata?.role === "TEACHER"   ){
            if(typeof window !== "undefined") {
                window.location.replace(`/teacher/${staffuserdata?.id}`)
            }
               
        return(
            <>
                
            <TeacherByIdComponents/>

            </>
    )   

    }


}

export default PublicPage