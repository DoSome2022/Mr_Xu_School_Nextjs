// "use client";

// import VoidCreateForm from "@/components/CreateForm/Void-Create-Form";

// const createVoidPage = () => {
//     return(
//         <div>
//             <h1>createVoidPage</h1>
//             <VoidCreateForm />
//         </div>
//     )
// }

// export default createVoidPage;

"use client";

import VoidCreateForm from "@/components/CreateForm/Void-Create-Form";

const CreateVoidPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white shadow-lg rounded-md p-6">
        <h1 className="text-2xl font-semibold text-[#e7915b] mb-6">
          建立補單
        </h1>
        <VoidCreateForm />
      </div>
    </div>
  );
};

export default CreateVoidPage;