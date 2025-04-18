import { ParentNavbar } from "./_components/navbar";



const ParentLayout = ({
    children
}:{
    children: React.ReactNode;
}) => {
    return (
        <div className="h-full bg-slate-100" >
                <ParentNavbar/>
            <main className=" bg-slate-100" >
            {children}
            </main>
        </div>
    )
}

export default ParentLayout ;