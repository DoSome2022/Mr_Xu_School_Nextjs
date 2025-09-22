"use client";

import { logout_action } from "@/actions/logout";
import { Button } from "./ui/button";

export const Logout_Button = () =>{

    const  onClick = () =>{
        logout_action()
    }
    

    return (
        <>
            <Button onClick={onClick} >
                LogOut
            </Button>
        </>
    )

}