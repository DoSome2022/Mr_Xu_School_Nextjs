import { AdminNavbar } from "./_components/navbar";


const AdminLayout = ({
    children
}:{
    children: React.ReactNode;
}) => {
    return (
        <div className="h-full bg-slate-100" >
            <AdminNavbar />
            <main className=" bg-slate-100" >
            {children}
            </main>
        </div>
    )
}

export default AdminLayout ;