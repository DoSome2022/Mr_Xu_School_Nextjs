import Student_Create_Parent_Form from "@/components/CreateForm/Student-Create-Parent-Form";

const CreateStudents = () => {
  return (
    <div className="container mx-auto h-full w-full bg-gray-900 p-6">
      <h1 className="text-white text-2xl font-semibold mb-6">建立學生</h1>
      <Student_Create_Parent_Form />
    </div>
  );
};

export default CreateStudents;