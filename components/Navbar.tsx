import Link from "next/link"
import { Logout_Button } from "./logout_button"

const HeaderLinks = [
    {
        "id": "1",
        "name": "首頁",
        "path" : "/"
    },
    {
        "id": "2",
        "name": "登入",
        "path" : "/login"
    },
    {
        "id": "3",
        "name": "職員登入",
        "path" : "/stafflogin"
    },
    {
        "id": "4",
        "name": "main-admin",
        "path" : "/admin"
    },
    {
        "id": "5",
        "name": "sup-admin",
        "path" : "/admin/:id"
    },
    {
        "id": "6",
        "name": "老師",
        "path" : "/teacher/:id"
    },
    {
        "id": "7",
        "name": "家長",
        "path" : "/parent/:id"
    },
]

const Navbar = () => {
    return(
        <>
        <div className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center">

            
            <div className="space-x-4">

                {HeaderLinks.map((link)=>{
                    return(
                        <>
                        <div className="text-white hover:text-gray-300" key={`${link.id}`} >
                <Link key={`${link.id}`} href={`${link.path}`}>
                        {link.name}
                </Link>            
                        </div>

                        </>
                    )
                })}
            </div>

            
            </div>
        
        </div>
        </>
    )
}

export default Navbar