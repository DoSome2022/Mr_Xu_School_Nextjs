import { SupAdminNavbar } from "./_components/navbar";




const SupAdminLayout = ({
    children
}:{
    children: React.ReactNode;
}) => {
    return (
        <div className="h-full bg-slate-100" >
            <SupAdminNavbar />
            <main className=" bg-slate-100" >
            {children}
            </main>
        </div>
    )
}

export default SupAdminLayout ;