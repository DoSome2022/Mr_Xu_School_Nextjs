
// import Teacher_Data_Create_Form from "@/components/CreateForm/Teacher-Data-Create-Form "

// interface TeacherDataProps{
//     params:{
//         TeacherId: string
//     };
    
// }


// const TeacherData = ({params } : TeacherDataProps) => {


//     return(
//         <>
//             <Teacher_Data_Create_Form  TeacherId={params}/>
//         </>
//     )
// }

// export default TeacherData



"use client";

import Teacher_Data_Create_Form from "@/components/CreateForm/Teacher-Data-Create-Form ";



interface TeacherDataProps {
  params: {
    TeacherId: string;
  };
}

const TeacherData = ({ params }: TeacherDataProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20">
      <div className="bg-[#e7915b] shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">建立老師數據</h1>
        <Teacher_Data_Create_Form TeacherId={{ teacherdetailbyID: params.TeacherId }} />
      </div>
    </div>
  );
};

export default TeacherData;