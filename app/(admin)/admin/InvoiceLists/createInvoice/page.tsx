// "use client";

// import Invoice_Create_Form from "@/components/CreateForm/Invoice-Create-Form";

// const Invoice_Create_Page = () => {
//     return(
//         <>
//             <Invoice_Create_Form />
//         </>
//     )
// };

// export default Invoice_Create_Page;

"use client";

import TimeTemplate_Create_Form from "@/components/CreateForm/TimeTemplate-Create-Form";

const createtimetemplatePage = () => {
    return (
        <div className="pt-16 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-[#e7915b] mb-6">創建時間模板</h1>
                        <TimeTemplate_Create_Form />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default createtimetemplatePage;